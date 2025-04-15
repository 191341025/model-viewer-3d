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
export function loadPlyModels(urls, scene, options = {}) {
  const loader = new PLYLoader()
  const meshes = []
  let loadedCount = 0

  urls.forEach((url, index) => {
    loader.load(
      url,
      geometry => {
        geometry.computeVertexNormals()
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
