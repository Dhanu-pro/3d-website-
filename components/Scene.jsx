"use client"

import { Suspense, useEffect, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import ModelWithPropeller from "./ModelWithPropeller"
import { createLenis } from "../lib/lenis"

function SceneContent({ scrollRootSelector, debug }) {
  const { camera } = useThree()
  const controls = debug ? <OrbitControls makeDefault enableDamping /> : null

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight
        position={[5, 9, 5]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 4, -6]} intensity={0.45} />
      <Environment preset="city" />

      <Suspense
        fallback={
          <mesh>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color="#8ecbff" emissive="#8ecbff" emissiveIntensity={0.75} />
          </mesh>
        }
      >
        <ModelWithPropeller camera={camera} scrollRootSelector={scrollRootSelector} />
      </Suspense>

      <group position={[0, -1.18, 0]}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.36, 0]}>
          <ringGeometry args={[3.5, 9.6, 96]} />
          <meshStandardMaterial color="#0e131c" metalness={0.1} roughness={0.95} />
        </mesh>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
          <circleGeometry args={[12, 96]} />
          <meshStandardMaterial color="#080b10" roughness={1} metalness={0.08} />
        </mesh>
      </group>

      {debug ? <axesHelper args={[6]} /> : null}
      {controls}
    </>
  )
}

export default function Scene() {
  const [debug, setDebug] = useState(false)

  useEffect(() => {
    const smoothScroll = createLenis()
    return () => smoothScroll.destroy()
  }, [])

  return (
    <div className="scene-shell">
      <Canvas camera={{ position: [0, 0, 5], fov: 36 }} shadows dpr={[1, 1.75]}>
        <color attach="background" args={["#05070b"]} />
        <SceneContent scrollRootSelector="#scroll-root" debug={debug} />
      </Canvas>

      <button type="button" className="debug-toggle" onClick={() => setDebug((value) => !value)}>
        {debug ? "Disable debug" : "Enable debug"}
      </button>

      <div className="scene-vignette" />
    </div>
  )
}
