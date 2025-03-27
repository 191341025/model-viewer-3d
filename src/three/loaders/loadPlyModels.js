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

      // 加载成功
      geometry => {
        geometry.computeVertexNormals()

        const hasColor = geometry.hasAttribute('color')

        // 可传入自定义材质；否则使用默认点云材质
        const material =
          options.materials?.[index] ||
          new THREE.PointsMaterial({
            size: 0.01,
            vertexColors: hasColor,
            color: hasColor ? undefined : 0xffffff
          })

        const mesh = new THREE.Points(geometry, material)

        // 居中模型，使其以自身中心为原点
        geometry.center()

        scene.add(mesh)
        meshes.push(mesh)

        loadedCount++
        if (loadedCount === urls.length) {
          options.onLoad?.(meshes)
        }
      },

      undefined,

      // 加载失败
      error => {
        console.error(`[PLY] 加载失败: ${url}`, error)
        options.onError?.(error, url)
      }
    )
  })
}
