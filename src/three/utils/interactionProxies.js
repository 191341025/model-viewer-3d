import * as THREE from 'three'

// 所有生成的交互代理都存储在这里
// 这是第一版几何绘制
const proxyMeshes = []

/**
 * 创建一个交互代理盒子
 * @param {String} name - 代理名称
 * @param {THREE.Vector3} center - 代理中心位置
 * @param {THREE.Vector3} size - 代理的包围盒尺寸
 * @param {Object} [options] - 可选项（透明度、颜色、缩放）
 */
export function createInteractionProxy(mesh, center, size, options = {}) {
  const scale = options.scale || 1.0
  const opacity = options.opacity ?? 0.0
  const color = options.color || 0x6E8B3D

  const geometry = new THREE.BoxGeometry(size.x * scale, size.y * scale, size.z * scale)
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthTest: false, // ✅ 关闭深度测试，不遮挡背后的点云
  })

  const proxy = new THREE.Mesh(geometry, material)
  proxy.position.copy(center)
  proxy.name = mesh.name                    // 用于 Three.js 内部识别
  proxy.userData.url = mesh.userData.url                // 原始文件路径，后续跳转可用
  proxy.userData.displayName = mesh.userData.fileName   // 卡片标题或自定义名称
  proxy.userData.isProxy = true
  proxyMeshes.push(proxy)
  return proxy
}

/**
 * 基于一个已加载的 Mesh 自动创建代理
 * @param {THREE.Mesh} mesh - ply 模型的 mesh 对象
 * @param {Object} [options] - 控制参数，如 scale、偏移、颜色等
 */
export function createProxyFromMesh(mesh, options = {}) {
  const box = new THREE.Box3().setFromObject(mesh)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  // 可选上浮一点点（比如 0.5m），避免与模型重叠太死
  if (options.offsetY) {
    center.y += options.offsetY
  }

  const proxy = createInteractionProxy(mesh, center, size, options)
  return proxy
}

/**
 * 获取所有交互代理体（供 raycaster 检测用）
 */
export function getAllProxies() {
  return proxyMeshes
}

export function clearAllProxies() {
  proxyMeshes.length = 0
}
