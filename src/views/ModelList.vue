<template>
    <div class="page-container model-list">
      <h1>可浏览的 3D 模型</h1>
      <div class="model-card" v-for="(model, index) in models" :key="index" @click="handleClick(model)">
        <img :src="model.image" alt="模型预览图" class="model-img" />
        <div class="model-info">
          <h2>{{ model.name }}</h2>
          <p>{{ model.description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const models = [
    {
      name: '火箭模型 Alpha',
      image: '/assets/model-alpha.jpg', // 先用占位图或未来替换路径
      description: '一款展示火箭结构的3D模型。'
    },
    {
      name: '建筑模型 Bravo',
      image: '/assets/model-bravo.jpg',
      description: '现代建筑风格的三层结构示意图。'
    },
    {
      name: '设备模型 Charlie',
      image: '/assets/model-charlie.jpg',
      description: '工业机械设备结构的简化模型。'
    }
  ]
  
  function handleClick(model) {
    console.log(`点击了模型：${model.name}`)
  }
  </script>
  
  <style scoped>
  .model-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 10px;
  }
  
  .model-card {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .model-card:hover {
    transform: translateY(-4px);
  }
  
  .model-img {
    width: 120px;
    height: 90px;
    object-fit: cover;
    border-radius: 8px;
    background: #ddd;
  }
  
  .model-info h2 {
    font-size: 20px;
    margin: 0 0 8px;
  }
  .model-info p {
    margin: 0;
    color: #666;
  }
  </style>
  