// src/three/loaders/loadPlyModel.js

import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'

/**
 * 加载 .ply 模型并添加到场景中
 *
 * @param {string} url - PLY 文件路径
 * @param {THREE.Scene} scene - 要添加模型的场景对象
 * @param {Object} [options] - 可选配置项
 * @param {Function} [options.onLoad] - 加载成功时回调（传入 mesh）
 * @param {Function} [options.onError] - 加载失败时回调（传入 error）
 * @param {THREE.Material} [options.material] - 自定义材质（可选）
 */
export function loadPlyModel(url, scene, options = {}) {
  const loader = new PLYLoader()
  loader.load(
    url,

    // ✅ 加载成功
    geometry => {
      // 自动计算顶点法线（用于光照效果）
      geometry.computeVertexNormals()

      // 如果几何体中带颜色属性（例如 point cloud），启用顶点颜色
      const hasColor = geometry.hasAttribute('color')

      // 创建点材质
      const material = new THREE.PointsMaterial({
        size: 0.02, // 点的大小
        vertexColors: hasColor ? true : false, // 是否使用顶点颜色
        transparent: true, // 启用透明度
        opacity: 0.6 // 透明度值
      })

      // 创建网格对象（点模型或普通模型）
      const mesh = new THREE.Points(geometry, material)
      // ✅ 提取文件名用于 name，例如 floor1.ply
      const fileName = url.split('/').pop().replace('.ply', '')
      // 正确设置多个属性
      mesh.name = fileName                    // 用于 Three.js 内部识别
      mesh.userData.url = url                // 原始文件路径，后续跳转可用
      mesh.userData.displayName = fileName   // 卡片标题或自定义名称
      // 可选：居中几何体
      geometry.center()

      // 回调通知外部
      options.onLoad?.(mesh)
    },

    // ⏳ 加载进度（可以暂时忽略，也可以打印）
    xhr => {
      console.log(`[PLY] 加载中：${(xhr.loaded / xhr.total * 100).toFixed(1)}%`)
    },

    // ❌ 加载失败
    error => {
      console.error('[PLY] 加载失败：', error)
      options.onError?.(error)
    }
  )
}
