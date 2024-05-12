<template>
  <el-dialog v-model="dialogBool" title="信息修改" width="800">
    <el-form  :model="editData" label-width="auto" :inline="true" style="max-width: 800px">
    <el-form-item label="开发区代码" style="width:300px;" >
      <el-input v-model="editData.kfqdm" readonly />
    </el-form-item>
    <el-form-item label="开发区名称" >
      <el-input v-model="editData.kfqmc" />
    </el-form-item>
    <el-form-item label="待建地备注" style="width:300px;">
      <el-input v-model="editData.djdbz" />
    </el-form-item>
    <el-form-item label="影像拍摄时间" >
      <el-input v-model="editData.yypssj" />
    </el-form-item>
    <el-form-item label="待建地图斑编号" >
      <el-input v-model="editData.djdtbbh" readonly/>
    </el-form-item>
    <el-form-item label="待建地图斑面积" >
      <el-input v-model="editData.djdtbmj" />
    </el-form-item>
    <el-form-item label="待建图斑类型" style="width: 400px">
      <el-select v-model="editData.djtblx" placeholder="请选择">
        <el-option label="推平未建设地块" value="shanghai" />
        <el-option label="临时性建设地块" value="beijing" />
        <el-option label="废弃耕地地块" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="变化类型">
    <el-checkbox-group v-model="editData.bhlx"  @change="handleCheckboxChange">
      <el-checkbox value="灭失" name="type">灭失</el-checkbox>
      <el-checkbox value="范围缩小" name="type">范围缩小</el-checkbox>
      <el-checkbox value="范围扩大" name="type">范围扩大</el-checkbox>
      <el-checkbox value="新增代建" name="type">新增代建</el-checkbox>
      <el-checkbox value="未变化" name="type">未变化</el-checkbox>
    </el-checkbox-group>
    </el-form-item>
  </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button  @click="onSubmit">提交</el-button>
        <el-button type="primary" @click="dialogBool = false">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from 'vue'
import { reactive, ref } from 'vue'
import useBoolInfoStore from "../../store/useBool.ts"
import {updateShp} from "../../api/shp"; //引入仓库
const store = useBoolInfoStore();
import { storeToRefs } from 'pinia';
let {dialogBool} = storeToRefs(store);
const props = defineProps({
  editData: {
    type: Object,
    default: () => ({})
  }
})

const { editData } = toRefs(props)
const handleCheckboxChange =(value:any) => {
    if (value.length > 1) {
      editData.value.bhlx = [value.pop()];
    }
  }
const onSubmit = () => {
  const putForm = reactive({
    bhlx: editData.value.bhlx[0], // 初始化为空数组
    djdbz: editData.value.djdbz == "未知" ?null:  editData.value.djdbz,
    djdtbbh: editData.value.djdtbbh,
    djdtbmj: editData.value.djdtbmj,
    djtblx: editData.value.djtblx,
    kfqdm: editData.value.kfqdm,
    kfqmc: editData.value.kfqmc,
    yypssj: editData.value.yypssj,
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
</script>
