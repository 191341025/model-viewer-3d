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
    // 停止动画帧
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  
    // 移除窗口 resize 监听器
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
    }
  
    // 清除控制器（如 OrbitControls 绑定事件）
    controls?.dispose?.()
  
    // 清空场景（移除所有模型、光源等对象）
    if (scene?.clear) {
      scene.clear()
    }
  
    // 尝试释放 WebGL 渲染器内部缓存资源
    renderer?.dispose?.()
  
    console.log('[Three] ✅ 清理完毕')
  }
  