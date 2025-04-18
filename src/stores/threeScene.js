// stores/threeScene.js
// 这个工具js暂时没有使用，暂且保留
import { defineStore } from 'pinia';

export const useThreeSceneStore = defineStore('threeScene', {
  state: () => ({
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    animationId: null,
    isModelLoaded: false,
    shouldCleanup: true,
    // ✅ 加入这些
    loadedMeshes: [],
    hoveredMesh: null
  }),

  actions: {
    setThreeRefs({ renderer, scene, camera, controls, animationId, loadedMeshes, hoveredMesh }) {
      this.renderer = renderer;
      this.scene = scene;
      this.camera = camera;
      this.controls = controls;
      this.animationId = animationId;
      this.loadedMeshes = loadedMeshes
      this.hoveredMesh = hoveredMesh
    },

    markLoaded() {
      this.isModelLoaded = true;
    },

    clear() {
      this.renderer = null;
      this.scene = null;
      this.camera = null;
      this.controls = null;
      this.animationId = null;
      this.loadedMeshes = []
      this.hoveredMesh = null
      this.isModelLoaded = false;
    },

    enableCleanup() {
      this.shouldCleanup = true;
    },

    disableCleanup() {
      this.shouldCleanup = false;
    }
  }
});
