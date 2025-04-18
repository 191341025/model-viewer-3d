let animationId = null;

export function startAnimateLoop({
                                     scene,
                                     camera,
                                     renderer,
                                     controls,
                                     animateFn,
                                     loadedMeshes,       // ✅ 新增参数
                                     loadingVisible      // ✅ 新增参数
                                 }) {
    cancelAnimationFrame(animationId) // 防止重复运行

    let hasRenderedOnce = false // ✅ 改成局部变量，每次动画重启都会重置

    function animate() {
        animationId = requestAnimationFrame(animate)

        controls?.update()
        animateFn?.()
        renderer.render(scene, camera)

        // ✅ 第一次真正渲染模型后，关闭 loading
        if (!hasRenderedOnce && loadedMeshes?.value?.length > 0) {
            hasRenderedOnce = true
            setTimeout(() => {
                loadingVisible.value = false
            }, 300) // 加点延迟让视觉过渡更自然
        }
    }

    animate()
}