<template>
    <div class="home-container">
      <h1 class="page-title">Home</h1>
      <p class="page-desc">Welcome to the homepage!</p>
  
      <div class="model-wrapper">
        <div class="model-box">
          <img src="@/assets/images/model-placeholder.png" class="model-image" />
          <div class="info-card">
            <div class="info-title">Info</div>
            <div class="info-desc">Additional information<br />about the model</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .home-container {
    padding: 0px;
    
  }
  
  .page-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 4px;
    color: #1f2d3d;
  }
  
  .page-desc {
    font-size: 16px;
    color: #666;
    margin-bottom: 24px;
  }
  
  .model-wrapper {
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    padding: 24px;
    background: #f9f9fb;
    position: relative;
  }
  
  .model-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .model-image {
    height: calc(100vh - 300px);
    object-fit: contain; /* 可选，用于更好适配容器 */
    border-radius: 4px;
    filter: brightness(0.95);
    }

  
  /* Info 卡片样式 */
  .info-card {
    position: absolute;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: left;
    width: 220px;
  }
  
  .info-title {
    font-size: 16px;
    font-weight: 700;
    color: #1f2d3d;
    margin-bottom: 4px;
  }
  
  .info-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }
  </style>
  