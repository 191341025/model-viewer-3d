``<template>
    <div class="page-container">
        <h2 class="model-title">🤖 钢铁侠</h2>
        <!-- ✅ 加载提示 -->
        <ProgressBar :progress="loadProgress" />
        <div ref="canvasContainer" class="canvas-container"></div>
    </div>
</template>

<script setup>
    import * as THREE from 'three'
    import { onMounted, ref, onBeforeUnmount } from 'vue';
    import { createDefaultScene } from '@/three/scenes/createDefaultScene'
    import { initCamera } from '@/three/camera/initCamera'
    import { initRenderer } from '@/three/renderer/initRenderer'
    import { initOrbitControls } from '@/three/controls/initOrbitControls'
    import { loadObjMtlModel } from '@/three/loaders/loadObjMtlModel'
    import { cleanupThree } from '@/three/utils/cleanupThree'
    import ProgressBar from '@/components/ProgressBar.vue'

    const canvasContainer = ref(null)
    const loadProgress = ref(0)

    const objPath = import.meta.env.BASE_URL + 'IronMan/IronMan.obj'
    const mtlPath = import.meta.env.BASE_URL + 'IronMan/IronMan.mtl'

    let scene, camera, renderer, animationId, controls

    onMounted(() => {
        // 1. 创建场景
        scene = createDefaultScene()

        // 2. 初始化相机
        camera = initCamera(canvasContainer.value)

        // 3. 初始化渲染器
        renderer = initRenderer(canvasContainer.value)

        // 4. 初始化轨道控制器（支持上下左右旋转）
        controls = initOrbitControls(camera, renderer.domElement)
        controls.minPolarAngle = 0                // 允许向上旋转到底
        controls.maxPolarAngle = Math.PI          // 允许向下旋转到底

        // 5. 创建模型容器（方便整体缩放、旋转、定位）
        const group = new THREE.Group()
        scene.add(group)

        // 6. 加载 OBJ + MTL 模型
        loadObjMtlModel(objPath, mtlPath, group, {
            onProgress: p => loadProgress.value = p,
            position: { x: 0, y: 0, z: 0 },              // 放置位置
            scale: { x: 0.3, y: 0.3, z: 0.3 },              // 缩放倍数
            rotate: { x: 0, y: 0, z: 0 },                // 初始角度
            onLoad: (obj) => {
                loadProgress.value = 1 // ✅ 主动触发进度为100%
                console.log('✅ 模型加载成功', obj)
                // 7. 加载成功后让相机自动适配模型视角
                fitCameraToObject(camera, controls, obj)
            },
            onError: (err) => {
                console.error('❌ 模型加载失败', err)
            }
        })

        // 8. 开始渲染动画循环
        const animate = () => {
            animationId = requestAnimationFrame(animate)
            controls?.update()
            renderer.render(scene, camera)
        }
        animate()

        // 9. 监听窗口大小变化，自动适配渲染区域
        window.addEventListener('resize', onWindowResize)
    })


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

    function fitCameraToObject(camera, controls, object, offset = 1.5) {
        const box = new THREE.Box3().setFromObject(object)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)

        // 相机定位在模型右前上方某个角度
        camera.position.copy(center.clone().add(new THREE.Vector3(10, 5, maxDim * offset)))
        camera.lookAt(center)

        // 控制器目标重设为模型中心
        if (controls) {
            controls.target.copy(center)
            controls.update()
        }
    }


</script>

<style scoped>
    .page-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .canvas-container {
        width: 100%;
        height: calc(100vh - 100px);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .loading-mask {
        position: absolute;
        top: 100px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 16px;
        color: #333;
    }
    .progress-bar {
        width: 60%;
        height: 10px;
        margin: 12px auto;
        background: #eee;
        border-radius: 6px;
        overflow: hidden;
    }
    .bar {
        height: 100%;
        background: linear-gradient(to right, #4caf50, #81c784);
    }


</style>
  