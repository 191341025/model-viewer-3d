<template>
  <div class="model-list-page">
    <h1 class="page-title">可浏览的 3D 模型</h1>

    <div class="model-list">
      <el-card
        class="model-card"
        v-for="(model, index) in models"
        :key="index"
        shadow="hover"
        @click="handleClick(model)"
      >
        <div class="model-content">
          <!-- 若 image 存在则展示图片，否则显示 icon -->
        <div class="model-thumb">
          <img
            v-if="model.image"
            :src="model.image"
            alt="预览图"
            class="model-image"
        />
          <img
            v-else
            :src="model.placeholderImage"
            alt="预览图"
            class="model-image"
          ></img>
        </div>
          <div class="model-info">
            <div class="model-name">{{ model.name }}</div>
            <div class="model-desc">{{ model.description }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

  
<script setup>
  import router from '../router'

  import { useUiStore } from '@/stores/uiStore'

  const uiStore = useUiStore()

  // ✅ 回到模型列表时重置状态
  uiStore.reset()

  const models = [
    {
      name: 'KFC楼体',
      image: '',
      placeholderImage: new URL('@/assets/images/3d.png', import.meta.url).href,
      description: '一款展示KFC楼体结构的3D模型。',
      route: '/models/rocket',
      urls:  [
            import.meta.env.BASE_URL + '/rocket/floor2.ply',
            import.meta.env.BASE_URL + '/rocket/floor3.ply',
            import.meta.env.BASE_URL + '/rocket/main.ply'
            
        ]
    },
    {
      name: '钢铁侠 IronMan',
      image: '',
      placeholderImage: new URL('@/assets/images/3d.png', import.meta.url).href,
      description: '钢铁侠贴图版 马克几号我也不晓得',
      route: '/models/ironman' 
    },
    {
      name: '小黄车 Yellow Car',
      image: '',
      placeholderImage: new URL('@/assets/images/3d.png', import.meta.url).href,
      description: '一辆原地起飞的小黄车',
      route: '/models/car' 
    },
    {
      name: '建筑模型',
      image: '',
      placeholderImage: new URL('@/assets/images/3d.png', import.meta.url).href,
      description: 'Building模型。',
      route: '/models/rocket',
      urls: [
                import.meta.env.BASE_URL + '/buildings/F1-main.ply',
                import.meta.env.BASE_URL + '/buildings/F2-main.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-a.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-b.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-c.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-d.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-e.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-f.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-g.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-h.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-i.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-j.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-k.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-l.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-m.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-n.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-o.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-room1.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-room2.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-Hallway1.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-Hallway2.ply',
                // import.meta.env.BASE_URL + '/buildings/F1-wc.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-a.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-b.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-c.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-d.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-e.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-f.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-g.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-h.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-i.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-j.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-k.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-l.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-m.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-n.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-o.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-Hallway1.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-Hallway2.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-room1.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-room2.ply',
                // import.meta.env.BASE_URL + '/buildings/F2-wc.ply',
                // import.meta.env.BASE_URL + '/buildings/Stair-cass.ply',
                import.meta.env.BASE_URL + '/buildings/22-main-structure.ply'
            ]
    }
  ]

  function handleClick(model) {
    if (model.route) {
      router.push({
        path: model.route,          // 比如 '/models/rocket'
        query: {
          urls: JSON.stringify(model.urls),  // 需要序列化
          title: model.name // 👈 加上标题名（比如 'KFC模型'）
        }
      })
    }
  }

</script>
  
<style scoped>
  .model-list-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
    background: linear-gradient(135deg, #143f3a, #4b676a);
    border-radius: 20px;
    min-height: 100vh;
  }

  .page-title {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 24px;
    color: #ffffff;
  }

  .model-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .model-card {
    border-radius: 12px;
    transition: transform 0.2s ease;
    cursor: pointer;
  }

  .model-card:hover {
    transform: translateY(-4px);
  }

  .model-content {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .model-image {
    width: 120px;
    height: 90px;
    object-fit: contain; /* ⚠️ 从 cover 改为 contain */
    border-radius: 8px;
    background-color: #f0f0f0;
    padding: 6px; /* 给图片留出边距 */
  }

  .model-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .model-name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .model-desc {
    color: #666;
    font-size: 14px;
  }
  .model-thumb {
  width: 120px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  border-radius: 8px;
}


</style>
  