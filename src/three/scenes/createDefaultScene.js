// src/three/scenes/createDefaultScene.js
import * as THREE from 'three'

/**
 * 创建一个通用的 Three.js 场景
 * 适用于加载任意类型的 3D 模型（点云、Mesh 等）
 */
export function createDefaultScene() {
  // 创建场景容器
  const scene = new THREE.Scene()

  // 设置背景颜色（默认浅绿色）
  scene.background = new THREE.Color('#e6f4ea') // 可根据需要更换

  // 添加基础光源（方向光）
  const light = new THREE.DirectionalLight(0xffffff, 1) // 白光，强度1
  light.position.set(3, 3, 3) // 光照方向
  scene.add(light)

  // 可选：添加环境光（柔和整体照明）
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)

  return scene
}
