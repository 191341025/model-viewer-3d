export function startAnimateLoop({ scene, camera, renderer, controls, animateFn }) {
    let animationId = 0

    function loop() {
        if (!renderer || !scene || !camera) return
        animateFn()
        controls?.update()
        renderer.render(scene, camera)
        animationId = requestAnimationFrame(loop)
    }

    animationId = requestAnimationFrame(loop)
    return animationId
  }
  