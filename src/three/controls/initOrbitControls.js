// src/three/controls/initOrbitControls.js

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * 初始化 OrbitControls（鼠标控制器）
 * 支持鼠标左键旋转，右键拖动，滚轮缩放
 *
 * @param {THREE.Camera} camera - 相机对象
 * @param {HTMLElement} domElement - 渲染器的 canvas 容器
 * @returns {OrbitControls} - 控制器实例
 */
export function initOrbitControls(camera, domElement) {
  // 创建控制器实例
  const controls = new OrbitControls(camera, domElement)

  // 开启阻尼效果，让交互更顺滑（需要在动画帧中调用 update）
  controls.enableDamping = true
  controls.dampingFactor = 0.05 // 阻尼系数（越大越“黏”）

  // 允许缩放（滚轮）
  controls.enableZoom = true
  // 允许旋转
  controls.enableRotate = true  
  // 允许拖拽（右键）
  controls.enablePan = false
  // 限制缩放距离（防止缩得太近或太远）
  controls.minDistance = 1
  controls.maxDistance = 100

  // 限制垂直旋转角度（防止翻转到背后）
  controls.maxPolarAngle = Math.PI / 2 // 最高仰视角度 = 90°
  controls.minPolarAngle = 0            // 最低俯视角度 = 0°

  return controls
}
