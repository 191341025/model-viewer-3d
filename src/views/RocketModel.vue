<template>
    <div class="page-container">
        <h4 class="model-title">🚀 火箭模型展示页面</h4>
        <!-- ✅ 加载提示 -->
        <ProgressBar :progress="loadProgress"/>
        <div ref="canvasContainer" class="canvas-container"></div>
        <!-- ✅ 交互信息弹窗组件 -->
        <InfoPopup
        :visible="popupVisible"
        :info="popupInfo"
        :style="popupStyle"
        @close="popupVisible = false"
        />
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
    import { createProxyFromMesh, getAllProxies } from '@/three/utils/interactionProxies'
    import InfoPopup from '@/components/InfoPopup.vue'

    let hoverEvent = null
    let needHoverCheck = false
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // 新增这两个变量

    const canvasContainer = ref(null)
    const loadProgress = ref(0)
    const loadedMeshes = ref([]) // 保存所有加载成功的点云模型

    const popupVisible = ref(false)
    const popupInfo = ref({ title: '', fields: {} })
    const popupStyle = ref({})

    // const urls = [
    //     import.meta.env.BASE_URL + '/rocket/rocket1.ply',
    //     import.meta.env.BASE_URL + '/rocket/rocket2.ply',
    //     import.meta.env.BASE_URL + '/rocket/rocket3.ply'
    // ]

    const urls = [
        import.meta.env.BASE_URL + '/rocket/main.ply',
        import.meta.env.BASE_URL + '/rocket/floor2.ply',
        import.meta.env.BASE_URL + '/rocket/floor3.ply'
    ]

    // const urls = [
    //     import.meta.env.BASE_URL + 'rocket/rocket.ply'
    // ]
    let scene, camera, renderer, animationId, controls

    onMounted(() =>{

        const markerPoints = [
            // { x: 71.557, y: -0.717, z: 8.947 }
            { x: 70.993, y: -0.276, z: 8.952 }
        ]

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
                loadedMeshes.value = meshes // 👈 保存下来以便 animate() 使用
                // hoverTargets.value = meshes.filter(m =>
                //     m.name.includes('floor2') || m.name.includes('floor3')
                // )
                meshes.forEach((mesh, index) => {
                    console.log('加载成功:', mesh)
                    group.add(mesh)
                    if (mesh.name.includes('floor2') || mesh.name.includes('floor3')) {
                        // ✅ 加入后再生成包围盒中心
                        const proxy = createProxyFromMesh(mesh, {
                        scale: 0.9,
                        offsetY: 0.1,
                        opacity: 0.0 // 先可见便于调试
                        })
                        group.add(proxy)
                    }
                })
                scene.add(group)
                group.rotation.x = -Math.PI / 2;
                loadedMeshes.value = meshes // 保存下来供 animate 使用
                // 鼠标监听
                renderer.domElement.addEventListener('mousemove', (event) => {
                    hoverEvent = event
                    needHoverCheck = true
                })

                fitCameraToObject(camera, controls, group, 1.5)
            },
            onError: (err, url) => {
                console.error('加载失败：', url, err)
            }
        })
        // 5. 监听窗口变化，自适应画布
        window.addEventListener('resize', onWindowResize)

        // 4. 动画渲染循环
        const animate = () => {
            animationId = requestAnimationFrame(animate)
            // 点云呼吸灯效果（通过透明度动画）
            loadedMeshes.value.forEach((mesh) => {
                const mat = mesh.material
                // console.log(mesh.name)
                if (mesh.name == '/model-viewer-3d//rocket/floor2.ply'
                    || mesh.name == '/model-viewer-3d//rocket/floor3.ply'
                ) {
                    mat.userData.time += 0.02 * mat.userData.speed
                    const pulse = (Math.sin(mat.userData.time) + 1) / 2
                    // mat.color.setRGB(0.0, pulse * 0.8 + 0.2, 1.0)
                    // mat.opacity = 0.2 + 0.7 * pulse // 呼吸更明显
                    mat.color.setRGB(0.0, 0.5, 1)
                    mat.opacity = 0.3 + 0.7 * pulse  // 范围：0.4 ~ 0.6（更自然）
                }
            })

            // ✅ 鼠标悬停代理检测（放在这里）
            if (needHoverCheck && hoverEvent) {
                needHoverCheck = false

                const rect = renderer.domElement.getBoundingClientRect()
                mouse.x = ((hoverEvent.clientX - rect.left) / rect.width) * 2 - 1
                mouse.y = -((hoverEvent.clientY - rect.top) / rect.height) * 2 + 1
                raycaster.setFromCamera(mouse, camera)

                // ✅ 代理体检测
                const intersects = raycaster.intersectObjects(getAllProxies(), false)
                if (intersects.length > 0) {
                    document.body.style.cursor = 'pointer'
                } else {
                    document.body.style.cursor = 'default'
                }
            }
            


            renderer.render(scene, camera)
            controls?.update()
        }
        
        animate()

        // const hoverTargets = ref([]) // 只检测目标对象

        renderer.domElement.addEventListener('click', (event) => {
            const rect = renderer.domElement.getBoundingClientRect()
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
            raycaster.setFromCamera(mouse, camera)

            const intersects = raycaster.intersectObjects(getAllProxies(), false)
            if (intersects.length > 0) {
            const mesh = intersects[0].object
            popupInfo.value = {
                title: mesh.name.replace('-proxy', ''),
                fields: {
                类型: '交互楼层',
                名称: mesh.name,
                编号: mesh.uuid.slice(0, 8)
                }
            }
            popupStyle.value = {
                top: `${event.clientY + 10}px`,
                left: `${event.clientX + 10}px`
            }
            popupVisible.value = true
            } else {
            popupVisible.value = false
            }
        })

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

        center.y += -5 // 整体抬高模型焦点

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
        gap: 6px;
        border-radius: 1px;
    }
    .canvas-container {
        width: 100%;
        height: calc(100vh - 200px);
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
  