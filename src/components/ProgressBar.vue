<template>
    <div v-if="props.visible" class="progress-container">
      <div class="progress-message">
        正在搭建 3D 空间，稍等一下下～ {{ Math.floor(currentProgress) }}%
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: currentProgress + '%' }"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import {ref, watch} from 'vue'

  const props = defineProps({
    progress: Number,
    visible: Boolean
  })

  const emit = defineEmits(['update:visible']) // 支持 v-model:visible
  const currentProgress = ref(0)

  // 当进度变化时内部跟进，但不再自己决定 visible
  watch(
      () => props.progress,
      (newVal) => {
        currentProgress.value = Math.min(newVal * 100, 100)
      },
      { immediate: true }
  )

  </script>
  
  <style scoped>
  .progress-container {
    position: fixed;
    top: 320px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    z-index: 1000;
    animation: fadein 0.5s;
  }
  
  .progress-message {
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
  }
  
  .progress-bar {
    width: 100%;
    height: 12px;
    background-color: #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #88cc88, #66aa66);
    transition: width 0.3s ease;
    border-radius: 6px;
  }
  
  @keyframes fadein {
    from {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  </style>
  