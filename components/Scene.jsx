"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import Aircraft from "./Aircraft"

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 2.1, 5.4], fov: 38 }} shadows>

      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.6} castShadow />

      <Environment preset="sunset" />

      <Suspense fallback={null}>
        <Aircraft />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[12, 64]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      <OrbitControls target={[0, 0.2, 0]} enableDamping />
    </Canvas>
  )
}