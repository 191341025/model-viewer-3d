<template>
    <div class="page-container">
        <div class="button-container">
            <h4 class="model-title">{{ modelTitle }}</h4>
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
                v-model="mainPlyVisible"
                :active-value="true"
                :inactive-value="false"
                active-color="#00b4db"
                inactive-color="#e6f2ff"
                @change="toggleMainPlyVisibility"
                />
            </div>
            <button @click="switchModel(model1)">加载模型 A</button>
            <button @click="switchModel(model2)">加载模型 B</button>
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
    import { useRoute } from 'vue-router'
    import { onMounted, ref, onBeforeUnmount, watch  } from 'vue';
    import { createDefaultScene } from '@/three/scenes/createDefaultScene'
    import { cleanupThree } from '@/three/utils/cleanupThree'

    import { createSceneBundle } from '@/three/utils/createSceneBundle'
    import { loadModelAndInitEvents } from '@/three/utils/loadModelAndInitEvents'
    import { startAnimateLoop } from '@/three/utils/animate'


    import ProgressBar from '@/components/ProgressBar.vue'
    import { createProxyFromMesh, getAllProxies } from '@/three/utils/interactionProxies'
    import { createSmartProxyFromMesh, getAllSmartProxies } from '@/three/utils/interactionProxiesSmart'
    import InfoPopup from '@/components/InfoPopup.vue'

    import { storeToRefs } from 'pinia'
    import { useUiStore } from '@/stores/uiStore'
    import { useThreeSceneStore } from '@/stores/threeScene'

    const sceneStore = useThreeSceneStore()
    
    const uiStoress = useUiStore()
    const { mainPlyVisible } = storeToRefs(uiStoress)
    const { interactionEnabled } = storeToRefs(uiStoress)
    const route = useRoute()

    let hoverEvent = null
    let needHoverCheck = false
    let mainPlyMesh = ref([]); // 放到函数外面，全局用
    const uiStore = useUiStore()
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    // const mainPlyHidden = ref(false)
    // const interactionEnabled = ref(false)
    const hoveredMesh = ref(null)
    const canvasContainer = ref(null)
    const loadProgress = ref(0)
    const loadedMeshes = ref([]) // 保存所有加载成功的点云模型

    const popupVisible = ref(false)
    const popupInfo = ref({ title: '', fields: {} })
    const popupStyle = ref({})

    const model1 = [
        import.meta.env.BASE_URL + '/buildings/F1-room1.ply',
    ]
    const model2 = [
    import.meta.env.BASE_URL + '/buildings/F1-Hallway1.ply',
        ]

    let urls = []
    // title 是普通字符串，无需 JSON.parse
    const modelTitle = route.query.title || '未命名模型'

    let scene, camera, renderer, controls, animationId, group
    

    function toggleInteraction(val) {
    }

    // 4. 动画渲染循环
    const animateFn = () => {
            if (!renderer || !scene || !camera) return // ✅ 防御式写法
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
                    mat.color.setRGB(0.3, 0.5 + 0.5 * pulse, 0.5 + 0.5 * pulse) // 亮青色
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
        }

    const switchModel = (modelUrls) => {
        
        cleanupThree({
            renderer,
            scene,
            controls,
            animationId,
            resizeHandler: onWindowResize
        })
        
        const newScene = createSceneBundle(canvasContainer.value)
        scene = newScene.scene
        camera = newScene.camera
        renderer = newScene.renderer
        controls = newScene.controls

        group = new THREE.Group();
        loadModelAndInitEvents({
            urls: modelUrls,
            scene,
            group,
            canvas: renderer.domElement,
            onProgress: (p) => loadProgress.value = p,
            onLoad: (meshes) => handleModelLoad(meshes),
            onError: (err, url) => console.error('加载失败：', url, err),
            clickHandler: handleCanvasClick
        })
        canvasContainer.value.appendChild(renderer.domElement)
        startAnimateLoop({
            scene,
            camera,
            renderer,
            controls,
            animateFn: animateFn // ⬅️ 只包含 breathing 动效等更新逻辑
        })
        window.addEventListener('resize', onWindowResize)
    }

    
    onMounted(() =>{
        const raw = route.query.urls || '[]'
        try {
            urls = JSON.parse(raw)
        } catch (err) {
            console.error('URL解析失败:', err)
        }
        const newScene = createSceneBundle(canvasContainer.value)
        scene = newScene.scene
        camera = newScene.camera
        renderer = newScene.renderer
        controls = newScene.controls

        group = new THREE.Group()
        group.rotation.x = -Math.PI / 2;
        loadModelAndInitEvents({
            urls: JSON.parse(route.query.urls || '[]'),
            scene,
            group,
            canvas: renderer.domElement,
            onProgress: (p) => loadProgress.value = p,
            onLoad: (meshes) => handleModelLoad(meshes),
            onError: (err, url) => console.error('加载失败：', url, err),
            clickHandler: handleCanvasClick
        })
        canvasContainer.value.appendChild(renderer.domElement)

        animationId = startAnimateLoop({
            scene,
            camera,
            renderer,
            controls,
            animateFn: animateFn
        })
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

    function handleCanvasClick(event) {
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
    }

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

        center.y += -3.5 // 整体抬高模型焦点

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
            opacity: 0.8,
            depthWrite: false,   // ✅ 关闭深度写入，避免透明遮挡问题
            depthTest: true,     // ✅ 保持深度测试，正确遮挡排序
            blending: THREE.NormalBlending // ✅ 使用默认混合模式，效果更稳定
            
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

        // 动画循环里只处理需要动画的 mesh
        mainPlyMesh.value.forEach((mesh) => {
            mesh.material.transparent = true;

            if (mainPlyVisible.value) {
                mesh.material.opacity = 0.01;
                mesh.material.color.set('#888888'); // 👈 淡灰色
            } else {
                mesh.material.opacity = 0.8;

                // ✅ 用缓存的原始颜色恢复
                const originalColor = mesh.userData.originalColor;
                if (originalColor) {
                    mesh.material.color.copy(originalColor);
                }
            }

            mesh.material.needsUpdate = true;
            
        })
    }

    function handleModelLoad(meshes){
        meshes.forEach((mesh, index) => {
            // 在 meshes.forEach 里面加这个：
            if (mesh.name.includes('main')) {
                mainPlyMesh.value.push(mesh)
            }
            // console.log('加载成功:', mesh)
            group.add(mesh)
            loadedMeshes.value.push(mesh)
            if (!mesh.name.includes('main')) {
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
        // 手动首帧渲染一次，避免首帧延迟
        renderer.render(scene, camera);

        // 鼠标监听
        renderer.domElement.addEventListener('mousemove', (event) => {
            hoverEvent = event
            needHoverCheck = true
        })

        toggleMainPlyVisibility(mainPlyVisible.value)

        fitCameraToObject(camera, controls, group, 1.3)
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
  