// src/three/effects/createGradientBackground.js
import * as THREE from 'three'

/**
 * 创建渐变背景贴图并设置为场景背景
 * @param {THREE.Scene} scene
 * @param {[string, string]} colors - 渐变色数组 [topColor, bottomColor]
 */
export function createGradientBackground(scene, colors = ['#e0ffff', '#ffffff']) {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, colors[0])
  gradient.addColorStop(1, colors[1])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1, canvas.height)
  const texture = new THREE.CanvasTexture(canvas)
  scene.background = texture
}
