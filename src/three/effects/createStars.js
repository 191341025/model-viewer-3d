// src/three/effects/createStars.js
import * as THREE from 'three'

/**
 * 创建星空粒子对象
 * @returns {THREE.Points}
 */
export function createStars(count = 3000) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 800
    positions[i * 3 + 1] = (Math.random() - 0.5) * 400
    positions[i * 3 + 2] = (Math.random() - 0.5) * 800
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 })
  return new THREE.Points(geometry, material)
}
