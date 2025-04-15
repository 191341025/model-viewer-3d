// src/three/effects/createDustParticles.js
import * as THREE from 'three'

/**
 * 创建漂浮尘埃粒子对象
 * @returns {THREE.Points}
 */
export function createDustParticles(count = 800) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 300
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200
    positions[i * 3 + 2] = (Math.random() - 0.5) * 300
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.4,
    transparent: true,
    opacity: 0.2,
    depthWrite: false
  })
  return new THREE.Points(geometry, material)
}
