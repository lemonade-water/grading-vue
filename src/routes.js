import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import User from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import Page7 from './views/nav3/Page7.vue'
import Page8 from './views/nav2/Page8.vue'
import echarts from './views/charts/echarts.vue'
import VueRouter from 'vue-router'

let routes = [

    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '个人信息',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: '个人信息' },
            { path: '/user', component: User, name: '修改密码' },
            // { path: '/form', component: Form, name: 'Form' },
            // { path: '/user', component: user, name: '注册用户' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '员工自评',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '评分细则' },
            { path: '/page8', component: Page8, name: '员工自评' },
            { path: '/page5', component: Page5, name: '自评列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '员工复评',
        iconCls: 'fa fa-address-card',
        //leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '员工复评' },
            { path: '/page7', component: Page7, name: '复评列表' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

const router = new VueRouter({
    routes
});
export default router;