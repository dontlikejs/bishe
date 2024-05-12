import { fileURLToPath, URL } from 'node:url'
import cesium from 'vite-plugin-cesium';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueSetupExtend(),
    cesium(),
    Components({
      resolvers: [AntDesignVueResolver({
        importStyle: 'less', // 一定要开启这个配置项
      })]
    })
    
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
