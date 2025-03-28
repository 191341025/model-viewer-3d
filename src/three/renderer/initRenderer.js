// src/three/renderer/initRenderer.js

import * as THREE from 'three'

/**
 * 初始化渲染器 WebGLRenderer
 * @param {HTMLElement} container - 要挂载 canvas 的 DOM 容器
 * @param {object} options - 可选配置项（可拓展）
 * @returns {THREE.WebGLRenderer} - 返回初始化好的渲染器实例
 * 
 * 模块说明
    antialias: true	开启抗锯齿，使图形边缘平滑
    alpha: true	canvas 透明背景支持（非必须，但实用）
    setPixelRatio()	自动适配高分辨率屏幕（防止模糊）
    physicallyCorrectLights	开启真实光照强度计算（推荐）
    outputEncoding	设置为 sRGBEncoding 保证颜色看起来更自然
 * 
 */
export function initRenderer(container, options = {}) {
  // 创建渲染器实例，并开启抗锯齿（边缘更平滑）
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿（让边缘不那么锯齿状）
    alpha: true,     // 允许透明背景（如果你需要场景透明）
    ...options       // 支持传入额外参数
  })

  // 设置渲染区域尺寸为容器的宽度和高度
  const width = container.clientWidth
  const height = container.clientHeight
  renderer.setSize(width, height)

  // 开启设备像素比支持（对高分屏如 Mac 视网膜屏更清晰）
  renderer.setPixelRatio(window.devicePixelRatio)

  // 可选：开启物理光照（比如使用 PBR 材质时更真实）
  renderer.physicallyCorrectLights = true

  // 可选：输出编码设置为 sRGB，使颜色显示更准确（适用于大部分项目）
  renderer.outputEncoding = THREE.sRGBEncoding

  // 将渲染器的 DOM 元素（canvas）添加到容器中
  container.appendChild(renderer.domElement)

  return renderer
}
