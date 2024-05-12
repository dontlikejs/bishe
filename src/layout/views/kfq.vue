<template>
  <div>
    <el-table :data="tableData.listData.slice((currentPage4-1)*pageSize4,currentPage4*pageSize4)" style="width: 100%">
    <el-table-column prop="kfqdm" label="开发区代码" />
    <el-table-column prop="kfqmc" label="开发区名称" />
    <el-table-column prop="djdbz" label="备注" />
    <el-table-column prop="djdtbmj" label="面积" />
    <el-table-column prop="bhlx" label="变化类型" />
    <el-table-column prop="djtblx" label="待建图斑类型" />
    <el-table-column prop="yypssj" label="时间" />
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
    <UpdateDialog :edit-data="currentEditData" />
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive,ref} from "vue"
import {getKfq,searchKfq,deleteKfq} from "../../api/shp"; //引入仓库
import UpdateDialog from "../../layout/dialog/UpdateDialog.vue"; //引入仓库
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
  bhlx: [], 
  djdbz: '',
  djdtbbh: '',
  djdtbmj: '',
  djtblx: '',
  kfqdm: '',
  kfqmc: '',
  yypssj: '',
})

const handleEdit = (index: number, row: User) => {
  store.toggleDialogBool(); // 调用 store 中的方法来更新 navBool
  // 将当前行的数据赋值给 currentEditData
  if (Array.isArray(row.bhlx)) {
    // 如果已经是数组，直接赋值
    currentEditData.bhlx = row.bhlx;
  } else {
    // 如果不是数组，尝试将其转换为数组
    const bhlxArray = row.bhlx.split(',').map(item => item.trim());
    currentEditData.bhlx = bhlxArray;
  }

  currentEditData.djdbz = row.djdbz;
  currentEditData.djdtbbh = row.djdtbbh;
  currentEditData.djdtbmj = row.djdtbmj;
  currentEditData.djtblx = row.djtblx;
  currentEditData.kfqdm = row.kfqdm;
  currentEditData.kfqmc = row.kfqmc;
  currentEditData.yypssj = row.yypssj;
}
const handleDelete = (index: number, row: User) => {
  // 获取要删除的数据的索引和行数据
  const { djdtbbh, kfqdm } = row; // 直接从 row 对象中获取 djdtbbh 和 kfqdm 值
  // 调用 deleteKfq 方法来删除数据
  deleteKfq(djdtbbh, kfqdm)
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
    getKfq().then(res =>{
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