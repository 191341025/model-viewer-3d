<template>
    <div class="page-container">
        <!-- <h4 class="model-title">🚀 火箭模型展示页面</h4> -->

        <button
        class="interaction-toggle"
        :class="{ active: interactionEnabled }"
        @click="toggleInteraction"
    >
        <span class="icon">✨</span>
        {{ interactionEnabled ? 'KFC楼体 关闭交互功能' : 'KFC楼体 开启交互功能' }}
    </button>
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
    import { onMounted, ref, onBeforeUnmount, watch  } from 'vue';
    import { createDefaultScene } from '@/three/scenes/createDefaultScene'
    import { createAdvancedScene } from '@/three/scenes/createAdvancedScene'
    import { initCamera } from '@/three/camera/initCamera'
    import { initRenderer } from '@/three/renderer/initRenderer'
    import { initOrbitControls } from '@/three/controls/initOrbitControls'
    import { loadPlyModels } from '@/three/loaders/loadPlyModels'
    import { cleanupThree } from '@/three/utils/cleanupThree'
    import ProgressBar from '@/components/ProgressBar.vue'
    import { createProxyFromMesh, getAllProxies } from '@/three/utils/interactionProxies'
    import { createSmartProxyFromMesh, getAllSmartProxies } from '@/three/utils/interactionProxiesSmart'
    import InfoPopup from '@/components/InfoPopup.vue'

    let hoverEvent = null
    let needHoverCheck = false
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const hoveredMesh = ref(null)
    const canvasContainer = ref(null)
    const loadProgress = ref(0)
    const loadedMeshes = ref([]) // 保存所有加载成功的点云模型

    const popupVisible = ref(false)
    const popupInfo = ref({ title: '', fields: {} })
    const popupStyle = ref({})

    const urls = [
        import.meta.env.BASE_URL + '/rocket/floor2.ply',
        import.meta.env.BASE_URL + '/rocket/floor3.ply',
        import.meta.env.BASE_URL + '/rocket/main.ply'
        
    ]
    

    const interactionEnabled = ref(false)

    function toggleInteraction() {
        interactionEnabled.value = !interactionEnabled.value
    }

    let scene, camera, renderer, animationId, controls

    onMounted(() =>{

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


        const group = new THREE.Group()

        // ✅ 在这里加载 ply 模型
        loadPlyModels(urls, scene, {
            onProgress: p => loadProgress.value = p,
            onLoad: (meshes) => {
                meshes.forEach((mesh, index) => {
                    // console.log('加载成功:', mesh)
                    group.add(mesh)
                    loadedMeshes.value.push(mesh)
                    if (mesh.name.includes('floor2') || mesh.name.includes('floor3')) {
                        //✅ 加入后再生成包围盒中心
                        const proxy = createProxyFromMesh(mesh, {
                            scale: 0.8,
                            offsetY: 0.1,
                            opacity: 0.0 // 先可见便于调试
                        })
                        // const proxy = createSmartProxyFromMesh(mesh, {
                        //     useGeometryProxy: false,      // ✅ 贴合形状
                        //     offsetY: 0.0,
                        //     opacity: 0.0,
                        //     color: 0x00ffff
                        // })
                        group.add(proxy)
                    }
                })
                scene.add(group)
                group.rotation.x = -Math.PI / 2;
                // 鼠标监听
                renderer.domElement.addEventListener('mousemove', (event) => {
                    hoverEvent = event
                    needHoverCheck = true
                })

                fitCameraToObject(camera, controls, group, 1)
            },
            onError: (err, url) => {
                console.error('加载失败：', url, err)
            }
        })
        // 5. 监听窗口变化，自适应画布
        window.addEventListener('resize', onWindowResize)
        let i = 0;
        // 4. 动画渲染循环
        const animate = () => {
            animationId = requestAnimationFrame(animate)

            // 动画循环里只处理需要动画的 mesh
            loadedMeshes.value.forEach((mesh) => {
                const geo = mesh.geometry
                if (!geo.userData?.isAnimated) return

                const { totalCount, shownCount } = geo.userData
                if (shownCount < totalCount) {
                    geo.userData.shownCount += 500 // 控制绘制速度
                    geo.setDrawRange(0, geo.userData.shownCount)
                }
            })

            // ✅ 更新当前悬停对象的呼吸动画
            if (interactionEnabled.value && hoveredMesh.value) {
                const mat = hoveredMesh.value.material
                if (mat && mat.userData) {
                    mat.userData.time += 0.02 * mat.userData.speed
                    const pulse = (Math.sin(mat.userData.time) + 1) / 2
                    // mat.color.setRGB(0.0, pulse * 0.5 + 0.1, 1.0)
                    mat.color.setRGB(0.0, 0.5 + 0.5 * pulse, 0.5 + 0.5 * pulse) // 亮青色
                    mat.opacity = 0.2 + 0.7 * pulse
                    mat.needsUpdate = true
                }
            }

            // ✅ 鼠标悬停代理检测（放在这里）
            if (needHoverCheck && hoverEvent && interactionEnabled.value) {
                needHoverCheck = false

                const rect = renderer.domElement.getBoundingClientRect()
                mouse.x = ((hoverEvent.clientX - rect.left) / rect.width) * 2 - 1
                mouse.y = -((hoverEvent.clientY - rect.top) / rect.height) * 2 + 1
                raycaster.setFromCamera(mouse, camera)

                // ✅ 代理体检测
                const intersects = raycaster.intersectObjects(getAllProxies().filter(p => p.userData.isProxy), false)
                if (intersects.length > 0) {
                    const proxy = intersects[0].object
                    document.body.style.cursor = 'pointer'

                    // 找到真实点云 mesh（通过名字找）
                    const mesh = loadedMeshes.value.find(m => proxy.name.includes(m.name))
                    if (mesh && hoveredMesh.value !== mesh) {
                        if (hoveredMesh.value) {
                            restoreOriginalMaterial(hoveredMesh.value)
                        }
                        setBreathingMaterial(mesh)
                        hoveredMesh.value = mesh
                    }
                } else {
                    document.body.style.cursor = 'default'

                    // 鼠标移出时恢复材质
                    if (hoveredMesh.value) {
                        restoreOriginalMaterial(hoveredMesh.value)
                        hoveredMesh.value = null
                    }
                }
            }
            


            renderer.render(scene, camera)
            controls?.update()
        }
        
        animate()

        // const hoverTargets = ref([]) // 只检测目标对象

        renderer.domElement.addEventListener('click', (event) => {
            if (!interactionEnabled.value) return // 🔒 点击前检查是否启用
            const rect = renderer.domElement.getBoundingClientRect()
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
            raycaster.setFromCamera(mouse, camera)

            const intersects = raycaster.intersectObjects(getAllProxies().filter(p => p.userData.isProxy), false)
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

        center.y += -5.5 // 整体抬高模型焦点

        // ✅ 设置相机初始角度（斜前方视角）
        camera.position.copy(center.clone().add(new THREE.Vector3(10, 5, maxDim * offset)))
        camera.lookAt(center)

        // ✅ 更新控制器目标
        if (controls) {
            controls.target.copy(center)
            controls.update()
        }
    }

    function restoreOriginalMaterial(mesh) {
        const oldMat = mesh.material
        const newMat = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        })
        mesh.material = newMat
        oldMat.dispose()
    }

    function setBreathingMaterial(mesh) {
        const oldMat = mesh.material
        const newMat = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: false,
            color: new THREE.Color(0x00ffff),
            transparent: true,
            opacity: 0.6
        })
        newMat.userData = {
            time: Math.random() * Math.PI * 2,
            speed: 4,
            breathing: true
        }
        mesh.material = newMat
        oldMat.dispose()
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
    .interaction-toggle {
        /* position: absolute; */
        top: 16px;
        right: 24px;
        z-index: 1000;
        padding: 8px 16px;
        border-radius: 20px;
        border: 2px solid #1e90ff;
        background: white;
        color: #1e90ff;
        font-weight: bold;
        transition: 0.3s;
    }
    .interaction-toggle:hover {
        background: #e6f2ff;
    }

    .interaction-toggle.active {
        background: linear-gradient(to right, #00b4db, #0083b0);
        color: white;
        border-color: transparent;
        box-shadow: 0 0 8px rgba(0, 183, 255, 0.6);
    }

    .interaction-toggle .icon {
        font-size: 16px;
    }


</style>
  