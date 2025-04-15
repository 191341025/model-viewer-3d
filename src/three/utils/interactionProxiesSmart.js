// interactionProxiesSmart.js
import * as THREE from 'three'

// 所有生成的交互代理都存储在这里
// 这是第二版几何绘制，第二个升级版 不但可以绘制平滑几何，还可以绘制复杂形状，完全可以根据Ply点位绘制
const smartProxyMeshes = []

/**
 * 基于 mesh 自动创建代理体（支持 geometry 贴合 或 Box3 包围盒）
 * @param {THREE.Mesh} mesh - ply 模型的 mesh 对象
 * @param {Object} [options] - 控制参数，如 scale、偏移、颜色等
 */
export function createSmartProxyFromMesh(mesh, options = {}) {
  const useGeometryProxy = options.useGeometryProxy ?? false
  const color = options.color || 0x00ffff
  const opacity = options.opacity ?? 0.0

  if (useGeometryProxy) {
    // ✅ 使用 geometry 创建贴合形状代理
    const geometry = mesh.geometry.clone()
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthTest: false
    })
    const proxy = new THREE.Mesh(geometry, material)
    proxy.userData.isProxy = true
    proxy.name = mesh.name + '-proxy'
    if (options.offsetY) {
        proxy.position.y += options.offsetY
    } else {
        proxy.position.copy(mesh.position)
    }

    smartProxyMeshes.push(proxy)
    return proxy
  } else { 
    // ✅ 使用 Box3 创建常规立方体代理
    const box = new THREE.Box3().setFromObject(mesh)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    if (options.offsetY) center.y += options.offsetY

    const scale = options.scale || 1.0
    const geometry = new THREE.BoxGeometry(size.x * scale, size.y * scale, size.z * scale)
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthTest: false
    })
    const proxy = new THREE.Mesh(geometry, material)
    proxy.userData.isProxy = true
    proxy.name = mesh.name + '-proxy'
    proxy.position.copy(center)
    smartProxyMeshes.push(proxy)
    return proxy
  }
}

/**
 * 获取所有智能交互代理体（供 raycaster 检测用）
 */
export function getAllSmartProxies() {
  return smartProxyMeshes
}

/**
 * 清空所有代理体（可用于场景切换等）
 */
export function clearSmartProxies() {
  smartProxyMeshes.length = 0
}
