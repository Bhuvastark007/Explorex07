"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Stars } from "@react-three/drei";
import gsap from "gsap";
import "@/components/cinematic/NebulaMaterial";

type SpaceSceneProps = {
  scrollProgress: number;
  activeChapterDepth: number;
};

export default function SpaceScene({ scrollProgress, activeChapterDepth }: SpaceSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const blackHoleRef = useRef<THREE.Mesh>(null);
  const nebulaRef = useRef<THREE.ShaderMaterial>(null);
  const dustRef = useRef<THREE.Points>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const cursor = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const count = 3600;
    const array = new Float32Array(count * 3);
    const seeded = (seed: number) => {
      const value = Math.sin(seed * 12.9898) * 43758.5453;
      return value - Math.floor(value);
    };
    for (let i = 0; i < count; i += 1) {
      const radius = 3 + seeded(i + 0.21) * 20;
      const theta = seeded(i + 1.37) * Math.PI * 2;
      const phi = Math.acos(2 * seeded(i + 2.41) - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      array[i * 3 + 2] = radius * Math.cos(phi);
    }
    return array;
  }, []);

  const planets = useMemo(
    () => [
      { position: new THREE.Vector3(-5, 2.5, -9), scale: 1.25, color: "#82b1ff" },
      { position: new THREE.Vector3(6.5, -2.8, -15), scale: 1.9, color: "#86efac" },
      { position: new THREE.Vector3(-7, 3.6, -21), scale: 1.3, color: "#f0abfc" },
    ],
    []
  );

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      cursor.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      cursor.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      const targetX = cursor.current.x * 0.4;
      const targetY = cursor.current.y * 0.22;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.03);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.03);
    }

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 9 - scrollProgress * 15, 0.04);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(scrollProgress * Math.PI * 2) * 1.4, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.3 + scrollProgress * 2.4, 0.04);
    state.camera.lookAt(0, 0, -10);

    if (blackHoleRef.current) {
      blackHoleRef.current.rotation.y += delta * 0.8;
      blackHoleRef.current.rotation.z += delta * 0.2;
      const scale = 1.2 + Math.sin(t * 3 + activeChapterDepth * 8) * 0.05;
      blackHoleRef.current.scale.setScalar(scale);
    }

    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.01;
      dustRef.current.position.z = -scrollProgress * 10;
    }

    if (planetRef.current) {
      planetRef.current.position.x = Math.sin(t * 0.4) * 0.8;
      planetRef.current.position.y = Math.cos(t * 0.28) * 0.6;
    }

    if (nebulaRef.current) {
      nebulaRef.current.uniforms.uTime.value = t;
      nebulaRef.current.uniforms.uScroll.value = scrollProgress;
    }

    gsap.to(state.camera.rotation, {
      x: cursor.current.y * 0.02,
      y: -cursor.current.x * 0.03,
      duration: 0.7,
      overwrite: true,
    });
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 5, 4]} intensity={1.2} color="#7dd3fc" />
      <pointLight position={[0, 0, 2]} intensity={14} color="#7c3aed" distance={15} />
      <pointLight position={[0, 0, -12]} intensity={18} color="#22d3ee" distance={26} />

      <mesh position={[0, 0, -8]} rotation={[-Math.PI / 2.5, 0, 0]}>
        <planeGeometry args={[28, 28, 128, 128]} />
        <nebulaMaterial
          ref={nebulaRef}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={blackHoleRef} position={[0, 0.2, -9]}>
        <torusGeometry args={[1.7, 0.58, 64, 128]} />
        <meshStandardMaterial color="#12122f" emissive="#4c1d95" emissiveIntensity={1.6} metalness={0.25} roughness={0.2} />
      </mesh>

      <mesh ref={planetRef} position={[3.8, -1.2, -13]}>
        <icosahedronGeometry args={[1.2, 12]} />
        <meshStandardMaterial color="#9f7aea" emissive="#4f46e5" emissiveIntensity={0.45} roughness={0.5} metalness={0.1} />
      </mesh>

      {planets.map((planet, idx) => (
        <mesh key={`${planet.color}-${idx}`} position={planet.position} scale={planet.scale}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshStandardMaterial color={planet.color} emissive={planet.color} emissiveIntensity={0.35} roughness={0.7} />
        </mesh>
      ))}

      <Points ref={dustRef} positions={particles} stride={3} frustumCulled>
        <PointMaterial size={0.03} transparent opacity={0.75} color="#dbecff" sizeAttenuation depthWrite={false} />
      </Points>

      <Stars radius={120} depth={70} count={5000} factor={4} saturation={0.5} fade speed={0.8} />
    </group>
  );
}
