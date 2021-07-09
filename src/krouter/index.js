import Vue from 'vue'
import VueRouter from './kvue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import AboutInfo from '../views/AboutInfo.vue'
import AboutLog from '../views/AboutLog.vue'
Vue.use(VueRouter)
const router = new VueRouter({
    mode:'hash',
    routes:[
        {
            path:'/',
            component:Home
        },
        {
            path: '/about',
            name: 'About',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            // redirect: '/about/info',
            component: About,
            children:[{
                path:'/about/info',
                component:AboutInfo
            },{
                path:'/about/log',
                component:AboutLog
            }]
          }
    ]
})

export default router