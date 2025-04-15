<template>
    <div class="home-container">
      <h1 class="page-title">主页</h1>
      <p class="page-desc">Welcome to the homepage!</p>
  
      <div class="model-wrapper">
        <div class="model-box">
          <img src="@/assets/images/model-placeholder.png" class="model-image" />
          <div class="info-card">
            <div class="info-title">简介</div>
            <div class="info-desc">
              本模型用于演示 Three.js 的加载与交互效果，适用于建筑结构展示、产品剖析等场景。<br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
.home-container {
  padding: 14px 14px 8px; /* 顶部 padding 从 32px 降低到 24px */
  background: linear-gradient(135deg, #e8edf1, #f9fbfd);
  min-height: 100vh;
  box-sizing: border-box;
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 0px;
  color: #2c3e50;
  margin-top: 1px;
}

.page-desc {
  font-size: 16px;
  color: #555;
  margin-bottom: 32px;
}

.model-wrapper {
  overflow: hidden; /* 避免模型图片 hover 时撑出滚动条 */
  border-radius: 16px;
  padding: 24px;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  position: relative;
  transition: box-shadow 0.3s ease;
}


.model-wrapper:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.model-box {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
}

.model-image {
  max-height: calc(100vh - 360px); /* 比原来小一点 */
  max-width: 100%;
  object-fit: contain;
  border-radius: 8px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
  transition: transform 0.3s ease;
}

.model-image:hover {
  transform: scale(1.075); /* 稍微变大，但不会撑爆滚动条 */
}


/* Info 卡片 */
.info-card {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #ffffffee;
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  width: 220px;
  transition: all 0.3s ease;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
  margin-bottom: 6px;
}

.info-desc {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

  </style>
  