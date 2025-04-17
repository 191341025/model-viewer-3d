// src/three/loaders/loadPlyModels.js

import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'

/**
 * 打乱数组元素的顺序（原地操作）。
 * 
 * @param {Array} array - 需要打乱顺序的数组。
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)) // 随机生成一个索引
    ;[array[i], array[j]] = [array[j], array[i]] // 交换当前元素和随机索引的元素
  }
}

/**
 * 批量加载多个 .ply 模型，并将其添加到场景中。
 *
 * @param {string[]} urls - PLY 文件路径数组。
 * @param {THREE.Scene} scene - three.js 场景对象。
 * @param {Object} [options] - 可选配置。
 * @param {THREE.Material[]} [options.materials] - 对应每个模型的材质（可选）。
 * @param {Function} [options.onLoad] - 所有模型加载完成时的回调（返回 mesh[]）。
 * @param {Function} [options.onError] - 任意模型加载失败时回调（返回 error, url）。
 */
export function loadPlyModels(urls, scene, options = {}) {
  const loader = new PLYLoader() // 初始化 PLY 加载器
  const meshes = [] // 用于存储加载的模型网格
  let loadedCount = 0 // 计数器，用于跟踪已加载的模型数量

  urls.forEach((url, index) => {
    loader.load(
      url,
      geometry => {
        // 计算几何体的顶点法线（用于光照效果）
        geometry.computeVertexNormals()

        // 检查是否需要为模型添加动画效果（例如 floor2、floor3）
        const isAnimated = !url.includes('main')

        if (isAnimated) {
          const drawRatio = 1 // 绘制比例（例如 50% 的点）
          const totalPoints = geometry.attributes.position.count * drawRatio // 计算总点数
          const indices = Array.from({ length: totalPoints }, (_, i) => i) // 生成索引数组

          shuffle(indices) // 打乱索引顺序
          geometry.setIndex(indices) // 设置乱序索引（用于动画效果）

          // 初始不绘制任何点
          const drawCount = Math.floor(geometry.userData.totalCount * drawRatio)
          geometry.setDrawRange(0, drawCount)

          // 为几何体添加自定义数据，用于动画控制
          geometry.userData = {
            totalCount: totalPoints, // 总点数
            shownCount: 0, // 当前已显示的点数
            isAnimated: true // 标记为需要动画的模型
          }
        } else {
          // 不需要动画的模型，直接显示所有点
          geometry.setDrawRange(0, geometry.attributes.position.count)
          geometry.userData = {
            isAnimated: false // 标记为不需要动画的模型
          }
        }

        // 检查几何体是否包含颜色属性
        const hasColor = geometry.hasAttribute('color')
        // 创建点材质
        const material = new THREE.PointsMaterial({
          size: 0.02,
          vertexColors: hasColor? true: false,
          transparent: true,
          opacity: 0.8,
          depthWrite: false,   // ✅ 关闭深度写入，避免透明遮挡问题
          depthTest: true,     // ✅ 保持深度测试，正确遮挡排序
          blending: THREE.NormalBlending // ✅ 使用默认混合模式，效果更稳定
        })
        // 为材质添加自定义数据，用于动画控制
        material.userData = {
          time: Math.random() * Math.PI * 2, // 随机时间值
          speed: 4 // 动画速度
        }
        // 创建点网格对象
        const mesh = new THREE.Points(geometry, material)
        // ✅ 提取文件名用于 name，例如 floor1.ply
        const fileName = url.split('/').pop().replace('.ply', '')
        // 正确设置多个属性
        mesh.name = fileName                    // 用于 Three.js 内部识别
        mesh.userData.url = url                // 原始文件路径，后续跳转可用
        mesh.userData.displayName = fileName   // 卡片标题或自定义名称
        mesh.userData.originalColor = material.color.clone();   // 卡片标题或自定义名称
        mesh.renderOrder = 1;
        meshes.push(mesh) // 将网格添加到数组中

        loadedCount++ // 增加已加载模型计数
        // const percent = loadedCount / urls.length // 计算加载进度百分比
        // options.onProgress?.(percent * 100) // 调用进度回调函数

        // 如果所有模型都已加载完成，调用 onLoad 回调
        if (loadedCount === urls.length) {
          options.onLoad?.(meshes)
        }
      },
      xhr => {
        // 如果需要实时展示进度条的加载动画
        if (xhr.lengthComputable) {
          const realProgress = xhr.loaded / xhr.total // 计算当前文件的加载进度
          const totalPercent = ((loadedCount + realProgress) / urls.length) * 100// 计算总进度
          options.onProgress?.(totalPercent) // 调用进度回调函数
        }
      },
      error => {
        // 如果加载失败，打印错误信息并调用 onError 回调
        console.error(`[PLY] 加载失败: ${url}`, error)
        options.onError?.(error, url)
      }
    )
  })
}