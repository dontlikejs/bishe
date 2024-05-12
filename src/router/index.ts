import { createRouter, createWebHistory } from 'vue-router'
import {
    TrendCharts,Grid,List
} from '@element-plus/icons-vue'
import TwoD from  '../views/TwoD.vue'
import index from  '../layout/index.vue'


import ThreeD from  '../views/ThreeD.vue'

const  routes = [
    // {
    //     path:'/',
    //     component:TwoD
    // },
    {
        path:'/',
        component:index,
        children: [
            {
              path: "user",
              component: () =>
                import(/* webpackChunkName: "dashboard" */ "../layout/views/user.vue"),
              name: "User",
              meta: {
                title: "用户管理",
                icon: List,
              }
            },
            {
              path: "kfq",
              component: () =>
                import(/* webpackChunkName: "shopTable" */ "../layout/views/kfq.vue"),
              meta: {
                title: "开发区管理",
                icon: Grid
              }
            },
            {
              path: "category",
              component: () =>
                import(/* webpackChunkName: "shopTable" */ "../layout/views/category.vue"),
              meta: {
                title: "分类管理",
                icon: TrendCharts
              }
            },
            // {
            //   path: "/dish/add",
            //   component: () =>
            //     import(/* webpackChunkName: "shopTable" */ "@/views/dish/addDishtype.vue"),
            //   meta: {
            //     title: "添加菜品",
            //     hidden: true
            //   }
            // },
            // {
            //   path: "employee",
            //   component: () =>
            //     import(/* webpackChunkName: "shopTable" */ "@/views/employee/index.vue"),
            //   meta: {
            //     title: "员工管理",
            //     icon: "icon-employee"
            //   }
            // },
            
            // {
            //   path: "/employee/add",
            //   component: () =>
            //     import(/* webpackChunkName: "dashboard" */ "@/views/employee/addEmployee.vue"),
            //   meta: {
            //     title: "添加员工",
            //     hidden: true
            //   }
            // },
            
            // {
            //   path: "/setmeal/add",
            //   component: () =>
            //     import(/* webpackChunkName: "shopTable" */ "@/views/setmeal/addSetmeal.vue"),
            //   meta: {
            //     title: "添加套餐",
            //     hidden: true
            //   }
            // }
          ]
    },
    {
        path: '/ThreeD',
        component: ()=> import('../views/ThreeD.vue')
    }
]
const routerHistory = createWebHistory()
const routers = createRouter({
    history: routerHistory,
    routes: routes
})
export default routers
