<template>
    <div class="header-container">
      <div class="logo-area">
        <div class="logo-box">
          <img :src="logo" alt="Logo" style="width: 20px;"/>
        </div>
        <span class="title">3D 点云交互</span>
      </div>
      <el-menu
        mode="horizontal"
        :default-active="activeIndex"
        class="nav-menu"
        background-color="transparent"
        text-color="#ffffff"
        active-text-color="#409EFF"
        @select="handleSelect"
      >
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item index="/models">Models</el-menu-item>
        <el-menu-item index="/about">About</el-menu-item>
      </el-menu>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import logo from '@/assets/images/logo.png'
  import { useRouter, useRoute } from 'vue-router'
  
  const router = useRouter()
  const route = useRoute()
  
  const activeIndex = ref(route.path) // 初始绑定
  
  watch(
    () => route.path,
    (newPath) => {
      activeIndex.value = newPath
    }
  )

  const handleSelect = (index) => {
    if (index !== route.path) {
      router.push(index)
    }
  }
  </script>
  
  <style scoped>
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 24px;
    background-color: #1f2d3d;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    color: rgb(224, 218, 218);
  }
  
  .logo-area {
    display: flex;
    align-items: center;
  }
  
  .logo-box {
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 4px;
    margin-right: 10px;
  }
  
  .title {
    white-space: nowrap;        /* ❗不换行 */
    overflow: hidden;           /* ❗超出隐藏 */
    text-overflow: ellipsis;    /* ❗显示省略号（...） */
    max-width: 100%;            /* 可选：限制最大宽度 */
    display: inline-block;      /* 可选：确保 ellipsis 生效 */
  }

  
  .nav-menu {
    border-bottom: none;
  }

  </style>
  