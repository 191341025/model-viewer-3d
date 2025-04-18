import { loadPlyModels } from '@/three/loaders/loadPlyModels'
export function loadModelAndInitEvents({
    urls,
    scene,
    group,
    canvas,
    onLoad,
    onError,
    onProgress,
    clickHandler
  }) {
    // 绑定鼠标点击判定事件
    let clickStart = { x: 0, y: 0 }
    canvas.addEventListener('mousedown', (e) => {
      clickStart = { x: e.clientX, y: e.clientY }
    })
  
    canvas.addEventListener('mouseup', (e) => {
      const dx = e.clientX - clickStart.x
      const dy = e.clientY - clickStart.y
      if (Math.sqrt(dx * dx + dy * dy) < 3) {
        clickHandler?.(e)
      }
    })
  
    // 加载模型
    loadPlyModels(urls, scene, {
      onLoad: (meshes) => onLoad(meshes),
      onError,
      onProgress
    })
  }