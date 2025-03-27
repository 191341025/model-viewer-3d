// src/three/scenes/rocketScene.js
import * as THREE from 'three'

export function createRocketSecne() {
    const scene = new THREE.Scene()

    //背景色 or 星空背景
    scene.background = new THREE.Color('#e6f4ea')

    // 示例立方体
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshStandardMaterial({ color: '#ff8844'})
    const cube = new THREE.Mesh(geometry, material)
    cube.name = 'rocket-preview'
    scene.add(cube)

    //示例光源
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(3, 3, 3)
    scene.add(light)

    return scene
}