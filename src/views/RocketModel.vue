<template>
    <div class="page-container">
        <h1>🚀 火箭模型展示页面</h1>
        <div ref="canvasContainer" class="canvas-container"></div>
    </div>
</template>

<script setup>
    import * as THREE from 'three'
    import { onMounted, ref, onBeforeUnmount } from 'vue';
    import { createRocketSecne } from '../three/scenes/rocketScene';

    const canvasContainer = ref(null)
    
    let scene, camera, renderer, animationId

    onMounted(() =>{
        //创建场景
        scene = createRocketSecne()

        //创建相机
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        camera.position.z = 5

        // 创建渲染器
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        canvasContainer.value.appendChild(renderer.domElement)

        // 4. 动画渲染循环
        const animate = () => {
            animationId = requestAnimationFrame(animate)
            renderer.render(scene, camera)
        }
        
        animate()

        // 5. 监听窗口变化，自适应画布
        window.addEventListener('resize', onWindowResize)
    })

    onBeforeUnmount(() => {
        // 停止动画帧
        cancelAnimationFrame(animationId)
        // 清理监听器
        window.removeEventListener('resize', onWindowResize)
        // 释放渲染资源
        renderer.dispose?.()
    })

    function onWindowResize() {
        if (!camera || !renderer) return
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
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

</style>
  