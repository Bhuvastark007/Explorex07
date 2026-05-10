"use client";

import { motion } from "framer-motion";
import { PhysicsChapter } from "@/components/cinematic/types";

type PhysicsPanelsProps = {
  chapters: PhysicsChapter[];
  progress: number;
};

export default function PhysicsPanels({ chapters, progress }: PhysicsPanelsProps) {
  return (
    <section className="relative z-30 bg-linear-to-b from-transparent via-[#02030a] to-[#02030a] px-6 pb-24 pt-24 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        {chapters.map((chapter, index) => {
          const distance = Math.abs(chapter.depth - progress);
          const active = distance < 0.12;
          return (
            <motion.article
              key={chapter.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: index * 0.08 }}
              className={`chapter-card rounded-3xl border p-7 backdrop-blur-xl transition-all duration-500 ${
                active ? "border-white/30 bg-white/10 shadow-[0_0_40px_rgba(99,102,241,0.25)]" : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-white/55">
                <p className="tracking-[0.35em]">{chapter.subtitle}</p>
                <p className="rounded-full border border-white/15 px-2 py-0.5">{chapter.runtime}</p>
              </div>
              <h3 className="mt-3 text-3xl font-light tracking-[0.08em]" style={{ color: chapter.accent }}>
                {chapter.topic}
              </h3>
              <p className="mt-2 text-xs tracking-[0.25em] text-white/50">{chapter.episode}</p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">{chapter.description}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-white/45">
                <span>Simulation tempo: {chapter.tempo.toFixed(2)}x</span>
                <span className="rounded-full bg-red-500/80 px-2 py-0.5 text-[10px] tracking-[0.18em] text-white">HD</span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
