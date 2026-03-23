"use client"

import { useGLTF } from "@react-three/drei"
import { useLoader, useFrame } from "@react-three/fiber"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { useMemo, useRef } from "react"
import * as THREE from "three"

export default function Aircraft() {
  const propRefs = useRef([])

  const { scene } = useGLTF("/models/va04.glb")
  const rawPropeller = useLoader(OBJLoader, "/models/propeller.obj")

  const { aircraft, aircraftSize } = useMemo(() => {
    const cloned = scene.clone(true)
    const initialBox = new THREE.Box3().setFromObject(cloned)
    const initialSize = initialBox.getSize(new THREE.Vector3())
    const initialCenter = initialBox.getCenter(new THREE.Vector3())
    const maxDim = Math.max(initialSize.x, initialSize.y, initialSize.z) || 1

    cloned.position.sub(initialCenter)

    // Keep the aircraft upright and not inverted.
    cloned.rotation.x = Math.PI
    cloned.scale.setScalar(20 / maxDim)

    const groundedBox = new THREE.Box3().setFromObject(cloned)
    cloned.position.y -= groundedBox.min.y
    cloned.position.y += 0.01

    const finalSize = new THREE.Box3().setFromObject(cloned).getSize(new THREE.Vector3())

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    return { aircraft: cloned, aircraftSize: finalSize }
  }, [scene])

  const propeller = useMemo(() => {
    const cloned = rawPropeller.clone(true)
    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1

    cloned.position.sub(center)
    const targetBladeSize = Math.max(aircraftSize.x, aircraftSize.y, aircraftSize.z) * 0.05
    cloned.scale.setScalar(targetBladeSize / maxDim)
    cloned.rotation.y = Math.PI * 0.5

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        child.material = new THREE.MeshStandardMaterial({
          color: "#121212",
          metalness: 0.75,
          roughness: 0.3,
        })
      }
    })

    return cloned
  }, [rawPropeller, aircraftSize])

  const turbinePositions = useMemo(() => {
    const halfWidth = 0.62
    const mountHeight = 1.03
    const depth = 0.06

    return [
      [-halfWidth, mountHeight, depth],
      [halfWidth, mountHeight, depth],
    ]
  }, [])

  useFrame((_, delta) => {
    propRefs.current.forEach((ref) => {
      if (ref) {
        ref.rotation.z += delta * 40
      }
    })
  })

  return (
    <group position={[0, -1.45, 0]}>
      <primitive object={aircraft} />

      {turbinePositions.map((pos, i) => (
        <group key={i} position={pos}>
          <group ref={(el) => (propRefs.current[i] = el)}>
            <primitive object={propeller.clone(true)} />
          </group>
        </group>
      ))}
    </group>
  )
}

useGLTF.preload("/models/va04.glb")