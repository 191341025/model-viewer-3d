<template>
    <div :class="['sidebar', { collapsed }]">
      <!-- 展开状态 -->
      <template v-if="!collapsed">
        <el-button type="primary" class="top-button" round @click="toggle">
          Button
        </el-button>
  
        <el-divider />
  
        <div class="section">
          <div class="section-title">Navigation</div>
          <div class="section-item">
            Option 1
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
          <div class="section-item">
            Option 2
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
  
        <el-divider />
  
        <div class="section">
          <div class="section-title">Models</div>
          <div class="section-item">Model A</div>
          <div class="section-item">Model B</div>
          <div class="section-item">Model C</div>
        </div>
  
        <!-- 收起按钮 -->
        <div class="collapse-btn" @click="toggle">
          << 收起
        </div>
      </template>
  
      <!-- 收起状态 -->
      <template v-else>
        <div class="collapsed-trigger" @click="toggle">
          展开 >>
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue'
  import { ArrowRight } from '@element-plus/icons-vue'
  
  const collapsed = ref(false)
  
  const toggle = () => {
    collapsed.value = !collapsed.value
    // ⏳ 等 dom 完成后再触发 resize 事件
    nextTick(() => {
      window.dispatchEvent(new Event('resize'))
    })
  }
  </script>
  
  <style scoped>
  .sidebar {
    height: 100%;
    background-color: #f5f6f7;
    padding: 16px;
    box-sizing: border-box;
    width: 220px;
    border-right: 1px solid #ddd;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }
  
  .sidebar.collapsed {
    width: 40px;
    padding: 0;
    overflow: hidden;
  }
  
  .top-button {
    width: 100%;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  .section {
    margin-top: 12px;
  }
  
  .section-title {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 8px;
    color: #222;
  }
  
  .section-item {
    font-size: 14px;
    padding: 6px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .section-item:hover {
    color: #409EFF;
  }
  
  .arrow-icon {
    font-size: 14px;
  }
  
  .collapse-btn {
    margin-top: auto;
    padding: 8px;
    text-align: center;
    font-size: 12px;
    color: #666;
    cursor: pointer;
    border-top: 1px solid #ddd;
  }
  
  .collapsed-trigger {
    width: 40px;
    height: 100%;
    writing-mode: vertical-rl;
    text-align: center;
    background: #f5f6f7;
    border-right: 1px solid #ddd;
    color: #666;
    font-size: 12px;
    padding: 12px 4px;
    cursor: pointer;
  }
  </style>
  