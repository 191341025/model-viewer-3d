<template>
    <div class="layout-container">
      <HeaderNav />
      <div class="main-body">
        <!-- <SidebarMenu /> -->
        <div class="main-content">
          <div class="page-wrapper">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import HeaderNav from '@/components/HeaderNav.vue'
  import SidebarMenu from '@/components/SidebarMenu.vue'
  </script>
  
  <style scoped>
  .layout-container {
    height: 100vh; /* 整个页面填满窗口 */
    display: flex;
    flex-direction: column;
  }
  
  .main-body {
    flex: 1;
    display: flex;
    overflow: hidden; /* 避免 router-view 撑爆 */
  }
  
  .main-content {
    flex: 1;
    overflow: auto; /* 只在这滚动 */
    background: #f0f2f5;
    padding: 16px;
    min-height: 0; /* 避免子项撑开 */
  }
  
  .page-wrapper {
    min-height: 100%;
    box-sizing: border-box;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  </style>
  