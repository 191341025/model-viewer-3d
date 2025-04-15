// src/three/effects/createMirrorFloor.js
import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

/**
 * 创建镜面地板（需要引入 Reflector 模块）
 * @returns {THREE.Mesh}
 */
export function createMirrorFloor() {
  const geometry = new THREE.PlaneGeometry(200, 200)
  const mirror = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x888888
  })
  mirror.rotateX(-Math.PI / 2)
  mirror.position.y = -0.01 // 贴近地面
  return mirror
}
