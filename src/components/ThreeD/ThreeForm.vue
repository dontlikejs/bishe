<script lang="ts" setup>
import * as Cesium from 'cesium'
import {getShp,updateShp} from "../../api/shp"; //引入仓库
import { reactive } from 'vue'
import {onMounted, ref} from 'vue'
import useDataInfoStore from "../../store/data"; //引入仓库
import { id } from 'element-plus/es/locale/index.mjs';
const dataInfoStore = useDataInfoStore();
const form = reactive({
  bhlx: [], // 初始化为空数组
  djdbz: '',
  djdtbbh: '',
  djdtbmj: '',
  djtblx: '',
  kfqdm: '',
  kfqmc: '',
  yypssj: '',
})

const onSubmit = () => {
  const putForm = reactive({
    bhlx: form.bhlx[0], // 初始化为空数组
    djdbz: form.djdbz = "未知" ?null:  form.djdbz,
    djdtbbh: form.djdtbbh,
    djdtbmj: form.djdtbmj,
    djtblx: form.djtblx,
    kfqdm: form.kfqdm,
    kfqmc: form.kfqmc,
    yypssj: form.yypssj,
})
updateShp(putForm)
    .then(response => {
      // 处理成功响应
      console.log('数据更新成功:', response);
      // 可以在这里给出用户反馈，比如弹出一个成功消息
    })
    .catch(error => {
      // 处理错误
      console.error('数据更新失败:', error);
      // 可以在这里给出用户反馈，比如弹出一个错误消息
    });
}

onMounted(()=>{
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OTEwZTQ2MS1jZThmLTRmNGEtODc3NC0yZjdkYTk1NDA3NmQiLCJpZCI6MTIyODM1LCJpYXQiOjE2NzUxMzI2MjV9.yiCH3R1JnxHnWo3OE6wsWxZhLnkY8QNOXH5OLIjXfGc'
  let viewer = new Cesium.Viewer('cesiumContainer', {
        // 指定上下文
        contextOptions: {
          requestWebgl1: true,
        },
        animation: false,
        homeButton: false,
        geocoder: false,
        timeline: false,
        fullscreenButton: false,
        scene3DOnly: false,
        infoBox: false,
        sceneModePicker: false,
        navigationInstructionsInitiallyVisible: true,
        navigationHelpButton: false,
        selectionIndicator: false,
        baseLayerPicker: true,
        imageryProvider: false,
        depthTestAgainstTerrain: true,
  });
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  window.viewer = viewer
  var handler = new Cesium.ScreenSpaceEventHandler(window.viewer.canvas);
  // 添加mouseMove事件监听器
  handler.setInputAction((click)=>{
    var pickedObject = window.viewer.scene.pick(click.position);

    // 检查是否选中了多边形
    if (Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity) {
        // 获取多边形实体
        var entity = pickedObject.id;

        // 打印与多边形相关的属性
        // console.log(entity._properties);
        // 使用getShp函数
        const params = {
          id: entity._properties._djdtbbh._value, // 替换为实际的djd值
          dm:  entity._properties._kfqdm._value // 替换为实际的dm值
        };
        getShp(params)
            .then(data => {
              let res = data.data;
              form.bhlx = Array.isArray(res.bhlx) ? res.bhlx : [res.bhlx]; // 确保它是一个数组
              form.djdtbbh = res.djdtbbh;
              form.djdtbmj = res.djdtbmj;
              form.djtblx = res.djtblx || '未知类型'; // 如果没有匹配的简写，则默认为'未知类型'
              form.kfqdm = res.kfqdm;
              form.kfqmc = res.kfqmc;
              form.yypssj = res.yypssj;
              form.djdbz = res.djdbz || '未知';
            })
            .catch(error => {
              // 错误处理
              console.error(error);
            });
        }
  }
  ,Cesium.ScreenSpaceEventType.LEFT_CLICK)
  })
</script>

<template>
  <el-form id="mea" :model="form" label-width="auto" :inline="true" style="max-width: 800px">
    <el-form-item label="开发区代码" style="width:300px;" >
      <el-input v-model="form.kfqdm" readonly />
    </el-form-item>
    <el-form-item label="开发区名称" >
      <el-input v-model="form.kfqmc" />
    </el-form-item>
    <el-form-item label="待建地备注" style="width:300px;">
      <el-input v-model="form.djdbz" />
    </el-form-item>
    <el-form-item label="影像拍摄时间" >
      <el-input v-model="form.yypssj" />
    </el-form-item>
    <el-form-item label="待建地图斑编号" >
      <el-input v-model="form.djdtbbh" readonly/>
    </el-form-item>
    <el-form-item label="待建地图斑面积" >
      <el-input v-model="form.djdtbmj" />
    </el-form-item>
    <el-form-item label="待建图斑类型" style="width: 400px">
      <el-select v-model="form.djtblx" placeholder="please select your zone">
        <el-option label="推平未建设地块" value="shanghai" />
        <el-option label="临时性建设地块" value="beijing" />
        <el-option label="废弃耕地地块" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="变化类型">
    <el-checkbox-group v-model="form.bhlx">
      <el-checkbox value="灭失" name="type">灭失</el-checkbox>
      <el-checkbox value="范围缩小" name="type">范围缩小</el-checkbox>
      <el-checkbox value="范围扩大" name="type">范围扩大</el-checkbox>
      <el-checkbox value="新增代建" name="type">新增代建</el-checkbox>
      <el-checkbox value="未变化" name="type">未变化</el-checkbox>
    </el-checkbox-group>
    </el-form-item>
    <el-form-item style="margin-left: 250px;">
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<style scoped>
#mea{
  position: absolute;
  top: 33%;
  left: 30%;
  z-index: 2;
}
</style>