import { defineStore } from "pinia"
 
const useBoolInfoStore = defineStore('boolInfo', {
  // defineStore('userInfo',{})  userInfo就是这个仓库的名称name
  state: () => ({
    navBool: true,
    dialogBool:false,
  }),
  actions: {
    toggleNavBool() {
      this.navBool = !this.navBool;
    },
    toggleDialogBool() {
      this.dialogBool = !this.dialogBool;
    },
  },
})
 
export default useBoolInfoStore;