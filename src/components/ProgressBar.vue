<template>
    <div v-if="visible" class="progress-container">
      <div class="progress-message">
        Loading 3D Model {{ Math.floor(currentProgress) }}%
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: currentProgress + '%' }"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  
  const props = defineProps({
    progress: Number
  })
  
  const currentProgress = ref(0)
  const visible = ref(true)
  
  watch(
    () => props.progress,
    (newVal) => {
      const percent = Math.min(newVal * 100, 100)
      currentProgress.value = newVal

      if (percent >= 95) {
        setTimeout(() => {
          visible.value = false
        }, 500)
      } else {
        visible.value = true
      }
    },
    { immediate: true } // ✅ 确保初次加载也触发
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
  