<template>
    <div v-if="visible" class="popup-container" :style="style">
      <div class="popup-card">
        <div class="popup-header">
          <span>{{ info.title }}</span>
          <button @click="close">×</button>
        </div>
        <div class="popup-body">
          <p v-for="(val, key) in info.fields" :key="key">
            <strong>{{ key }}：</strong>{{ val }}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    visible: Boolean,
    info: Object,
    style: Object
  })
  
  const emit = defineEmits(['close'])
  const close = () => emit('close')
  </script>
  
  <style scoped>
  .popup-container {
    position: absolute;
    z-index: 1000;
    pointer-events: auto;
  }
  .popup-card {
    background: white;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    width: 240px;
    font-size: 14px;
  }
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    margin-bottom: 8px;
  }
  .popup-body p {
    margin: 4px 0;
  }
  .popup-header button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
  </style>
  