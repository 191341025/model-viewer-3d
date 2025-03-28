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
    onProgress = () => {},
    position = { x: 0, y: 1.5, z: 0 },
    scale = { x: 1, y: 1, z: 1 },
    rotate = { x: 0, y: 0, z: 0 }
  } = options

  let mtlProgress = 0
  let objProgress = 0

  const updateProgress = () => {
    const total = (mtlProgress + objProgress) / 2
    onProgress(total*100) 
  }

  const mtlLoader = new MTLLoader()
  mtlLoader.load(mtlUrl, materials => {
    
    mtlProgress = 1
    updateProgress()

    materials.preload()

    const objLoader = new OBJLoader()
    objLoader.setMaterials(materials)
    objLoader.load(
      objUrl,
      object => {
        objProgress = 1
        updateProgress() // 👈 保证最终 total === 1

        object.position.set(position.x, position.y, position.z)
        object.scale.set(scale.x, scale.y, scale.z)
        object.rotation.set(rotate.x, rotate.y, rotate.z)
        
        console.log(objUrl)

        scene.add(object)

        onLoad(object)
      },
      xhr => {
        if (xhr.lengthComputable) {
          objProgress = xhr.loaded / xhr.total
          updateProgress()
        }
      },
      error => {
        console.error('[OBJ+MTL] 加载失败: ', error)
        onError(error)
      }
    )
  },
  xhr => {
    if (xhr.lengthComputable) {
      mtlProgress = xhr.loaded / xhr.total
      updateProgress()
    }
  },
   error => {
      console.error('[MTL] 加载失败: ', error)
      onError(error)
  })
}
