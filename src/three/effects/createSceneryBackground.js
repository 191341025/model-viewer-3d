// src/three/effects/createSceneryBackground.js
import * as THREE from 'three'

/**
 * 为场景添加远景几何体装饰，增强空间层次感
 * @param {THREE.Scene} scene
 * @param {Object} options
 * @param {number} options.count - 几何体数量
 * @param {number} options.area - 分布范围（生成在 ±area 范围内）
 * @param {number} options.minSize - 几何体最小尺寸
 * @param {number} options.maxSize - 几何体最大尺寸
 * @param {string[]} options.types - 几何体类型数组（如 ['box', 'sphere']）
 * @param {string[]} options.colorPalette - 可用颜色数组
 */
export function createSceneryBackground(scene, {
  count = 30,
  area = 500,
  minSize = 5,
  maxSize = 25,
  types = ['box', 'sphere', 'cone'],
  colorPalette = ['#999999', '#bbbbbb', '#dddddd']
} = {}) {
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
    const size = minSize + Math.random() * (maxSize - minSize)

    let geometry
    switch (type) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(size, 12, 12)
        break
      case 'cone':
        geometry = new THREE.ConeGeometry(size * 0.6, size, 8)
        break
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(size * 0.5, size * 0.5, size, 12)
        break
      default:
        geometry = new THREE.BoxGeometry(size, size, size)
        break
    }

    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.3,
      roughness: 0.8,
      transparent: true,
      opacity: 0.4
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(
      (Math.random() - 0.5) * area * 2,
      (Math.random() - 0.5) * area,
      (Math.random() - 0.5) * area * 2
    )

    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )

    scene.add(mesh)
  }
}
