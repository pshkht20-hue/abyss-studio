"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { chapterSceneIndex } from "@/lib/chapter-scene-index";
import {
  isLowEndDevice,
  isMobileViewport,
  prefersReducedMotion,
  supportsWebGL,
} from "@/lib/background-capabilities";
import {
  HERO_DISTORTION_FRAGMENT,
  HERO_DISTORTION_VERTEX,
} from "./shaders/hero-distortion";

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type HeroDistortionFieldProps = {
  onReady?: () => void;
};

export function HeroDistortionField({ onReady }: HeroDistortionFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(false);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    if (prefersReducedMotion() || isMobileViewport() || !supportsWebGL()) {
      if (!readyRef.current) {
        readyRef.current = true;
        onReadyRef.current?.();
      }
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: isLowEndDevice() ? "low-power" : "high-performance",
    });
    if (!gl) {
      if (!readyRef.current) {
        readyRef.current = true;
        onReadyRef.current?.();
      }
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, HERO_DISTORTION_VERTEX);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, HERO_DISTORTION_FRAGMENT);
    if (!vs || !fs) {
      onReadyRef.current?.();
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      onReadyRef.current?.();
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      onReadyRef.current?.();
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPos = gl.getAttribLocation(program, "aPosition");
    const uRes = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uScroll = gl.getUniformLocation(program, "uScroll");
    const uMorph = gl.getUniformLocation(program, "uMorph");
    const uScene = gl.getUniformLocation(program, "uScene");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, isLowEndDevice() ? 1 : 1.5);
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const onPointer = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0) return;
      ambientStore.setPointer(
        (e.clientX - rect.left) / rect.width,
        (e.clientY - rect.top) / rect.height,
      );
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const start = performance.now();
    let raf = 0;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!ambientStore.visible) return;

      const scene = chapterSceneIndex(
        ambientStore.chapter,
        ambientStore.nextChapter,
        ambientStore.chapterBlend,
      );
      const heroScroll = Math.min(1, ambientStore.scrollProgress * 4);
      const time = (performance.now() - start) * 0.001;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, ambientStore.pointer.x, ambientStore.pointer.y);
      gl.uniform1f(uScroll, heroScroll);
      gl.uniform1f(uMorph, ambientStore.scrollVelocity * 0.6 + heroScroll * 0.15);
      gl.uniform1f(uScene, scene);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!readyRef.current) {
        readyRef.current = true;
        onReadyRef.current?.();
      }
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="hero-distortion-host pointer-events-none absolute inset-0 z-0 hidden md:block"
      aria-hidden
    >
      <canvas ref={canvasRef} className="hero-distortion-canvas h-full w-full" />
    </div>
  );
}
