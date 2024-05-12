<template>
  <div>
    <el-table :data="tableData.listData.slice((currentPage4-1)*pageSize4,currentPage4*pageSize4)" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="kfqdm" label="开发区代码" />
    <el-table-column prop="kfqmc" label="开发区名称" />
    <el-table-column prop="image" label="图片">
  <template #default="{ row }">
    <el-image style="width: 80px; height: 40px; border: none; cursor: pointer" :src="row.image" fit="contain">
      <div slot="error" class="image-slot">
        <img src="./../../assets/noImg.png" style="width: auto; height: 40px; border: none">
      </div>
    </el-image>
  </template>
</el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
          修改
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
    <el-table-column>
          <template #header>
              <el-input v-model="search" size="small" placeholder="请输入查询内容" style="width: 120px;margin-bottom: 5px;"/>
              <el-button type="primary" size="small" @click="searchLink">查找</el-button>
              <el-button type="default" size="small" @click="resetTableData">恢复</el-button>
            </template>
      </el-table-column>
      
  </el-table>
  <br/>
  <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPage4"
      :total="tableData.listData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <categoryDialog :edit-data="currentEditData" />
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive,ref} from "vue"
import {getCategory,deleteCategory} from "../../api/category"; //引入仓库
import {getKfq,searchKfq} from "../../api/shp"; //引入仓库

import categoryDialog from "../../layout/dialog/categoryDialog.vue"; //引入仓库
import useBoolInfoStore from "../../store/useBool.ts"
const store = useBoolInfoStore();
let search=ref("")
let tableData = reactive({
  listData:[]
})


interface User {
  date: string
  name: string
  address: string
}

// 当前编辑的数据
const currentEditData = reactive({
  id: '', 
  kfqdm: '',
  kfqmc: '',
  image: '',
})

const handleEdit = (index: number, row: User) => {
  store.toggleDialogBool(); // 调用 store 中的方法来更新 navBool
  console.log(row.image)
  Object.assign(currentEditData, row);
}
const handleDelete = (index: number, row: User) => {
  // 获取要删除的数据的索引和行数据
  const { id } = row; // 直接从 row 对象中获取 djdtbbh 和 kfqdm 值
  // 调用 deleteKfq 方法来删除数据
  deleteCategory(id)
    .then(response => {
      // 处理成功响应
      console.log('数据删除成功:', response);
      // 更新表格数据
      tableData.listData.splice(index, 1); // 删除表格中的数据
    })
    .catch(error => {
      // 处理错误
      console.error('数据删除失败:', error);
    });
}

// 搜索方法
const searchLink = async () => {
  if (search.value) {
    try {
      // 发送搜索请求到后端
      const response = await searchKfq(search.value);
      console.log(response.data);
      tableData.listData = response.data; // 更新表格数据
    } catch (error) {
      console.error(error, "搜索失败");
    }
  } else {
    // 如果搜索框为空，重新获取所有数据
    getKfq().then((res) => {
      tableData.listData = res.data;
    }).catch((error) => {
      console.error(error, "获取失败");
    });
  }
};

const resetTableData = async () =>{
  getKfq().then(res =>{
      console.log(res.data)
      tableData.listData = res.data
      search.value = "";
    }).catch(error => {
      console.log(error,"获取失败")
    });
}
onMounted(()=>{
  getCategory().then(res =>{
      console.log(res.data)
      tableData.listData = res.data
    }).catch(error => {
      console.log(error,"获取失败")
    });
})


const currentPage4 = ref(1)
const pageSize4 = ref(10)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  pageSize4.value=val
}

const handleCurrentChange = (val: number) => {
  currentPage4.value=val
}
</script>

<style lang="scss">

</style>