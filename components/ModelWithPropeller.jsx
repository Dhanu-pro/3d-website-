"use client"

import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const PROFILE_BREAKPOINTS = {
  mobile: 768,
  tablet: 1100,
}

const SCENE_CALIBRATION = {
  desktop: {
    masterBasePosition: [0, -1.08, 0.2],
    masterBaseRotation: [0.03, 0.12, 0],
    planeBasePosition: [0, 0, 0],
    planeBaseRotation: [0, 0, 0],
    propellerOffset: [0.16, 0.26, 1.92],
    propellerRotation: [0.08, Math.PI * 0.5, 0.1],
    propellerScale: 0.7,
    focusOffset: [0.18, 0.2, 0.95],
    cameraBasePosition: [0.1, 0.2, 5.35],
    idleFloat: {
      bobAmplitude: 0.08,
      bobSpeed: 0.8,
      bankAmplitude: 0.04,
      bankSpeed: 0.55,
      pitchAmplitude: 0.025,
      pitchSpeed: 0.7,
    },
    sectionTimings: {
      hero: { trigger: ".hero-panel", start: "top bottom", end: "bottom top", scrub: 0.8 },
      section2: { trigger: ".section-2", start: "top 70%", end: "bottom 35%", scrub: 1.1 },
      section3: { trigger: ".section-3", start: "top 75%", end: "bottom 30%", scrub: 1.25 },
    },
    story: {
      intro: {
        position: [-0.18, 0.1, 0.15],
        rotation: [0.02, 0.4, -0.01],
        camera: [-0.25, 0.45, 5.7],
      },
      reveal: {
        position: [0.5, 0.22, -0.65],
        rotation: [-0.05, 1.55, 0.08],
        camera: [1.1, 0.85, 6.2],
      },
      orbit: {
        position: [0.2, -0.05, -1.45],
        rotation: [0.07, 3.7, -0.08],
        camera: [0.45, 0.6, 5.6],
      },
      departure: {
        position: [1.5, -0.6, -3.4],
        rotation: [0.12, 5.55, -0.18],
        camera: [1.9, 1.15, 7.4],
      },
    },
  },
  tablet: {
    masterBasePosition: [0, -1.04, 0.1],
    masterBaseRotation: [0.03, 0.08, 0],
    planeBasePosition: [0, 0, 0],
    planeBaseRotation: [0, 0, 0],
    propellerOffset: [0.14, 0.25, 1.86],
    propellerRotation: [0.08, Math.PI * 0.5, 0.09],
    propellerScale: 0.64,
    focusOffset: [0.14, 0.18, 0.9],
    cameraBasePosition: [0.05, 0.2, 4.95],
    idleFloat: {
      bobAmplitude: 0.065,
      bobSpeed: 0.78,
      bankAmplitude: 0.032,
      bankSpeed: 0.53,
      pitchAmplitude: 0.02,
      pitchSpeed: 0.66,
    },
    sectionTimings: {
      hero: { trigger: ".hero-panel", start: "top bottom", end: "bottom 20%", scrub: 0.85 },
      section2: { trigger: ".section-2", start: "top 72%", end: "bottom 38%", scrub: 1.05 },
      section3: { trigger: ".section-3", start: "top 78%", end: "bottom 34%", scrub: 1.2 },
    },
    story: {
      intro: {
        position: [-0.12, 0.08, 0.08],
        rotation: [0.02, 0.3, -0.01],
        camera: [-0.1, 0.42, 5.25],
      },
      reveal: {
        position: [0.35, 0.16, -0.5],
        rotation: [-0.03, 1.35, 0.06],
        camera: [0.8, 0.75, 5.7],
      },
      orbit: {
        position: [0.1, -0.04, -1.15],
        rotation: [0.05, 3.28, -0.06],
        camera: [0.3, 0.52, 5.2],
      },
      departure: {
        position: [1.05, -0.45, -2.65],
        rotation: [0.1, 5.0, -0.14],
        camera: [1.25, 0.95, 6.4],
      },
    },
  },
  mobile: {
    masterBasePosition: [0, -0.88, 0.08],
    masterBaseRotation: [0.01, 0.04, 0],
    planeBasePosition: [0, 0, 0],
    planeBaseRotation: [0, 0, 0],
    propellerOffset: [0.13, 0.22, 1.8],
    propellerRotation: [0.08, Math.PI * 0.5, 0.08],
    propellerScale: 0.58,
    focusOffset: [0.1, 0.24, 0.86],
    cameraBasePosition: [0, 0.3, 4.3],
    idleFloat: {
      bobAmplitude: 0.05,
      bobSpeed: 0.75,
      bankAmplitude: 0.025,
      bankSpeed: 0.5,
      pitchAmplitude: 0.016,
      pitchSpeed: 0.62,
    },
    sectionTimings: {
      hero: { trigger: ".hero-panel", start: "top bottom", end: "bottom 30%", scrub: 0.9 },
      section2: { trigger: ".section-2", start: "top 78%", end: "bottom 44%", scrub: 1.15 },
      section3: { trigger: ".section-3", start: "top 82%", end: "bottom 40%", scrub: 1.3 },
    },
    story: {
      intro: {
        position: [-0.05, 0.06, 0.05],
        rotation: [0.01, 0.22, 0],
        camera: [0.02, 0.45, 4.55],
      },
      reveal: {
        position: [0.18, 0.1, -0.35],
        rotation: [-0.01, 1.1, 0.03],
        camera: [0.45, 0.78, 4.95],
      },
      orbit: {
        position: [0.02, -0.02, -0.8],
        rotation: [0.04, 2.72, -0.04],
        camera: [0.15, 0.62, 4.75],
      },
      departure: {
        position: [0.58, -0.3, -1.95],
        rotation: [0.07, 4.38, -0.08],
        camera: [0.72, 0.98, 5.55],
      },
    },
  },
}

