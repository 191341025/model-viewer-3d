<template>
    <div class="header-container">
      <div class="logo-area">
        <div class="logo-box">
            
        </div>
        <span class="title">My Project</span>
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
  import { useRouter, useRoute } from 'vue-router'
  
  const router = useRouter()
  const route = useRoute()
  
  const activeIndex = route.path
  
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
    color: white;
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
    font-size: 18px;
    font-weight: 600;
  }
  
  .nav-menu {
    border-bottom: none;
  }
  </style>
  