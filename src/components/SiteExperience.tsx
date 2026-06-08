"use client";



import { useCallback, useRef, useState } from "react";

import { ScrollTrigger } from "gsap/ScrollTrigger";

import { AmbientBackground } from "@/components/background/AmbientBackground";

import { SmoothScroll } from "@/components/motion/SmoothScroll";

import { MotionTierRoot } from "@/components/motion/MotionTierRoot";
import { PaletteDriver } from "@/components/motion/PaletteDriver";

import { ScrollProgress } from "@/components/motion/ScrollProgress";

import { Header } from "@/components/layout/Header";

import { MarketTicker } from "@/components/layout/MarketTicker";

import { ScrollRail } from "@/components/layout/ScrollRail";

import { ChapterIndicator } from "@/components/layout/ChapterIndicator";

import { PageFrame } from "@/components/layout/PageFrame";

import { CustomCursor } from "@/components/layout/CustomCursor";

import { SkipLink } from "@/components/layout/SkipLink";

import { StickyCta } from "@/components/layout/StickyCta";

import { LoadingScreen } from "@/components/layout/LoadingScreen";

import { AppToaster } from "@/components/layout/AppToaster";

import { Footer } from "@/components/layout/Footer";

import { HeroChapter } from "@/components/home/HeroChapter";

import { ChapterDivider } from "@/components/home/ChapterDivider";

import { ArsenalBento } from "@/components/home/ArsenalBento";

import { ProofSection } from "@/components/home/ProofSection";

import { IntelligenceMetrics } from "@/components/home/IntelligenceMetrics";

import { ProcessTimeline } from "@/components/home/ProcessTimeline";

import { PhilosophyStanzas } from "@/components/home/PhilosophyStanzas";

import { VaultContact } from "@/components/home/VaultContact";

import { registerGsap } from "@/lib/gsap/register";



export function SiteExperience() {

  const [introDone, setIntroDone] = useState(false);

  const heroReadyRef = useRef(false);



  const onDistortionReady = useCallback(() => {

    heroReadyRef.current = true;

  }, []);



  const waitForReady = useCallback(() => heroReadyRef.current, []);



  const onIntroComplete = useCallback(() => {

    setIntroDone(true);

    requestAnimationFrame(() => {

      registerGsap();

      ScrollTrigger.refresh(true);

    });

  }, []);



  return (

    <>

      {!introDone && (

        <LoadingScreen onComplete={onIntroComplete} waitForReady={waitForReady} />

      )}



      <SmoothScroll>

        <SkipLink />

        <MotionTierRoot />

        <AmbientBackground />

        <PaletteDriver />

        <PageFrame />

        <CustomCursor />

        <ScrollProgress />

        <Header />

        <MarketTicker />

        <ScrollRail />

        <ChapterIndicator />

        <StickyCta />

        <AppToaster />



        <main id="main-content" className="relative z-10 pt-[var(--chrome-height)] pb-20 md:pb-0">

          <HeroChapter onDistortionReady={onDistortionReady} />

          <ChapterDivider roman="II" label="Arsenal" />

          <ArsenalBento />

          <ChapterDivider roman="III" label="Proof" />

          <ProofSection />

          <IntelligenceMetrics />

          <ChapterDivider roman="IV" label="Timeline" />

          <ProcessTimeline />

          <PhilosophyStanzas />

          <ChapterDivider roman="V" label="Vault" />

          <VaultContact />

        </main>



        <Footer />

      </SmoothScroll>

    </>

  );

}

