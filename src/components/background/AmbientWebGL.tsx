"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import {
  isLowEndDevice,
  isMobileViewport,
  prefersReducedMotion,
  supportsWebGL,
} from "@/lib/background-capabilities";
import { NEBULA_FRAGMENT, NEBULA_VERTEX } from "./shaders/nebula";

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("Shader compile:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, NEBULA_VERTEX);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, NEBULA_FRAGMENT);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("Program link:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function AmbientWebGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion() || isMobileViewport() || !supportsWebGL()) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: isLowEndDevice() ? "low-power" : "high-performance",
    });
    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPosition = gl.getAttribLocation(program, "aPosition");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uPointer = gl.getUniformLocation(program, "uPointer");
    const uScroll = gl.getUniformLocation(program, "uScroll");
    const uVelocity = gl.getUniformLocation(program, "uVelocity");
    const uPrimary = gl.getUniformLocation(program, "uPrimary");
    const uSecondary = gl.getUniformLocation(program, "uSecondary");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, isLowEndDevice() ? 1 : 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const onPointer = (e: PointerEvent) => {
      ambientStore.setPointer(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onVisibility = () => ambientStore.setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    const draw = () => {
      raf.current = requestAnimationFrame(draw);
      if (!ambientStore.visible) return;

      const rgb = ambientStore.getSmoothedPaletteRgb();
      const [pr, pg, pb] = rgb.primary;
      const [sr, sg, sb] = rgb.secondary;
      const time = (performance.now() - startTime.current) * 0.001;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uPointer, ambientStore.pointer.x, ambientStore.pointer.y);
      gl.uniform1f(uScroll, ambientStore.scrollProgress);
      gl.uniform1f(uVelocity, ambientStore.scrollVelocity);
      gl.uniform3f(uPrimary, pr / 255, pg / 255, pb / 255);
      gl.uniform3f(uSecondary, sr / 255, sg / 255, sb / 255);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="ambient-webgl pointer-events-none fixed inset-0 z-0 hidden md:block"
      aria-hidden
    />
  );
}
