"use client";

import { motion } from "framer-motion";
import { PhysicsChapter } from "@/components/cinematic/types";

type FloatingHUDProps = {
  chapter: PhysicsChapter;
  progress: number;
};

export default function FloatingHUD({ chapter, progress }: FloatingHUDProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute left-6 top-6 rounded-2xl border border-white/15 bg-black/40 px-5 py-4 backdrop-blur-xl">
        <p className="text-[10px] tracking-[0.4em] text-white/60">YOUTUBE CHANNEL MODE</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex h-5 items-center rounded-full bg-red-500/90 px-2 text-[10px] font-medium tracking-[0.18em] text-white">
            LIVE
          </span>
          <p className="text-lg font-light tracking-[0.18em] text-white/90">EXPLORE.X</p>
        </div>
        <p className="mt-2 text-xs text-white/60">1.2M subscribers | Space documentaries</p>
      </div>

      <motion.div
        key={chapter.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-10 left-6 max-w-md rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl"
      >
        <p className="text-[10px] tracking-[0.4em] text-white/60">NOW PLAYING</p>
        <h2 className="mt-2 text-2xl font-light tracking-[0.12em]" style={{ color: chapter.accent }}>
          {chapter.topic}
        </h2>
        <p className="mt-2 text-xs text-white/50">
          {chapter.episode} | {chapter.runtime}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">{chapter.description}</p>
      </motion.div>

      <div className="absolute bottom-10 right-6 w-52 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
        <p className="text-[10px] tracking-[0.35em] text-white/60">WATCH PROGRESS</p>
        <div className="mt-3 h-1 rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-red-500 via-violet-400 to-cyan-400"
            animate={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-white/60">{Math.round(progress * 100)}% viewed</p>
      </div>
    </div>
  );
}
