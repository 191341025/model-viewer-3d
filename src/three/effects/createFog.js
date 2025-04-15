// src/three/effects/createFog.js
import * as THREE from 'three'

/**
 * 为场景添加雾效
 * @param {THREE.Scene} scene
 * @param {string|number} color
 * @param {number} near
 * @param {number} far
 */
export function createFog(scene, color = '#aaaaaa', near = 10, far = 100) {
  scene.fog = new THREE.Fog(color, near, far)
}
