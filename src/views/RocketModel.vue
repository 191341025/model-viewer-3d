<template>
    <div class="page-container">
        <div class="button-container">
            <h4 class="model-title">KFC模型</h4>
            <div class="switch-wrapper">
                <span class="switch-label">交互功能</span>
                <el-switch
                v-model="interactionEnabled"
                :active-value="true"
                :inactive-value="false"
                active-color="#00b4db"
                inactive-color="#e6f2ff"
                @change="toggleInteraction"
                />
            </div>

            <div class="switch-wrapper">
                <span class="switch-label">主体隐藏</span>
                <el-switch
                v-model="mainPlyHidden"
                :active-value="true"
                :inactive-value="false"
                active-color="#00b4db"
                inactive-color="#e6f2ff"
                @change="toggleMainPlyVisibility"
                />
            </div>
            
           <!--  <button class="interaction-toggle">其他按钮2</button> -->
        </div>
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
    // import { createSceneryBackground } from '@/three/effects/createSceneryBackground'
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
    let mainPlyMesh = null; // 放到函数外面，全局用
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const mainPlyHidden = ref(false)
    const interactionEnabled = ref(false)
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
    

    

    function toggleInteraction(val) {
        console.log('val:', val)
    }

    let scene, camera, renderer, animationId, controls

    onMounted(() =>{

        //创建场景
        // scene = createDefaultScene()
        scene = createAdvancedScene({
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

        // createSceneryBackground(scene, {
        // count: 30,
        // area: 600,
        // minSize: 10,
        // maxSize: 30,
        // types: ['box', 'cone', 'sphere'],
        // colorPalette: ['#cccccc', '#999999', '#aaaaaa']
        // })


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
                    // 在 meshes.forEach 里面加这个：
                    if (mesh.name.includes('main')) {
                        mainPlyMesh = mesh;
                    }
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
                    geo.userData.shownCount += 2000 // 控制绘制速度
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
                    title: mesh.name,
                    id: mesh.uuid.slice(0, 8),
                    name: mesh.name,
                    modelUrl: mesh.userData.url, // 使用 userData.url 或模型名作为路径
                    jump: true,
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
            color: new THREE.Color(0xd0ecff),
            transparent: true,
            opacity: 0.7
        })
        newMat.userData = {
            time: Math.random() * Math.PI * 2,
            speed: 4,
            breathing: true
        }
        mesh.material = newMat
        oldMat.dispose()
    }

    function toggleMainPlyVisibility(val) {
        if (!mainPlyMesh) return;

        // mainPlyHidden.value = !mainPlyHidden.value;

        mainPlyMesh.material.transparent = true;

        if (mainPlyHidden.value) {
            mainPlyMesh.material.opacity = 0.04;
            mainPlyMesh.material.color.set('#888888'); // 👈 淡灰色
        } else {
            mainPlyMesh.material.opacity = 0.6;

            // ✅ 用缓存的原始颜色恢复
            const originalColor = mainPlyMesh.userData.originalColor;
            if (originalColor) {
            mainPlyMesh.material.color.copy(originalColor);
            }
        }

        mainPlyMesh.material.needsUpdate = true;
    }

    






</script>

<style scoped>
    .canvas-container {
        width: calc(100vw - 30px);
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
    .button-container {
        display: flex;
        justify-content: flex-start;
        gap: 20px; /* 按钮之间的间距 */
        margin-top: 5px;
    }

    .switch-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    }

    .switch-label {
    font-weight: bold;
    white-space: nowrap;        /* ❗不换行 */
    overflow: hidden;           /* ❗超出隐藏 */
    text-overflow: ellipsis;    /* ❗显示省略号（...） */
    max-width: 100%;            /* 可选：限制最大宽度 */
    display: inline-block;      /* 可选：确保 ellipsis 生效 */
    color: #fff;
    }

    .model-title {
        white-space: nowrap;        /* ❗不换行 */
        overflow: hidden;           /* ❗超出隐藏 */
        text-overflow: ellipsis;    /* ❗显示省略号（...） */
        max-width: 100%;            /* 可选：限制最大宽度 */
        display: inline-block;      /* 可选：确保 ellipsis 生效 */
    }

</style>
  