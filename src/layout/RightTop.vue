<template>
  <div>
    <el-icon @click="toggleNavBool"><CaretRight v-if="navBool"/><CaretLeft v-else/></el-icon>
  </div>
</template>

<script setup>
import {ref} from "vue"
import { storeToRefs } from 'pinia';
import {CaretRight,CaretLeft} from '@element-plus/icons-vue'
import useBoolInfoStore from "../store/useBool.ts"
const store = useBoolInfoStore();
let {navBool} = storeToRefs(store);

// let store=useStore()
// let bool=ref(true)

const toggleNavBool = () => {
  store.toggleNavBool(); // 调用 store 中的方法来更新 navBool
};
</script>

<style lang="scss">
    .el-header{
        line-height: 70px;
        .el-icon{
            font-size:20px;
        }
    }
</style>