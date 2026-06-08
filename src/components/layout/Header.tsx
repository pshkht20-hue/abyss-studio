"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { chapters, navItems, site } from "@/data/site";
import { Logo3D } from "@/components/ui/Logo3D";
import { CornerBracket } from "@/components/ui/CornerBracket";
import type { ChapterId } from "@/lib/chapter-palettes";
import { ambientStore } from "@/lib/ambient-store";
import { CHAPTER_ORDER } from "@/lib/chapter-palettes";
import { HeaderNavLink } from "./HeaderNavLink";
import { HeaderCta } from "./HeaderCta";
import { HeaderMobileMenu } from "./HeaderMobileMenu";

const NAV_CHAPTER: Record<(typeof navItems)[number]["id"], ChapterId> = {
  arsenal: "ARSENAL",
  proof: "PROOF",
  timeline: "TIMELINE",
  vault: "VAULT",
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [chapterIdx, setChapterIdx] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const sync = () => {
      setScrolled(ambientStore.scrollProgress > 0.012);
      const idx = CHAPTER_ORDER.indexOf(ambientStore.chapter);
      if (idx >= 0) setChapterIdx(idx);
    };
    sync();
    return ambientStore.subscribe(sync);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = useCallback(() => setOpen(false), []);

  const activeChapter = chapters[chapterIdx];

  return (
    <>
      <header
        className="site-header"
        data-scrolled={scrolled || undefined}
        data-menu-open={open || undefined}
      >
        <div className="site-header-ambient" aria-hidden />

        <div className="site-header-inner">
          <div className="site-header-brand">
            <Logo3D size="md" />
            <div className="site-header-meta hidden lg:flex">
              <span className="signal-dot scale-75" />
              <span>Signal · Active</span>
              <span className="site-header-meta-sep">│</span>
              <span className="text-mute">b.{site.build}</span>
              <span className="site-header-meta-sep">│</span>
              <span className="site-header-meta-chapter">
                AB/{activeChapter.index} · {activeChapter.label}
              </span>
            </div>
          </div>

          <nav className="site-header-nav hidden md:flex" aria-label="Primary">
            <CornerBracket size="sm" />
            {navItems.map((item, i) => (
              <HeaderNavLink
                key={item.id}
                href={`#${item.id}`}
                index={`0${i + 2}`}
                label={item.label}
                chapter={NAV_CHAPTER[item.id]}
              />
            ))}
          </nav>

          <div className="site-header-actions hidden md:flex">
            <HeaderCta href="#vault">{site.cta}</HeaderCta>
          </div>

          <button
            type="button"
            className="site-header-menu-btn relative z-[3] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="site-header-menu-icon" aria-hidden>
              {open ? "×" : "≡"}
            </span>
            <span>{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </header>

      {!reduced && <HeaderMobileMenu open={open} onClose={closeMenu} />}
    </>
  );
}
