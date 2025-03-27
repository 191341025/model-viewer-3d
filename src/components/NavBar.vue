<template>
    <header class="navbar">
      <div class="logo">🧭 3D展示平台</div>
      <nav class="nav-links">
        <router-link to="/" class="link">
            <i class="iconfont icon-icon-home"></i> 首页
        </router-link>
        <router-link to="/about" class="link">
            <i class="iconfont icon-icon-about"></i>关于
        </router-link>
        <router-link to="/models" class="link">
            <i class="iconfont icon-icon-production-sd"></i>
            模型列表
        </router-link>
      </nav>
    </header>
  </template>
  
  <script setup>
  // 暂无逻辑
  </script>
  
<style scoped>
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #2f2f2f;
        color: white;
        padding: 12px 24px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  
    .logo {
        font-weight: bold;
        font-size: 18px;
        letter-spacing: 1px;
    }

    .nav-links {
        display: flex;
        gap: 16px;
    }

    .link {
        color: #ddd;
        text-decoration: none;
        transition: color 0.2s;
    }

    .link:hover {
        color: #fff;
        text-decoration: underline;
    }

    .link .iconfont {
        font-size: 20px;
        vertical-align: text-bottom;
        line-height: 1;
        display: inline-block;
        margin-right: 4px;
    }

    .link:hover .iconfont {
        color: #90ee90; /* hover 时图标变绿，可选 */
    }

  </style>
  