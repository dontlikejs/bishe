<template>
<el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        :collapse="!navBool"
        @open="handleOpen"
        @close="handleClose"
        router
      >
      <template v-for="(v) in router.options.routes[0].children" :key="v.path">
        <el-menu-item :index="v.path">
          <el-icon><component :is="v.meta.icon"></component></el-icon>
          <span>{{ v.meta.title }}</span>
        </el-menu-item>
      </template>

      </el-menu>
</template>

<script lang="ts" setup>
import {onMounted} from "vue"
import {useRouter} from "vue-router"
import {ref} from "vue"
import useBoolInfoStore from "../store/useBool.ts"
const store = useBoolInfoStore();
import { storeToRefs } from 'pinia';
let {navBool} = storeToRefs(store);

let icon=ref("TrendCharts")
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
let router=useRouter()
onMounted(()=>{
    console.log("获取路由规则",router.options.routes[0].children)
})


</script>

<style>
</style>