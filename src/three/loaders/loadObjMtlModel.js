// src/three/loaders/loadObjMtlModel.js

import * as THREE from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

/**
 * 加载 .obj + .mtl 格式模型
 * @param {string} objUrl - obj 文件路径
 * @param {string} mtlUrl - mtl 文件路径
 * @param {THREE.Scene} scene - three.js 场景对象
 * @param {Object} options - 选填配置 onLoad/onError/position/scale/rotate
 */
export function loadObjMtlModel(objUrl, mtlUrl, scene, options = {}) {
  const {
    onLoad = () => {},
    onError = () => {},
    position = { x: 0, y: 0, z: 0 },
    scale = { x: 1, y: 1, z: 1 },
    rotate = { x: 0, y: 0, z: 0 }
  } = options

  const mtlLoader = new MTLLoader()
  mtlLoader.load(mtlUrl, materials => {
    materials.preload()

    const objLoader = new OBJLoader()
    objLoader.setMaterials(materials)

    objLoader.load(
      objUrl,
      object => {
        object.position.set(position.x, position.y, position.z)
        object.scale.set(scale.x, scale.y, scale.z)
        object.rotation.set(rotate.x, rotate.y, rotate.z)

        scene.add(object)
        onLoad(object)
      },
      undefined, // 加载进度不管了，有需要再增加
      error => {
        console.error('[OBJ+MTL] 加载失败: ', error)
        onError(error)
      }
    )
  }, error => {
    console.error('[MTL] 资源加载失败: ', error)
    onError(error)
  })
}
