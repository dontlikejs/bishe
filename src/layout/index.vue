<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="auto">
        <LeftMenu/>
      </el-aside>
      <el-container>
        <el-header>
          <RightTop />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import LeftMenu from "./LeftMenu.vue"
import RightTop from "./RightTop.vue"


</script>

<style lang="scss">
.el-aside{
  background-color: #545c64;
}
.el-header{
}
.el-main{
  background-color: gainsboro;
}
.common-layout{
        height: calc(100vh);
    }
    .el-container {
            width: 100vw;
            height: 100vh;
    }
</style>