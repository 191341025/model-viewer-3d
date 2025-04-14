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
import router from '../router';

const models = [
  {
    name: 'KFC楼体模型 Alpha',
    image: new URL('@/assets/images/model-alpha.png', import.meta.url).href,
    description: '一款展示KFC楼体结构的3D模型。',
    route: '/models/rocket'
  },
  {
    name: '钢铁侠 IronMan',
    image: new URL('@/assets/images/model-alpha.png', import.meta.url).href,
    description: '钢铁侠贴图版 马克几号我也不晓得',
    route: '/models/ironman' 
  },
  {
    name: '小黄车 Yellow Car',
    image: new URL('@/assets/images/model-alpha.png', import.meta.url).href,
    description: '一辆原地起飞的小黄车',
    route: '/models/car' 
  },
  {
    name: '设备模型 Charlie',
    image: new URL('@/assets/images/model-alpha.png', import.meta.url).href,
    description: '工业机械设备结构的简化模型。',
    route: '/models/device' // 预留
  }
]

  function handleClick(model) {
    // console.log(`点击了模型：${model.name}`)  
    if(model.route){
      router.push(model.route)
    } else {
      console.log('点击了模型：${model.name}')
    }
  }
</script>
  
  <style scoped>
  .model-list {
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 14px;
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
  