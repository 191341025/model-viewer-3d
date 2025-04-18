<template>
  <div class="page-container">
    <div :class="styles.buttonContainer">
      <h4 class="model-title">{{ modelTitle }}</h4>
      <div :class="styles.switchWrapper">
        <span :class="styles.switchLabel">交互功能</span>
        <el-switch
            v-model="interactionEnabled"
            :active-value="true"
            :inactive-value="false"
            active-color="#00b4db"
            inactive-color="#e6f2ff"
        />
      </div>
      <div :class="styles.switchWrapper">
        <span :class="styles.switchLabel">主体隐藏</span>
        <el-switch
            v-model="mainPlyVisible"
            :active-value="true"
            :inactive-value="false"
            active-color="#00b4db"
            inactive-color="#e6f2ff"
            @change="toggleMainPlyVisibility"
        />
      </div>
      <button :class="styles.backBtn" @click="goBackOneLevel">⬅ 上一层模型</button>
      <!--  <button class="interaction-toggle">其他按钮2</button> -->
    </div>
    <!-- ✅ 加载提示 -->
    <ProgressBar :progress="loadProgress" v-model:visible="loadingVisible" />

    <div ref="canvasContainer" :class="styles.canvasContainer"></div>
    <!-- ✅ 交互信息弹窗组件 -->
    <InfoPopup
        :visible="popupVisible"
        :info="popupInfo"
        :style="popupStyle"
        @close="popupVisible = false"
        @loadHere="handleModelReload"
        @loadHerePop="handleModelReloadPop"
    />
  </div>
