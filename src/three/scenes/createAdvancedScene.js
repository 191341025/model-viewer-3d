// src/three/scenes/createAdvancedScene.js
import * as THREE from 'three'
import { createStars } from '../effects/createStars'
import { createGradientBackground } from '../effects/createGradientBackground'
import { createDustParticles } from '../effects/createDustParticles'
import { createMirrorFloor } from '../effects/createMirrorFloor'
import { createFog } from '../effects/createFog'

export function createAdvancedScene(options = {}) {
  const scene = new THREE.Scene()

  // ✅ 1. 设置背景（默认白色）
  if (options.enableGradientBg) {
    createGradientBackground(scene, options.gradientColors)
  } else {
    scene.background = new THREE.Color(options.backgroundColor || '#ffffff')
  }

  // ✅ 2. 添加星空
  if (options.enableStars) {
    const stars = createStars()
    scene.add(stars)
  }

  // ✅ 3. 添加全局雾效
  if (options.enableFog) {
    createFog(scene, options.fogColor || '#aaaaaa', options.fogNear || 10, options.fogFar || 100)
  }

  // ✅ 4. 添加柔光环境灯
  const ambient = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambient)

  // ✅ 5. 添加方向光
  const directional = new THREE.DirectionalLight(0xffffff, 1)
  directional.position.set(5, 10, 5)
  scene.add(directional)

  // ✅ 6. 添加镜面地板
  if (options.enableMirrorFloor) {
    const mirror = createMirrorFloor()
    scene.add(mirror)
  }

  // ✅ 7. 添加漂浮尘埃粒子
  if (options.enableDustParticles) {
    const dust = createDustParticles()
    scene.add(dust)
  }

  return scene
}
