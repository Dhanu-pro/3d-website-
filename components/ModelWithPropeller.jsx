"use client"

import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function prepareCenteredClone(source, targetSize, groundLock = false) {
  const clone = source.clone(true)
  const box = new THREE.Box3().setFromObject(clone)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z) || 1

  clone.position.sub(center)
  clone.scale.setScalar(targetSize / maxDim)

  if (groundLock) {
    const groundedBox = new THREE.Box3().setFromObject(clone)
    clone.position.y -= groundedBox.min.y
  }

  clone.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  return clone
}

function Platform({ position, scale = [1, 1, 1], tone = "#97d7ff", accent = "#f6d38b" }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.85, 1.15, 0.18, 48]} />
        <meshStandardMaterial color="#10141c" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <torusGeometry args={[0.74, 0.05, 16, 64]} />
        <meshStandardMaterial color={tone} emissive={tone} emissiveIntensity={0.18} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.17, 0]}>
        <torusGeometry args={[0.34, 0.035, 16, 48]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.12} metalness={0.55} roughness={0.25} />
      </mesh>
    </group>
  )
}

export default function ModelWithPropeller({ camera, scrollRootSelector }) {
  const modelGroup = useRef()
  const propellerSpin = useRef()

  const vehicle = useGLTF("/models/va04.glb")
  const propellerAsset = useGLTF("/models/propeller.glb")

  const mainModel = useMemo(() => prepareCenteredClone(vehicle.scene, 5.8, true), [vehicle.scene])
  const propeller = useMemo(() => prepareCenteredClone(propellerAsset.scene, 0.9, false), [propellerAsset.scene])

  useLayoutEffect(() => {
    if (!modelGroup.current || !camera) return undefined

    const triggerElement = document.querySelector(scrollRootSelector || "#scroll-root")
    if (!triggerElement) return undefined

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      })

      timeline
        .to(
          modelGroup.current.position,
          {
            x: -0.1,
            y: 0.05,
            z: 0.08,
            ease: "none",
          },
          0
        )
        .to(
          modelGroup.current.rotation,
          {
            y: Math.PI * 1.18,
            x: -0.02,
            ease: "none",
          },
          0
        )
        .to(
          camera.position,
          {
            x: 0.18,
            y: 0.08,
            z: 4.35,
            ease: "none",
          },
          0
        )
        .to(
          modelGroup.current.position,
          {
            x: 0.36,
            y: -0.08,
            z: -0.32,
            ease: "none",
          },
          0.62
        )
        .to(
          modelGroup.current.rotation,
          {
            y: Math.PI * 1.85,
            x: 0.06,
            z: -0.02,
            ease: "none",
          },
          0.62
        )
        .to(
          camera.position,
          {
            x: 0.28,
            y: 0.16,
            z: 5.6,
            ease: "none",
          },
          0.62
        )
    }, modelGroup)

    ScrollTrigger.refresh()

    return () => context.revert()
  }, [camera, scrollRootSelector])

  useFrame((_, delta) => {
    if (propellerSpin.current) {
      propellerSpin.current.rotation.z += delta * 12
    }
    if (camera) {
      camera.lookAt(0, 0.2, 0)
    }
  })

  return (
    <group ref={modelGroup} position={[0, -1.12, 0]} rotation={[0.02, 0.1, 0]}>
      <primitive object={mainModel} />

      <group position={[0.18, 0.24, 1.98]} rotation={[0.05, Math.PI * 0.5, 0.08]} scale={[0.7, 0.7, 0.7]}>
        <group ref={propellerSpin} position={[0, 0, 0]}>
          <primitive object={propeller} />
        </group>
      </group>

      <Platform position={[-2.8, -1.25, -1.2]} scale={[1.5, 1, 1.5]} tone="#7ed7ff" accent="#f2cf92" />
      <Platform position={[2.45, -1.05, 1.15]} scale={[1.1, 0.9, 1.1]} tone="#b7a4ff" accent="#9df4d3" />
    </group>
  )
}

useGLTF.preload("/models/va04.glb")
useGLTF.preload("/models/propeller.glb")
