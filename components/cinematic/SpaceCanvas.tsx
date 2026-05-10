"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import SpaceScene from "@/components/cinematic/SpaceScene";

type SpaceCanvasProps = {
  scrollProgress: number;
  activeChapterDepth: number;
};

export default function SpaceCanvas({ scrollProgress, activeChapterDepth }: SpaceCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.4, 9], fov: 55 }}
      className="bg-[#02030a]"
    >
      <color attach="background" args={["#02030a"]} />
      <fog attach="fog" args={["#02030a", 10, 45]} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <Suspense fallback={null}>
        <SpaceScene scrollProgress={scrollProgress} activeChapterDepth={activeChapterDepth} />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.18} luminanceSmoothing={0.45} />
          <ChromaticAberration offset={[0.0016, 0.0012]} blendFunction={BlendFunction.NORMAL} />
          <Vignette eskil={false} offset={0.15} darkness={0.75} />
        </EffectComposer>
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
