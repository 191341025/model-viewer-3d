// src/three/utils/cleanupThree.js

/**
 * 清理 Three.js 场景相关资源，避免内存泄露
 *
 * @param {Object} options - 配置项
 * @param {THREE.WebGLRenderer} options.renderer - 渲染器
 * @param {THREE.Scene} options.scene - 场景对象
 * @param {THREE.OrbitControls} [options.controls] - 控制器（可选）
 * @param {number} [options.animationId] - requestAnimationFrame ID（可选）
 * @param {Function} [options.resizeHandler] - resize 监听器引用（可选）
 */
export function cleanupThree({
    renderer,
    scene,
    controls,
    animationId,
    resizeHandler
  }) {
    // ✅ 停止动画帧
    if (animationId) {
      cancelAnimationFrame(animationId)
    }

    // ✅ 移除 resize 监听器
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
    }

    // ✅ 遍历场景中所有 mesh，释放几何体和材质资源
    scene?.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose?.()

        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose?.())
        } else {
          obj.material?.dispose?.()
        }
      }
    })

    // ✅ 延迟销毁 renderer，避免冲突
    setTimeout(() => {
      if (renderer) {
        renderer.dispose?.()
        const dom = renderer.domElement
        if (dom && dom.parentNode) {
          dom.parentNode.removeChild(dom)
        }
      }
    }, 0)
    // ✅ 清除控制器（如 OrbitControls 绑定事件）
    controls?.dispose?.()

    // ✅ 清除场景中所有对象（模型、灯光等）
    if (scene?.clear) {
      scene.clear()
    }

    

    // ✅ 控制台提示
    console.log('[Three] ✅ 清理完成')
  }
  