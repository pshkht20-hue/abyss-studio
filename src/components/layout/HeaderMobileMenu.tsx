"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { navItems, site } from "@/data/site";
import { DecryptLine } from "@/components/motion/DecryptLine";
import { CINEMA } from "@/lib/motion";
import { HeaderCta } from "./HeaderCta";

type HeaderMobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function HeaderMobileMenu({ open, onClose }: HeaderMobileMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => {
      if (!mq.matches) onClose();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            key="mobile-menu-backdrop"
            className="site-header-mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            aria-label="Close menu"
            onClick={onClose}
          />
          <motion.div
            key="mobile-menu-panel"
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: CINEMA }}
            className="site-header-mobile-panel"
          >
            <div className="site-header-mobile-grid" aria-hidden />
            <div className="site-header-mobile-inner">
              <p className="type-meta-accent flex items-center gap-2">
                <span className="signal-dot scale-75" />
                Navigation protocol
              </p>
              <nav className="mt-10 flex flex-col" aria-label="Mobile primary">
                {navItems.map((item, i) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="site-header-mobile-link group"
                    onClick={onClose}
                    data-cursor="read"
                  >
                    <span className="type-meta-accent text-mutation/70 group-hover:text-mutation">
                      0{i + 2}
                    </span>
                    <DecryptLine
                      text={item.label}
                      delay={i * 60}
                      className="font-display text-[clamp(2rem,8vw,3rem)] text-bone"
                    />
                    <span className="site-header-mobile-arrow" aria-hidden>
                      →
                    </span>
                  </a>
                ))}
              </nav>
              <HeaderCta href="#vault" className="mt-12" onNavigate={onClose}>
                {site.cta}
              </HeaderCta>
              <p className="type-meta mt-10 text-mute/60">{site.coords}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
