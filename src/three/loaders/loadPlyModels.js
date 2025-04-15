// src/three/loaders/loadPlyModels.js

import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'

/**
 * 批量加载多个 .ply 模型，并将其添加到场景中
 *
 * @param {string[]} urls - PLY 文件路径数组
 * @param {THREE.Scene} scene - three.js 场景对象
 * @param {Object} [options] - 可选配置
 * @param {THREE.Material[]} [options.materials] - 对应每个模型的材质（可选）
 * @param {Function} [options.onLoad] - 所有模型加载完成时的回调（返回 mesh[]）
 * @param {Function} [options.onError] - 任意模型加载失败时回调（返回 error, url）
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}


export function loadPlyModels(urls, scene, options = {}) {
  const loader = new PLYLoader()
  const meshes = []
  let loadedCount = 0

  urls.forEach((url, index) => {
    loader.load(
      url,
      geometry => {
        geometry.computeVertexNormals()
        // 🎯 是否是需要渐显绘制的模型（如 floor2、floor3）
        const isAnimated = url.includes('floor2') || url.includes('floor3')

        // geometry.setDrawRange(0, 0) // 一开始不显示任何点
        // geometry.userData = {
        //   totalCount: geometry.attributes.position.count,
        //   shownCount: 0
        // }
        if (isAnimated) {
          const drawRatio = 1  // 👈 只绘制 50% 的点
          const totalPoints = geometry.attributes.position.count * drawRatio // ✅ 设置乱序索引
          const indices = Array.from({ length: totalPoints }, (_, i) => i)

          shuffle(indices) // 👈 打乱索引顺序
          geometry.setIndex(indices) // 设置乱序索引（重要）
  
          // ✅ 初始不绘制任何点
          const drawCount = Math.floor(geometry.userData.totalCount * drawRatio)
          geometry.setDrawRange(0, drawCount)

          geometry.userData = {
            totalCount: totalPoints,
            shownCount: 0,
            isAnimated: true  // 👈 用于动画循环识别
          }
        } else {
            // 🔥 不动画的模型直接显示所有点，不设置索引
            geometry.setDrawRange(0, geometry.attributes.position.count)
            geometry.userData = {
              isAnimated: false
            }
        }
        
        const hasColor = geometry.hasAttribute('color')
        const material = new THREE.PointsMaterial({
          size: 0.02,
          vertexColors: hasColor ? true : false,
          transparent: true,
          opacity: 0.6
        })
        material.userData = {
          time: Math.random() * Math.PI * 2,
          speed: 4
        }
        const mesh = new THREE.Points(geometry, material)
        mesh.name = `${url}`
        meshes.push(mesh)

        loadedCount++
        const percent = loadedCount / urls.length
        options.onProgress?.(percent*100)

        if (loadedCount === urls.length) {
          options.onLoad?.(meshes)
        }
      },
      xhr => {
        // 如果需要实时展示进度条的加载动画
        if (xhr.lengthComputable) {
          const realProgress = xhr.loaded / xhr.total
          const totalPercent = (loadedCount + realProgress) / urls.length
          options.onProgress?.(totalPercent)
        }
      },
      error => {
        console.error(`[PLY] 加载失败: ${url}`, error)
        options.onError?.(error, url)
      }
    )
  })
}
