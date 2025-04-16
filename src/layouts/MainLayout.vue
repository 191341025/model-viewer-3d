<template>
    <div class="layout-container">
      <HeaderNav />
      <div class="main-body">
        <!-- <SidebarMenu /> -->
        <div class="main-content">
          <router-view />
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
    background: #f0f2f5;
    padding: 16px;
    min-height: 0; /* 避免子项撑开 */
  }
  </style>
  