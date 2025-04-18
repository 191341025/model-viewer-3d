<template>
    <div v-if="props.visible" class="progress-container">
      <div class="progress-message">
        正在搭建 3D 空间，稍等一下下～ {{ Math.floor(displayProgress) }}%
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
  const displayProgress = ref(0)

  watch(
      () => props.progress,
      (newVal) => {
        // 模拟加载从头开始
        if (newVal === 1 && currentProgress.value === 0) {
          currentProgress.value = 0.01 // 避免突然跳满条
          setTimeout(() => {
            currentProgress.value = 100
            displayProgress.value = 100 // 同步更新显示数字
          }, 300) // 延迟与 CSS 动画一致
        } else {
          const percent = Math.min(newVal, 100)
          currentProgress.value = percent

          // 数字稍微延迟一点点更新，和条动画同步
          setTimeout(() => {
            displayProgress.value = percent
          }, 50)
        }
      },
      { immediate: true }
  )

</script>
  
<style scoped>
  .progress-container {
      position: fixed;
      top: 30vh;
      left: 50%;
      transform: translateX(-50%);
      width: 320px;
      background: rgba(255, 255, 255, 0.92);
      border-radius: 16px;
      padding: 20px 24px;
      text-align: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      font-size: 16px;
      color: #333;
      z-index: 1000;
      animation: fadein 0.6s ease-out;
      backdrop-filter: blur(6px);
    }

    .progress-message {
      margin-bottom: 12px;
      font-size: 15px;
      font-weight: 500;
      color: #444;
    }

    .progress-bar {
      width: 100%;
      height: 12px;
      background-color: #e0e0e0;
      border-radius: 6px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #70e1f5, #6bc1d6, #76d275);
      transition: width 0.4s ease;
      border-radius: 6px;
      position: relative;
      animation: shimmer 1.8s infinite linear;
    }

    @keyframes fadein {
      from {
        opacity: 0;
        transform: translate(-50%, -20px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }

    /* ✨ 进度条内闪光动画 */
    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: 200px 0;
      }
    }

    .progress-fill {
      background-size: 400px 100%;
      background-repeat: no-repeat;
    }
  </style>
  