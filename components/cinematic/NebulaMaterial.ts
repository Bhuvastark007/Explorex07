import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const NebulaMaterial = shaderMaterial(
  { uTime: 0, uScroll: 0, uColorA: new THREE.Color("#38157e"), uColorB: new THREE.Color("#0ea5e9") },
  `
    varying vec2 vUv;
    varying float vNoise;
    uniform float uTime;
    uniform float uScroll;

    float hash(vec3 p) {
      p = fract(p * 0.3183099 + .1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                     mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                 mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                     mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      float n = noise(vec3(pos.xy * 0.55, uTime * 0.05 + uScroll * 1.5));
      pos.z += n * 1.5;
      vNoise = n;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    varying float vNoise;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uScroll;

    void main() {
      float glow = smoothstep(0.2, 1.0, vNoise + uScroll * 0.2);
      vec3 color = mix(uColorA, uColorB, vUv.y + vNoise * 0.35);
      gl_FragColor = vec4(color, glow * 0.65);
    }
  `
);

extend({ NebulaMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    nebulaMaterial: ThreeElements["shaderMaterial"] & {
      uTime?: number;
      uScroll?: number;
      uColorA?: THREE.Color;
      uColorB?: THREE.Color;
      transparent?: boolean;
      depthWrite?: boolean;
      side?: THREE.Side;
      blending?: THREE.Blending;
    };
  }
}

export default NebulaMaterial;
