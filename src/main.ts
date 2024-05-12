import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'


import pinia from './store/index.ts'  //ÒýÈë
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
createApp(App).use(router).use(pinia).use(ElementPlus).mount('#app')
