// src/stores/uiStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // 用于控制开关状态（初始默认值可以是 false）
  const interactionEnabled = ref(false)
  const mainPlyVisible = ref(false)
  const modelHistory = ref([]) // 存储模型 URL 数组的历史记录

  // ✅ 添加一个重置函数
  function reset() {
    interactionEnabled.value = false
    mainPlyVisible.value = false
    modelHistory.value = ref([])
  }

  return {
    interactionEnabled,
    mainPlyVisible,
    modelHistory,
    reset // 别忘了导出
  }
})