function cloneIntoScene(source, targetSize, groundLock = false) {
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

function copyVector(target, values) {
  target.set(values[0], values[1], values[2])
}

function getProfileFromWidth(width) {
  if (width < PROFILE_BREAKPOINTS.mobile) return "mobile"
  if (width < PROFILE_BREAKPOINTS.tablet) return "tablet"
  return "desktop"
}

function useResponsiveProfile() {
  const [profile, setProfile] = useState(() => {
    if (typeof window === "undefined") return "desktop"
    return getProfileFromWidth(window.innerWidth)
  })

  useEffect(() => {
    const onResize = () => {
      const nextProfile = getProfileFromWidth(window.innerWidth)
      setProfile((current) => (current === nextProfile ? current : nextProfile))
    }

    onResize()
    window.addEventListener("resize", onResize)

    return () => window.removeEventListener("resize", onResize)
  }, [])

  return profile
}

function DebugBoundsHelper({ targetRef, color = "#82d1ff", enabled }) {
  const { scene } = useThree()
  const helperRef = useRef(null)

  useEffect(() => {
    if (!enabled || !targetRef.current) return undefined

    const helper = new THREE.BoxHelper(targetRef.current, color)
    helperRef.current = helper
    scene.add(helper)

    return () => {
      scene.remove(helper)
      helper.geometry.dispose()
      helper.material.dispose()
      helperRef.current = null
    }
  }, [color, enabled, scene, targetRef])

  useFrame(() => {
    if (enabled && helperRef.current && targetRef.current) {
      helperRef.current.update()
    }
  })

  return null
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

function setupInitialState(calibration, camera, refs) {
  const { masterGroup, planeGroup, propellerGroup, focusTarget } = refs

  copyVector(masterGroup.current.position, calibration.masterBasePosition)
  copyVector(masterGroup.current.rotation, calibration.masterBaseRotation)
  copyVector(planeGroup.current.position, calibration.planeBasePosition)
  copyVector(planeGroup.current.rotation, calibration.planeBaseRotation)
  copyVector(propellerGroup.current.position, calibration.propellerOffset)
  copyVector(propellerGroup.current.rotation, calibration.propellerRotation)
  propellerGroup.current.scale.setScalar(calibration.propellerScale)
  copyVector(focusTarget.current.position, calibration.focusOffset)
  copyVector(camera.position, calibration.cameraBasePosition)
}

function createSectionTween(section, refs, camera, calibration) {
  const timing = calibration.sectionTimings[section]
  const story = calibration.story

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      ...timing,
      invalidateOnRefresh: true,
    },
  })

  if (section === "hero") {
    timeline
      .addLabel("intro")
      .to(refs.masterGroup.current.position, {
        x: story.intro.position[0],
        y: story.intro.position[1],
        z: story.intro.position[2],
      })
      .to(
        refs.masterGroup.current.rotation,
        {
          x: story.intro.rotation[0],
          y: story.intro.rotation[1],
          z: story.intro.rotation[2],
        },
        0
      )
      .to(
        camera.position,
        {
          x: story.intro.camera[0],
          y: story.intro.camera[1],
          z: story.intro.camera[2],
        },
        0
      )
  }

  if (section === "section2") {
    timeline
      .addLabel("reveal")
      .to(refs.masterGroup.current.position, {
        x: story.reveal.position[0],
        y: story.reveal.position[1],
        z: story.reveal.position[2],
      })
      .to(
        refs.masterGroup.current.rotation,
        {
          x: story.reveal.rotation[0],
          y: story.reveal.rotation[1],
          z: story.reveal.rotation[2],
        },
        0
      )
      .to(
        camera.position,
        {
          x: story.reveal.camera[0],
          y: story.reveal.camera[1],
          z: story.reveal.camera[2],
        },
        0
      )
      .addLabel("orbit")
      .to(
        refs.masterGroup.current.position,
        {
          x: story.orbit.position[0],
          y: story.orbit.position[1],
          z: story.orbit.position[2],
        },
        1
      )
      .to(
        refs.masterGroup.current.rotation,
        {
          x: story.orbit.rotation[0],
          y: story.orbit.rotation[1],
          z: story.orbit.rotation[2],
        },
        1
      )
      .to(
        camera.position,
        {
          x: story.orbit.camera[0],
          y: story.orbit.camera[1],
          z: story.orbit.camera[2],
        },
        1
      )
  }

  if (section === "section3") {
    timeline
      .addLabel("departure")
      .to(refs.masterGroup.current.position, {
        x: story.departure.position[0],
        y: story.departure.position[1],
        z: story.departure.position[2],
      })
      .to(
        refs.masterGroup.current.rotation,
        {
          x: story.departure.rotation[0],
          y: story.departure.rotation[1],
          z: story.departure.rotation[2],
        },
        0
      )
      .to(
        camera.position,
        {
          x: story.departure.camera[0],
          y: story.departure.camera[1],
          z: story.departure.camera[2],
        },
        0
      )
  }

  return timeline
}

