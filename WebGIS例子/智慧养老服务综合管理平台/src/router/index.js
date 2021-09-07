import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/Accounts/Login.vue'

Vue.use(VueRouter)

const routes = [
    /**登录、注册、找回密码 */
    {
        path: '/loginByPhone',
        name: 'LoginByPhone',
        component: () =>
            import ('../components/Accounts/LoginByPhone.vue'),
    },
    {
        path: '/resetPass',
        name: 'ResetPass',
        component: () =>
            import ('../components/Accounts/ResetPass.vue'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () =>
            import ('../components/Accounts/Register.vue'),
    },
    /**管理中心 */
    {
        path: '/admincenter',
        name: 'AdminCenter',
        component: () =>
            import ('../components/AdminCenter.vue'),
    },

    /**主页 */
    {
        path: '/home',
        name: 'Home',
        component: () =>
            import ('../views/Home.vue'),
    },
    /**关于 */
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue'),
    },
    /**登录页面 */
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    // base: '/mywebApp/',
    routes: routes,
})

export default router