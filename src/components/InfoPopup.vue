<template>
  <div v-if="visible" class="popup-container" :style="style">
    <div class="popup-card">
      <div class="popup-header">
        <span class="popup-title">{{ info.title }}</span>
        <button class="close-btn" @click="close">×</button>
      </div>
      <div class="popup-body">
        <p v-for="(val, key) in info.fields" :key="key">
          <strong>{{ key }}：</strong>{{ val }}
        </p>
      </div>
      <div class="popup-footer" v-if="info.jump">
        <button class="detail-btn" @click="goToDetail(info)">查看详情 →</button>
        <!-- <button class="load-btn" @click="loadHere(info)">当前加载</button> -->
      </div>
    </div>
  </div>
</template>

  
  <script setup>
    import { useRouter } from 'vue-router'
    const emit = defineEmits(['close', 'loadHere', 'loadHerePop'])
    defineProps({
      visible: Boolean,
      info: Object,
      style: Object
    })

    const loadHere = (info) => {emit('loadHere', info)}
    const close = () => emit('close')

    const router = useRouter()
    const goToDetail = (info) => {
      emit('loadHerePop', info)
      router.push({
        name: 'ModelDetail',
        query: {
          id: info.id,
          name: info.name || info.title,
          modelUrl: info.modelUrl
        }
      })
    }

  </script>
  
  <style scoped>
    .popup-container {
      position: absolute;
      z-index: 1000;
      pointer-events: auto;
    }

    .popup-card {
      background: linear-gradient(135deg, #f8fbff, #eef3fa);
      border-left: 4px solid #409eff;
      border-radius: 10px;
      padding: 14px 18px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      width: 260px;
      font-size: 14px;
      color: #333;
      transition: all 0.3s ease;
    }

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .popup-title {
      font-size: 15px;
      color: #2c3e50;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #aaa;
    }

    .close-btn:hover {
      color: #000;
    }

    .popup-body p {
      margin: 6px 0;
      line-height: 1.4;
    }

    .popup-footer {
      margin-top: 12px;
      text-align: right;
    }

    .detail-btn {
      background-color: #409eff;
      color: white;
      border: none;
      padding: 6px 10px;
      font-size: 13px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .detail-btn:hover {
      background-color: #66b1ff;
    }
    .load-btn {
      background-color: #28c76f;
      color: white;
      border: none;
      padding: 6px 10px;
      font-size: 13px;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 10px;
      transition: background-color 0.2s ease;
    }
    .load-btn:hover {
      background-color: #22a85d;
    }

  </style>
  