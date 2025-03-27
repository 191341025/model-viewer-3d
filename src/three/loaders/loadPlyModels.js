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
  let fakeProgress = 0

  const updateFakeProgress = () => {
    if (fakeProgress < 95) {
      fakeProgress += Math.random() * 2 // 每次涨 1~2%
      options.onProgress?.(Math.min(fakeProgress, 95))
      setTimeout(updateFakeProgress, 100)
    }
  }
  updateFakeProgress()

  urls.forEach((url, index) => {
    loader.load(
      url,
      geometry => {
        geometry.computeVertexNormals()
        const hasColor = geometry.hasAttribute('color')
        const material = new THREE.PointsMaterial({
          size: 0.02,
          vertexColors: hasColor,
          color: hasColor ? undefined : 0xffffff,
          transparent: true,
          opacity: 0.6
        })
        const mesh = new THREE.Points(geometry, material)
        mesh.name = `model-${index}`
        scene.add(mesh)
        meshes.push(mesh)

        loadedCount++
        const percent = Math.floor((loadedCount / urls.length) * 100)
        options.onProgress?.(percent)

        if (loadedCount === urls.length) {
          options.onLoad?.(meshes)
        }
      },
      xhr => {
        if (xhr.lengthComputable) {
          const realProgress = (xhr.loaded / xhr.total) * 100
          // 用真实进度融合假进度
          const percent = Math.min(fakeProgress + realProgress / urls.length, 99)
          options.onProgress?.(Math.floor(percent))
        }
      },
      error => {
        console.error(`[PLY] 加载失败: ${url}`, error)
        options.onError?.(error, url)
      }
    )
  })
}
