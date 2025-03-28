import * as THREE from 'three'

/**
 * 初始化 PerspectiveCamera（透视相机）
 * @param {HTMLElement} container - 绑定渲染器的 DOM 容器，用于计算宽高比
 * @returns {THREE.PerspectiveCamera} - 创建好的透视相机对象
 */
export function initCamera(container) {
    // 获取容器宽高，用于计算相机的宽高比（aspect）
    const width = container.clientWidth
    const height = container.clientHeight
    const aspect = width / height
  
    // 创建透视相机：视野角度75°，宽高比=容器比例，近平面0.1，远平面1000
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
  
    // 设置相机位置（x, y, z），默认拉远一点让我们能看到模型
    camera.position.set(0, 0, 5)
  
    // 可以可选设置相机看向的位置（一般默认就是看向原点）
    camera.lookAt(0, 0, 0)
  
    // 返回构建好的相机
    return camera
  }