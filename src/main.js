import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/css/global.css'
// iconfont CSS，
import './assets/iconFonts/iconfont.css';
import './assets/iconFonts/iconfont.js';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(createPinia()) // ✅ 注册 pinia
app.mount('#app')
