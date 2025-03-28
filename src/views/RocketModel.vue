<template>
    <div class="page-container">
        <h2 class="model-title">🚀 火箭模型展示页面</h2>
        <!-- ✅ 加载提示 -->
        <ProgressBar :progress="loadProgress" :v/>
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
    import { loadPlyModels } from '@/three/loaders/loadPlyModels'
    import { cleanupThree } from '@/three/utils/cleanupThree'
    import ProgressBar from '@/components/ProgressBar.vue'

    const canvasContainer = ref(null)
    const loadProgress = ref(0)

    // const urls = [
    //     '/rocket/rocket1.ply',
    //     '/rocket/rocket2.ply',
    //     '/rocket/rocket3.ply'
    // ]

    const urls = [
        import.meta.env.BASE_URL + 'rocket/rocket.ply'
    ]
    let scene, camera, renderer, animationId, controls

    onMounted(() =>{
        //创建场景
        scene = createDefaultScene()

        //创建相机
        camera = initCamera(canvasContainer.value)

        // 创建渲染器
        renderer = initRenderer(canvasContainer.value)

        controls = initOrbitControls(camera, renderer.domElement)
        controls.minPolarAngle = 0;                // 最小仰角（默认值是 0）
        controls.maxPolarAngle = Math.PI;          // 最大仰角，从 π/2 扩大到 π


        const group = new THREE.Group()
        // const materials = []
        // const baseColors = [
        //     new THREE.Color(1, 0.6, 0.6),
        //     new THREE.Color(0.6, 1, 0.6),
        //     new THREE.Color(0.6, 0.6, 1)
        // ]
        // scene.add(group)

        // ✅ 在这里加载 ply 模型
        loadPlyModels(urls, scene, {
            onProgress: p => loadProgress.value = p,
            onLoad: (meshes) => {
                meshes.forEach((mesh, index) => {
                    console.log('加载成功:', mesh)
                    group.add(mesh)
                    scene.add(group)
                })
                fitCameraToObject(camera, controls, group, 0.5)
            },
            onError: (err, url) => {
                console.error('加载失败：', url, err)
            }
        })

        // 4. 动画渲染循环
        const animate = () => {
            animationId = requestAnimationFrame(animate)
            renderer.render(scene, camera)
            controls?.update()
        }
        
        animate()

        // 5. 监听窗口变化，自适应画布
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
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // ✅ 设置相机初始角度（斜前方视角）
        camera.position.copy(center.clone().add(new THREE.Vector3(10, 5, maxDim * offset)))
        camera.lookAt(center)

        // ✅ 更新控制器目标
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
  