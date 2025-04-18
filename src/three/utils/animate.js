let animationId = null;

export function startAnimateLoop({ scene, camera, renderer, controls, animateFn }) {
    cancelAnimationFrame(animationId); // 防止重复运行
    function animate() {
      animationId = requestAnimationFrame(animate)
      controls?.update()
      animateFn?.()
      renderer.render(scene, camera)
    }
    animate()
  }
  