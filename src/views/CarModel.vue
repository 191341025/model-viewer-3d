<template>
    <div class="page-container">
        <h2 class="model-title">🚀 汽车模型展示页面</h2>
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
    import { loadGlbModel } from '@/three/loaders/loadGlbModel';
    import { cleanupThree } from '@/three/utils/cleanupThree'
    import ProgressBar from '@/components/ProgressBar.vue'

    const canvasContainer = ref(null)
    const loadProgress = ref(0)
    const glbPath = import.meta.env.BASE_URL + 'car/free_merc_hovercar.glb'


    
    const urls = [
        import.meta.env.BASE_URL + 'rocket/rocket.ply'
    ]
    let scene, camera, renderer, animationId, controls
    let autoRotate = true
    let rotateAngle = 0
    let autoScale = true
    let currentScale = 0.7 // 初始缩放

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

        // ✅ 在这里加载 glb 模型
        loadGlbModel({
            onProgress: p => loadProgress.value = p,
            path: glbPath,
            position: { x: 0, y: 1.5, z: 0 },              // 放置位置
            scale: { x: 8, y: 8, z: 8 },              // 缩放倍数
            rotate: { x: 0, y: 0, z: 0 },                // 初始角度
            onLoad: (model) => {
                console.log('模型已加载:', model);
                group.rotation.y = 0
                group.add(model)
                scene.add(group)
                fitCameraToObject(camera, controls, group, 0.5)

                // 👇 开始旋转一圈的动画
                autoRotate = true
                rotateAngle = 0
            }
        });


        const maxAngle = Math.PI / 6  // 最多旋转 30 度
        // 4. 动画渲染循环
        const animate = () => {
            animationId = requestAnimationFrame(animate)

            // ✅ 自动旋转（减缓速度）
            if (autoRotate) {
                // const delta = 0.009 // 更慢更柔和
                // group.rotation.y += delta
                // rotateAngle += delta

                // ✅ 用 easing 方式让 delta 变小，形成缓停
                const progress = rotateAngle / maxAngle        // 进度 0~1
                const eased = Math.cos(progress * Math.PI) * 0.5 + 0.5 // 余弦缓停曲线
                const delta = 0.02 * eased                     // delta 从大到小变化

                group.rotation.y += delta
                rotateAngle += delta

                if (rotateAngle >= Math.PI / 6) {
                autoRotate = false
                }
            }

            // ✅ 自动缩放（渐变放大）
            if (autoScale) {
                const target = 1.0
                const scaleStep = 0.003
                currentScale += scaleStep
                if (currentScale >= target) {
                currentScale = target
                    autoScale = false
                }
                group.scale.set(currentScale, currentScale, currentScale)
            }

            controls?.update()
            renderer.render(scene, camera)
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
  