</template>
<script setup>
  import styles from '@/assets/css/BuildingModel.module.css'
  import * as THREE from 'three'
  import { useRoute } from 'vue-router'
  import { onMounted, ref, onBeforeUnmount, watch  } from 'vue';
  import { cleanupThree } from '@/three/utils/cleanupThree'
  import { createSceneBundle } from '@/three/utils/createSceneBundle'
  import { loadModelAndInitEvents } from '@/three/utils/loadModelAndInitEvents'
  import { startAnimateLoop } from '@/three/utils/animate'
  import ProgressBar from '@/components/ProgressBar.vue'
  import { createProxyFromMesh, getAllProxies } from '@/three/utils/interactionProxies'
  import InfoPopup from '@/components/InfoPopup.vue'
  import { storeToRefs } from 'pinia'
  import { useUiStore } from '@/stores/uiStore'
  import { useThreeSceneStore } from '@/stores/threeScene'
  import { clearAllProxies } from '@/three/utils/interactionProxies'


  // 中间模型名 => 子模型 URL 列表
  const modelUrlMap = {
    'F1-overall': [
      import.meta.env.BASE_URL + '/buildings/F1-main.ply',
      import.meta.env.BASE_URL + '/buildings/F1-a.ply',
      import.meta.env.BASE_URL + '/buildings/F1-b.ply',
      import.meta.env.BASE_URL + '/buildings/F1-c.ply',
      import.meta.env.BASE_URL + '/buildings/F1-d.ply',
      import.meta.env.BASE_URL + '/buildings/F1-e.ply',
      import.meta.env.BASE_URL + '/buildings/F1-f.ply',
      import.meta.env.BASE_URL + '/buildings/F1-g.ply',
      import.meta.env.BASE_URL + '/buildings/F1-h.ply',
      import.meta.env.BASE_URL + '/buildings/F1-i.ply',
      import.meta.env.BASE_URL + '/buildings/F1-j.ply',
      import.meta.env.BASE_URL + '/buildings/F1-k.ply',
      import.meta.env.BASE_URL + '/buildings/F1-l.ply',
      import.meta.env.BASE_URL + '/buildings/F1-m.ply',
      import.meta.env.BASE_URL + '/buildings/F1-n.ply',
      import.meta.env.BASE_URL + '/buildings/F1-o.ply',
      import.meta.env.BASE_URL + '/buildings/F1-room1.ply',
      import.meta.env.BASE_URL + '/buildings/F1-room2.ply',
      import.meta.env.BASE_URL + '/buildings/F1-Hallway1.ply',
      import.meta.env.BASE_URL + '/buildings/F1-Hallway2.ply',
      import.meta.env.BASE_URL + '/buildings/F1-wc.ply',
      import.meta.env.BASE_URL + '/buildings/Stair-cass.ply',
    ],
    'F2-overall': [
      import.meta.env.BASE_URL + '/buildings/F2-main.ply',
      import.meta.env.BASE_URL + '/buildings/F2-a.ply',
      import.meta.env.BASE_URL + '/buildings/F2-b.ply',
      import.meta.env.BASE_URL + '/buildings/F2-c.ply',
      import.meta.env.BASE_URL + '/buildings/F2-d.ply',
      import.meta.env.BASE_URL + '/buildings/F2-e.ply',
      import.meta.env.BASE_URL + '/buildings/F2-f.ply',
      import.meta.env.BASE_URL + '/buildings/F2-g.ply',
      import.meta.env.BASE_URL + '/buildings/F2-h.ply',
      import.meta.env.BASE_URL + '/buildings/F2-i.ply',
      import.meta.env.BASE_URL + '/buildings/F2-j.ply',
      import.meta.env.BASE_URL + '/buildings/F2-k.ply',
      import.meta.env.BASE_URL + '/buildings/F2-l.ply',
      import.meta.env.BASE_URL + '/buildings/F2-m.ply',
      import.meta.env.BASE_URL + '/buildings/F2-n.ply',
      import.meta.env.BASE_URL + '/buildings/F2-o.ply',
      import.meta.env.BASE_URL + '/buildings/F2-Hallway1.ply',
      import.meta.env.BASE_URL + '/buildings/F2-Hallway2.ply',
      import.meta.env.BASE_URL + '/buildings/F2-room1.ply',
      import.meta.env.BASE_URL + '/buildings/F2-room2.ply',
      import.meta.env.BASE_URL + '/buildings/F2-wc.ply',
    ]
  }


  const uiStores = useUiStore()
  const { mainPlyVisible } = storeToRefs(uiStores)
  const { interactionEnabled } = storeToRefs(uiStores)
  const { modelHistory } = storeToRefs(uiStores)
  const { levelNumber } = storeToRefs(uiStores)
  const route = useRoute()
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  const canvasContainer = ref(null)
  const loadingVisible = ref(true)
  const loadProgress = ref(0)
  const popupVisible = ref(false)
  const popupInfo = ref({ title: '', fields: {} })
  const popupStyle = ref({})
  const modelTitle = route.query.title || '未命名模型'

  let currentModelUrls = ref([])
  let hoveredMesh = ref(null)
  let loadedMeshes = ref([]) // 保存所有加载成功的点云模型
  let urls = []
  let hoverEvent = null
  let needHoverCheck = false
  let mainPlyMesh = ref([]); // 放到函数外面，全局用
  let scene, camera, renderer, controls, animationId, group


  /**
   * 主动画渲染循环入口
   * - 每帧调用以下逻辑：
   *   1. 点云渐显（drawRange）
   *   2. 悬停模型“呼吸灯”
   *   3. 鼠标悬停代理检测
   */
  function animateFn() {
    updateMeshDrawRange()
    updateHoveredMeshBreathing()
    handleHoverDetection()
  }

  /**
   * 控制所有带动画标记的模型显示点数，制造渐显效果
   */
  function updateMeshDrawRange() {
    loadedMeshes.value.forEach((mesh) => {
      const geo = mesh.geometry
      if (!geo.userData?.isAnimated) return

      const { totalCount, shownCount } = geo.userData
      if (shownCount < totalCount) {
        geo.userData.shownCount += 2000 // 控制点显示速度
        geo.setDrawRange(0, geo.userData.shownCount)
      }
    })
  }

  /**
   * 悬停模型呼吸灯动画（通过材质的 color 和 opacity 动态变化）
   */
  function updateHoveredMeshBreathing() {
    if (!interactionEnabled.value || !hoveredMesh.value) return

    const mat = hoveredMesh.value.material
    if (!mat || !mat.userData) return

    // 初始化 userData 中的动画参数
    mat.userData.time = typeof mat.userData.time === 'number' ? mat.userData.time : 0
    mat.userData.speed = typeof mat.userData.speed === 'number' ? mat.userData.speed : 4

    mat.userData.time += 0.02 * mat.userData.speed
    const pulse = (Math.sin(mat.userData.time) + 1) / 2

    // 设置亮青色动画效果
    mat.color.setRGB(0.3, 0.5 + 0.5 * pulse, 0.5 + 0.5 * pulse)
    mat.opacity = 0.2 + 0.7 * pulse
    mat.needsUpdate = true
  }

  /**
   * 检测鼠标当前悬停的 proxy，并对相应模型触发高亮或还原
   */
  function handleHoverDetection() {
    if (!needHoverCheck || !hoverEvent || !interactionEnabled.value) return
    needHoverCheck = false

    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((hoverEvent.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((hoverEvent.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(
        getAllProxies().filter(p => p.userData.isProxy),
        false
    )

    if (intersects.length > 0) {
      const proxy = intersects[0].object
      document.body.style.cursor = 'pointer'

      const mesh = loadedMeshes.value.find(m => proxy.name.includes(m.name))
      if (mesh && hoveredMesh.value !== mesh) {
        if (hoveredMesh.value) restoreOriginalMaterial(hoveredMesh.value)
        setBreathingMaterial(mesh)
        hoveredMesh.value = mesh
      }
    } else {
      document.body.style.cursor = 'default'
      if (hoveredMesh.value) {
        restoreOriginalMaterial(hoveredMesh.value)
        hoveredMesh.value = null
      }
    }
  }

  /******************************************************************************************^^^^^^^^^^^^^^^^^^^^^^^^^^^********************************/

  onMounted(() => {
    setupInitialModel()
  })
  /**
   * 切换当前展示的模型（用于点击或返回上一级）
   */
  function switchModel(modelUrls) {
    loadingVisible.value = true
    loadProgress.value = 0.01 // 比 0 更好看

    clearAllInteractionProxies()
    resetMeshState()
    disposeCurrentScene()

    createAndAssignScene()

    group = new THREE.Group()

    loadModelAndInitEvents({
      urls: modelUrls,
      scene,
      canvas: renderer.domElement,
      onProgress: (p) => loadProgress.value = p,
      onLoad: handleModelLoad,
      onError: (err, url) => console.error('加载失败：', url, err),
      clickHandler: levelNumber.value === 1 ? handleCanvasClick : handleCanvasClickUnPop
    })

    canvasContainer.value.appendChild(renderer.domElement)

    startAnimateLoop({
      scene,
      camera,
      renderer,
      controls,
      animateFn,
      loadedMeshes,
      loadingVisible     // 传进 ref 控制进度条组件
    })

    window.addEventListener('resize', onWindowResize)
  }

  /**
   * 页面初次挂载时初始化模型（来自路由或历史记录）
   */
  function setupInitialModel() {
    if (levelNumber.value === 2) levelNumber.value = 1

    const raw = route.query.urls || '[]'
    try {
      urls = JSON.parse(raw)
    } catch (err) {
      console.error('URL解析失败:', err)
    }

    if (modelHistory.value.length > 0) {
      // 从历史记录恢复模型
      const previousUrls = modelHistory.value.pop()
      currentModelUrls.value = previousUrls
      switchModel(previousUrls)
    } else {
      // 全新加载模型
      initSceneByUrls(JSON.parse(route.query.urls || '[]'))
    }
  }


  /**
   * 根据 URL 加载并初始化新场景（首次加载使用）
   */
  function initSceneByUrls(modelUrls) {
    createAndAssignScene()

    group = new THREE.Group()
    group.rotation.x = -Math.PI / 2

    loadModelAndInitEvents({
      urls: modelUrls,
      scene,
      group,
      canvas: renderer.domElement,
      onProgress: (p) => loadProgress.value = p,
      onLoad: handleModelLoad,
      onError: (err, url) => console.error('加载失败：', url, err),
      clickHandler: levelNumber.value === 1 ? handleCanvasClick : handleCanvasClickUnPop
    })

    canvasContainer.value.appendChild(renderer.domElement)

    startAnimateLoop({
      scene,
      camera,
      renderer,
      controls,
      animateFn,
      loadedMeshes,
      loadingVisible     // 传进 ref 控制进度条组件
    })

    window.addEventListener('resize', onWindowResize)
  }

  /**
   * 创建新的 three.js 场景，并更新全局引用变量
   */
  function createAndAssignScene() {
    const newSceneBundle = createSceneBundle(canvasContainer.value)
    scene = newSceneBundle.scene
    camera = newSceneBundle.camera
    renderer = newSceneBundle.renderer
    controls = newSceneBundle.controls
  }

  /**
   * 清理当前 three.js 资源
   */
  function disposeCurrentScene() {
    cleanupThree({
      renderer,
      scene,
      controls,
      animationId,
      resizeHandler: onWindowResize
    })
  }

  /**
   * 清空旧的 mesh、hover 状态等
   */
  function resetMeshState() {
    loadedMeshes.value = []
    hoveredMesh.value = null
  }

  /**
   * 移除旧的交互代理体并清空引用
   */
  function clearAllInteractionProxies() {
    const proxies = getAllProxies()
    proxies.forEach(proxy => proxy.removeFromParent())
    clearAllProxies()
  }


  onBeforeUnmount(() => {
    const allProxies = getAllProxies()
    allProxies.forEach(proxy => {
      proxy.removeFromParent()
    })
    clearAllProxies() // ✅ 每次清理旧的 proxy

    loadedMeshes.value = []
    hoveredMesh.value = null

    cleanupThree({
      renderer,
      scene,
      controls,
      animationId,
      resizeHandler: onWindowResize
    })
  })

  function handleCanvasClickUnPop(event){
    if (!interactionEnabled.value) return // 🔒 点击前检查是否启用
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(getAllProxies().filter(p => p.userData.isProxy), false)
    let modelUrls = []
    if (intersects.length > 0) {
      const mesh = intersects[0].object
      const modelKey = mesh.name
      const hasChildren = modelUrlMap[modelKey] !== undefined
      if (hasChildren) {
        modelUrls = modelUrlMap[modelKey]
      } else {
        modelUrls = [mesh.userData.url]
      }
      // ✅ 将当前模型压入历史记录
      // if (currentModelUrls.value.length > 0) {
      //     // modelHistory.value.push(currentModelUrls.value)

      // }
      levelNumber.value +=1;
      // ✅ 更新当前模型
      currentModelUrls.value = modelUrls
      switchModel(modelUrls) // ✅ 你现有的切换模型逻辑
    }
  }

  function handleCanvasClick(event) {
    if (!interactionEnabled.value) return // 🔒 点击前检查是否启用
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(getAllProxies().filter(p => p.userData.isProxy), false)
    if (intersects.length > 0) {
      const mesh = intersects[0].object
      const modelKey = mesh.name
      const hasChildren = modelUrlMap[modelKey] !== undefined
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
        },
        modelUrls: hasChildren ? modelUrlMap[modelKey] : null
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

  function toggleMainPlyVisibility() {
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

    // 鼠标监听
    renderer.domElement.addEventListener('mousemove', (event) => {
      hoverEvent = event
      needHoverCheck = true
    })

    toggleMainPlyVisibility(mainPlyVisible.value)
    // console.log(levelNumber.value)
    if(levelNumber.value == 0){
      fitCameraToObject(camera, controls, group, 1)
    } else {
      fitCameraToObject(camera, controls, group, 0.8)
    }

  }

  const handleModelReload = (info) => {
    popupVisible.value = false
    const urlsToLoad = info.modelUrls || [info.modelUrl]

    // ✅ 将当前模型压入历史记录
    if (currentModelUrls.value.length > 0) {
      modelHistory.value.push(currentModelUrls.value)
    }

    // ✅ 更新当前模型
    currentModelUrls.value = urlsToLoad


    switchModel(urlsToLoad) // ✅ 你现有的切换模型逻辑
  }

  const handleModelReloadPop = (info) => {
    const urlsToLoad = info.modelUrls || [info.modelUrl]
    // ✅ 将当前模型压入历史记录
    if (currentModelUrls.value.length > 0) {
      modelHistory.value.push(currentModelUrls.value)
    }
    // ✅ 更新当前模型
    currentModelUrls.value = urlsToLoad
  }

  const goBackOneLevel = () => {
    if(levelNumber.value == 0) {
      alert('已经是最上层模型了！')
      return
    }
    if (modelHistory.value.length > 0) {
      const previousUrls = modelHistory.value.pop()
      // ✅ 更新当前模型引用
      currentModelUrls.value = previousUrls
      // ✅ 调用加载逻辑
      switchModel(previousUrls)
    } else {
      const raw = route.query.urls || '[]'
      try {
        urls = JSON.parse(raw)
      } catch (err) {
        console.error('URL解析失败:', err)
      }
      levelNumber.value = 0
      modelHistory.value = []
      switchModel(urls)
    }
  }
</script>