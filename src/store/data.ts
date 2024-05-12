import { defineStore } from "pinia"
 
const useDataInfoStore = defineStore('dataInfo', {
  // defineStore('userInfo',{})  userInfo就是这个仓库的名称name
  state: () => ({
    name: '无',
  })
})
 
export default useDataInfoStore