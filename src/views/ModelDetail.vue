<template>
    <div class="detail-container">
      <div class="left-panel">
        <div ref="canvasContainer" class="canvas-box"></div>
      </div>
      <div class="right-panel">
        <!-- 返回按钮 -->
        <button class="back-btn" @click="goBack">← 返回上一页</button>
        <h2>模型详情</h2>
        <p><strong>模型名称：</strong>{{ modelName }}</p>
        <p><strong>模型路径：</strong>{{ modelPath }}</p>
        <p><strong>编号：</strong>{{ modelId }}</p>
        <!-- 可扩展更多内容 -->
      </div>
    </div>
  </template>
  
  <script setup>
    import * as THREE from 'three'
    import { onMounted, ref, onBeforeUnmount } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { createDefaultScene } from '@/three/scenes/createDefaultScene'
    import { initCamera } from '@/three/camera/initCamera'
    import { initRenderer } from '@/three/renderer/initRenderer'
    import { loadPlyModel } from '@/three/loaders/loadPlyModel'
    import { initOrbitControls } from '@/three/controls/initOrbitControls'
    import { cleanupThree } from '@/three/utils/cleanupThree'
    import { createAdvancedScene } from '@/three/scenes/createAdvancedScene'
  
    const route = useRoute()
    const router = useRouter()
    const modelName = route.query.name || '未命名模型'
    const modelUrl = route.query.modelUrl || ''
    const modelId = route.query.id || '未知编号'
  
    const canvasContainer = ref(null)
  
    let scene, camera, renderer, controls, animationId
  
    onMounted(() => {
        document.body.style.cursor = 'default'
        initScene()
        loadPlyModelDetail(modelUrl)
        animate()
    })
  
    function initScene() {
        //创建场景
        // scene = createDefaultScene()
        scene = createAdvancedScene({
        enableGradientBg: true,
        gradientColors: ['#FFF68F', '#8B5742'],
        enableStars: false,
        enableFog: false,
        fogColor: '#003366',
        fogNear: 30,
        fogFar: 200,
        enableMirrorFloor: false,
        enableDustParticles: false
        })
        //创建相机
        camera = initCamera(canvasContainer.value)
        // 创建渲染器
        renderer = initRenderer(canvasContainer.value)

        controls = initOrbitControls(camera, renderer.domElement)
        controls.minPolarAngle = 0;                // 最小仰角（默认值是 0）
        controls.maxPolarAngle = Math.PI;          // 最大仰角，从 π/2 扩大到 π
    }
    
    function loadPlyModelDetail(url) {
        const group = new THREE.Group()
        // ✅ 在这里加载 ply 模型
        loadPlyModel(url, scene, {
            onLoad: (mesh) => {
                group.add(mesh)
                scene.add(group)
                group.rotation.x = -Math.PI / 2;
                fitCameraToObject(camera, controls, group, 1)
            },
            onError: (err, url) => {
                console.error('加载失败：', url, err)
            }
        })
    }
    
    function animate() {
        animationId = requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
    }

    function fitCameraToObject(camera, controls, object, offset = 1.5) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // center.y += -5.5 // 整体抬高模型焦点

        // ✅ 设置相机初始角度（斜前方视角）
        camera.position.copy(center.clone().add(new THREE.Vector3(10, 5, maxDim * offset)))
        camera.lookAt(center)

        // ✅ 更新控制器目标
        if (controls) {
            controls.target.copy(center)
            controls.update()
        }
    }

    function goBack() {
        router.back()
    }

    onBeforeUnmount(() => {
        cleanupThree({
            renderer,
            scene,
            controls,
            animationId,
            resizeHandler: onWindowResize
        })
    })

    function onWindowResize() {
        if (!camera || !renderer) return
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    

  </script>
  
  <style scoped>
  .detail-container {
        display: flex;
        height: 100vh;
        box-sizing: border-box;
    }
    
    .left-panel {
        flex: 1;
        padding: 12px;
        border-right: 1px solid #ccc;
    }
    
    .canvas-box {
        width: 100%;
        height: 100%;
        background-color: #666128;
        border-radius: 10px;
        min-height: 300px; /* 防止为0 */
        overflow: hidden;
    }
  
    .right-panel {
        flex: 1;
        padding: 24px;
        overflow-y: auto;
        background-color: #fefefe;
    }
    .back-btn {
        margin-bottom: 16px;
        padding: 6px 12px;
        font-size: 14px;
        border: none;
        background-color: #409eff;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .back-btn:hover {
        background-color: #66b1ff;
    }
  </style>
  