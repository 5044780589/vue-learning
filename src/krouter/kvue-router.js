let Vue
class VueRouter {
    constructor(options) {
        console.log(options)
        this.$options = options
        this.current = window.location.hash.slice(1) || "/";
        // const initial = window.location.hash.slice(1) || "/";
        // 把current作为响应式数据
        // 将来发生变化，router-view的render函数能够再次执行
        // Vue.util.defineReactive(this, 'current', initial)
        Vue.util.defineReactive(this, 'matched', [])
        //match方法可以递归路由表，获得匹配关系的数组
        this.match()
        window.addEventListener('hashchange', () => {
            console.log(this.current);
            this.current = window.location.hash.slice(1)
            this.matched = []
            this.match()
        })
        // window.addEventListener('load', () => {
        //     console.log(this.current);
        //     this.current = window.location.hash.slice(1)
        // })
    }
    match(routes){
        routes = routes || this.$options.routes
        console.log(this.$options)
        for(const route of routes){
            if(route.path==='/'&&this.current==='/'){
                this.matched.push(route)
                return
            }
            if(route.path!=='/'&&this.current.indexOf(route.path) != -1){
                this.matched.push(route)
                if(route.children){
                    this.match(route.children)
                }
            }
        }
    }
}
// 参数1是Vue.use调用时传入的
VueRouter.install = function (_Vue) {
    Vue = _Vue
    // 全局混入目的：延迟下面逻辑到router创建完毕并且附加到选项上时才执行
    Vue.mixin({
        // 次钩子在每个组件创建实例时都会调用
      // 根实例才有该选项
        beforeCreate() {
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }
        }
    })
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true,
            },
        },
        render(h) {
            return h(
                "a", {
                    attrs: {
                        href: "#" + this.to,
                    },
                },
                this.$slots.default
            );
        },
    })
    Vue.component('router-view', {
        render(h) {
            //标记当前router-view深度
            this.$vnode.data.routerView = true
            let depth = 0
            let parent = this.$parent
            while(parent){
                console.log(parent)
                console.log(depth)
                const vnodeData = parent.$vnode && parent.$vnode.data
                if(vnodeData){
                    if(vnodeData.routerView){
                        depth++
                    }
                }
                parent = parent.$parent
            }
            let component = null
            // const route = this.$router.$options.routes.find(
            //     (route) => route.path === this.$router.current
            //   );
            const route = this.$router.matched[depth]
            console.log(this.$router.matched)
            if (route) {
                component = route.component
            }
            console.log('执行-------------',this.$router.current, component);
            return h(component);
        },
    })
}



export default VueRouter