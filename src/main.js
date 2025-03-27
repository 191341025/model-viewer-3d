import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
// iconfont CSS，
import './assets/iconFonts/iconfont.css';
import './assets/iconFonts/iconfont.js';

const app = createApp(App)
app.use(router)
app.mount('#app')
