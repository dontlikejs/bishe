<script setup>
import {onMounted, ref} from 'vue'
import measure from "../../class/ThreeD/measure.js";
import HandleMeasureLine from "../../class/ThreeD/angle.js";

let measureTool,measureAngle;
onMounted(() => {
    measureTool = new measure({
      viewer: window.viewer,
      // profileChart,
      // proJudge:proJudge
    });
})
    function  juli1() {
      // proJudge=false
      measureTool.changeP1()
      measureTool.distance(0);
    }
    function juli2() {
      measureTool.distance(1);
    }
    function mianji1() {
      measureTool.area(0);
    }
    function mianji2() {
      measureTool._reset4()
      measureTool.area(1);
    }
    function measureHeight() {
      measureTool.measureHeight();
    }
    function angle(){
      // if(measureAngle){
      //   measureAngle._removeEntity()
      // }
      measureAngle = new HandleMeasureLine({viewer:viewer})
      measureAngle._measurePolyLine()
    }
    function clear(){
      measureTool.clearAll();
      measureAngle._removeEntity();
    }
</script>

<template>
    <el-card class="box-card" id="mea">
        <div>
          <div>
            <p style="text-align:center">测量工具</p>
              <el-button type="primary" size="mini" @click="juli1"
              >空间距离</el-button
            >
            <el-button type="primary" size="mini" @click="juli2"
              >表面距离</el-button
            >
            <el-button type="primary" size="mini" @click="measureHeight"
              >三角测量</el-button
            >
            <br />
              <br />
            <el-button type="primary" size="mini" @click="mianji1"
              >空间面积</el-button
            >
            <el-button type="primary" size="mini" @click="mianji2"
              >表面面积</el-button
            >
            <el-button type="primary" size="mini" @click="angle"
              >角度</el-button
            >
            <el-button
                type="primary"
                size="mini"
                @click="clear"
                >清除</el-button
              >
          </div>
        </div>
    </el-card>
</template>


<style scoped>
#mea{
  position: absolute;
  top: 73%;
  left: 60%;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 2%;
}
</style>