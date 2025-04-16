// src/three/effects/createStars.js
import * as THREE from 'three'
import starTexture from '@/assets/textures/star_06.png' // ⭐ 贴图路径（你下载的图）

/**
 * 创建星空粒子对象（使用发光贴图）
 * @returns {THREE.Points}
 */
export function createStars(count = 1500) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)

  const textureLoader = new THREE.TextureLoader()
  const starSprite = textureLoader.load(starTexture)

  starSprite.encoding = THREE.sRGBEncoding  // 确保颜色空间正确
  starSprite.minFilter = THREE.LinearFilter // 防止贴图模糊
  starSprite.magFilter = THREE.LinearFilter
  starSprite.anisotropy = 4

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 800
    positions[i * 3 + 1] = (Math.random() - 0.5) * 400
    positions[i * 3 + 2] = (Math.random() - 0.5) * 800
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    map: starSprite, // ⭐ 使用贴图
    size: 1,                    // 可调节：星星大小
    transparent: true,           // ✅ 允许透明
    alphaTest: 0.1,             // ⭐ 去掉黑边
    depthWrite: false,           // ✅ 防止遮挡其它模型
    blending: THREE.AdditiveBlending, // ⭐ 发光混合模式
    color: 0xffffff              // 星点颜色，可自由换色
  })

  return new THREE.Points(geometry, material)
}
