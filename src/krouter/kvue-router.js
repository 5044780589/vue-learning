let Vue
class VueRouter {
    constructor(options) {
        this.$options = options
        const initial = window.location.hash.slice(1) || "/";
        // 把current作为响应式数据
        // 将来发生变化，router-view的render函数能够再次执行
        Vue.util.defineReactive(this, 'current', initial)
        window.addEventListener('hashchange', () => {
            console.log(this.current);
            this.current = window.location.hash.slice(1)
        })
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
            let component = null
            const route = this.$router.$options.routes.find(
                (route) => route.path === this.$router.current
              );
            if (route) {
                component = route.component
            }
            console.log(this.$router.current, component);
            return h(component);
        },
    })
}



export default VueRouter