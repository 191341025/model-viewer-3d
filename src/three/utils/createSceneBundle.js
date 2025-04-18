import { createAdvancedScene } from '@/three/scenes/createAdvancedScene'
import { initCamera } from '@/three/camera/initCamera'
import { initRenderer } from '@/three/renderer/initRenderer'
import { initOrbitControls } from '@/three/controls/initOrbitControls'

export function createSceneBundle(container) {
    const scene = createAdvancedScene({
      enableGradientBg: true,
      gradientColors: ['#FFEFD5', '#CD853F'],
      enableStars: false,
      enableFog: false,
      fogColor: '#003366',
      fogNear: 30,
      fogFar: 200,
      enableMirrorFloor: false,
      enableDustParticles: false
    })
  
    const camera = initCamera(container)
    const renderer = initRenderer(container)
    const controls = initOrbitControls(camera, renderer.domElement)
    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI
  
    return { scene, camera, renderer, controls }
  }