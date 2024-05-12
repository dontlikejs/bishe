<template>
  <el-dialog v-model="dialogBool" title="信息修改" width="800">
    <el-form  :model="editData" label-width="auto" :inline="true" style="max-width: 800px">
    <el-form-item label="id"  >
      <el-input v-model="editData.id" readonly />
    </el-form-item>
    <el-form-item label="名称" >
      <el-input v-model="editData.name" />
    </el-form-item>
    <el-form-item label="姓名" >
      <el-input v-model="editData.username" />
    </el-form-item>
    <el-form-item label="电话" >
      <el-input v-model="editData.phone" />
    </el-form-item>
    <el-form-item label="性别" >
      <el-input v-model="editData.sex"/>
    </el-form-item>
    <el-form-item label="身份证" >
      <el-input v-model="editData.idNumber" />
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
import {updateShpUser} from "../../api/user"; //引入仓库
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

const onSubmit = () => {
  console.log(editData.value.id)
  const putForm = reactive({
    id: editData.value.id, 
    name: editData.value.name,
    phone: editData.value.phone,
    username: editData.value.username,
    idNumber: editData.value.idNumber,
    sex: editData.value.sex,
})
updateShpUser(putForm)
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
