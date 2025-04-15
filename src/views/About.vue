<template>
    <div class="page-container">
      <h1>🧭 关于本系统</h1>
  
      <section class="section">
        <h2>🧱 项目概览</h2>
        <p>
          本系统基于 Three.js 开发，实现了网页端高效加载并交互展示 3D 点云和结构模型，适用于建筑展示、产品拆解、设备讲解等场景。
        </p>
      </section>
  
      <section class="section">
        <h2>🔧 已实现核心功能</h2>
        <ul>
          <li>✅ 支持加载多段 <code>.ply</code> 点云模型，并保持原始结构位置</li>
          <li>✅ 支持加载 <code>.obj + .mtl</code> 模型，并封装为通用加载函数</li>
          <li>✅ 模型加载后自动居中、缩放，自适应视口大小</li>
          <li>✅ 鼠标点击获取模型坐标，用于后续交互点标注</li>
          <li>✅ 可为模型设置多个交互点，点击后弹出详细信息窗口</li>
          <li>✅ 鼠标悬停高亮、支持呼吸灯效果（开启后才生效）</li>
          <li>✅ 支持添加圆环型交互点，带科技感悬浮标签</li>
          <li>✅ 加载时带有真实进度条，优化用户体验</li>
          <li>✅ 高级场景支持背景渐变、雾化、柔光灯等效果模块化切换</li>
        </ul>
      </section>
  
      <section class="section">
        <h2>🧭 页面结构</h2>
        <p>目前系统采用 Vue 3 + Vite 构建，页面结构分为：</p>
        <ul>
          <li>📂 首页（Home）- 模型展示主入口</li>
          <li>📂 模型页（Models）- 展示多个建筑/结构模型</li>
          <li>📂 关于页（About）- 展示当前系统功能与进度</li>
        </ul>
      </section>
  
      <router-link to="/" class="back-link">← 返回首页</router-link>
    </div>
  </template>
  
  <style scoped>
  .page-container {
    padding: 32px;
    background: linear-gradient(135deg, #2c3e50, #7f8c8d);
    color: #fff;
    min-height: 100vh;
    box-sizing: border-box;
  }
  
  h1 {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 24px;
    margin-top: 24px;
    margin-bottom: 10px;
    color: #ffd166;
  }
  
  .section {
    margin-bottom: 30px;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  li {
    margin: 6px 0;
    font-size: 16px;
  }
  
  code {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }
  
  .back-link {
    display: inline-block;
    margin-top: 20px;
    color: #90caf9;
    text-decoration: none;
    font-weight: bold;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
  </style>
  