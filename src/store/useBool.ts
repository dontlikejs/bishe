import { defineStore } from "pinia"
 
const useBoolInfoStore = defineStore('boolInfo', {
  // defineStore('userInfo',{})  userInfo��������ֿ������name
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