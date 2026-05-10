"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CHAPTERS } from "@/components/cinematic/data";
import FloatingHUD from "@/components/cinematic/FloatingHUD";
import PhysicsPanels from "@/components/cinematic/PhysicsPanels";

const SpaceCanvas = dynamic(() => import("@/components/cinematic/SpaceCanvas"), {
  ssr: false,
});

export default function CinematicExperience() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const introTimer = window.setTimeout(() => setLoaded(true), 2800);
    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const nextProgress = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.max(0, Math.min(1, nextProgress)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeChapter = useMemo(() => {
    return CHAPTERS.reduce((current, chapter) =>
      Math.abs(chapter.depth - progress) < Math.abs(current.depth - progress) ? chapter : current
    );
  }, [progress]);

  return (
    <div className="relative overflow-clip bg-[#02030a] text-white">
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#02030a]"
          >
            <div className="pointer-events-none text-center">
              <p className="text-xs tracking-[0.7em] text-white/50">LOADING EXPLORE.X CHANNEL</p>
              <h1 className="mt-5 text-5xl font-light tracking-[0.35em] text-shadow-glow">
                EXPLORE.X
              </h1>
              <p className="mt-3 text-xs tracking-[0.32em] text-white/50">SPACE. SCIENCE. STORYTELLING.</p>
              <div className="mx-auto mt-8 h-px w-44 overflow-hidden bg-white/10">
                <motion.span
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                  className="block h-full bg-linear-to-r from-transparent via-red-400 to-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative h-[620vh]">
        <div className="sticky top-0 h-screen">
          <SpaceCanvas scrollProgress={progress} activeChapterDepth={activeChapter.depth} />
          <FloatingHUD chapter={activeChapter} progress={progress} />
        </div>
      </section>

      <PhysicsPanels progress={progress} chapters={CHAPTERS} />
      <section className="relative z-30 px-6 pb-28 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-xl">
          <div>
            <p className="text-xs tracking-[0.36em] text-white/55">CHANNEL CTA</p>
            <h3 className="mt-2 text-2xl font-light tracking-[0.1em] text-white">Subscribe for weekly cosmic stories</h3>
          </div>
          <button className="rounded-full bg-red-600 px-6 py-3 text-xs font-medium tracking-[0.25em] text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] transition hover:bg-red-500">
            SUBSCRIBE
          </button>
        </div>
      </section>
    </div>
  );
}