function createScrollStory(calibration, refs, camera) {
  return [
    createSectionTween("hero", refs, camera, calibration),
    createSectionTween("section2", refs, camera, calibration),
    createSectionTween("section3", refs, camera, calibration),
  ]
}

export default function ModelWithPropeller({ camera, scrollRootSelector, debug = false }) {
  const masterGroup = useRef()
  const planeGroup = useRef()
  const propellerGroup = useRef()
  const focusTarget = useRef()
  const rotorRef = useRef()

  const lookAtVector = useRef(new THREE.Vector3())
  const targetWorldPosition = useRef(new THREE.Vector3())
  const idleTime = useRef(0)

  const profile = useResponsiveProfile()
  const calibration = SCENE_CALIBRATION[profile]

  const vehicle = useGLTF("/models/va04.glb")
  const propellerAsset = useGLTF("/models/propeller.glb")

  const mainModel = useMemo(() => cloneIntoScene(vehicle.scene, 5.8, true), [vehicle.scene])
  const propellerAssembly = useMemo(() => cloneIntoScene(propellerAsset.scene, 0.9, false), [propellerAsset.scene])

  useEffect(() => {
    const rotor = propellerAssembly.getObjectByName("ROTOR")
    rotorRef.current = rotor || null

    return () => {
      rotorRef.current = null
    }
  }, [propellerAssembly])

  useLayoutEffect(() => {
    if (!camera || !masterGroup.current || !planeGroup.current || !propellerGroup.current || !focusTarget.current) {
      return undefined
    }

    const refs = { masterGroup, planeGroup, propellerGroup, focusTarget }
    setupInitialState(calibration, camera, refs)

    const triggerElement = document.querySelector(scrollRootSelector || "#scroll-root")
    if (!triggerElement) return undefined

    const context = gsap.context(() => {
      createScrollStory(calibration, refs, camera)
    }, triggerElement)

    ScrollTrigger.refresh()

    return () => context.revert()
  }, [calibration, camera, profile, scrollRootSelector])

  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.z += delta * 18
    } else if (propellerGroup.current) {
      propellerGroup.current.rotation.z += delta * 12
    }

    if (planeGroup.current) {
      idleTime.current += delta
      const t = idleTime.current
      const idle = calibration.idleFloat

      planeGroup.current.position.y =
        calibration.planeBasePosition[1] + Math.sin(t * Math.PI * idle.bobSpeed) * idle.bobAmplitude
      planeGroup.current.rotation.z =
        calibration.planeBaseRotation[2] + Math.sin(t * Math.PI * idle.bankSpeed) * idle.bankAmplitude
      planeGroup.current.rotation.x =
        calibration.planeBaseRotation[0] + Math.cos(t * Math.PI * idle.pitchSpeed) * idle.pitchAmplitude
    }

    if (!debug && focusTarget.current && camera) {
      focusTarget.current.getWorldPosition(targetWorldPosition.current)
      lookAtVector.current.lerp(targetWorldPosition.current, 1 - Math.exp(-delta * 5))
      camera.lookAt(lookAtVector.current)
    }
  })

  return (
    <>
      <group ref={masterGroup}>
        <group ref={planeGroup}>
          <primitive object={mainModel} />

          <group ref={propellerGroup}>
            <primitive object={propellerAssembly} />
            {debug ? <axesHelper args={[0.6]} /> : null}
          </group>

          <object3D ref={focusTarget} />

          {debug ? (
            <mesh position={calibration.focusOffset}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color="#ffd166" />
            </mesh>
          ) : null}
        </group>
      </group>

      <Platform position={[-2.8, -1.25, -1.2]} scale={[1.5, 1, 1.5]} tone="#7ed7ff" accent="#f2cf92" />
      <Platform position={[2.45, -1.05, 1.15]} scale={[1.1, 0.9, 1.1]} tone="#9ad4ff" accent="#9df4d3" />

      <DebugBoundsHelper targetRef={planeGroup} color="#7ed7ff" enabled={debug} />
      <DebugBoundsHelper targetRef={propellerGroup} color="#f6d38b" enabled={debug} />
    </>
  )
}

useGLTF.preload("/models/va04.glb")
useGLTF.preload("/models/propeller.glb")
