let Vue
class Store{
    constructor(options){
        this._mutations = options.mutations
        this._actions = options.actions
        this._warappedGetters = options.getters
        this.commit = this.commit.bind(this)
        this.dispatch = this.dispatch.bind(this)
        const computed = {}
        this.getters = {}
        const store = this;
        Object.keys(this._warappedGetters).forEach((key)=>{
            const fn = store._warappedGetters[key]
            computed[key] = function(){
                return fn(store.state)
            }
            //为getters定义只读属性
            Object.defineProperty(store.getters, key, {
                get:()=>{
                    return store._vm[key]
                }
            })
        })
        this._vm = new Vue({
            data:{
                $$state:options.state
            },
            computed
        })
        
        // for(let key in options.getters){
        //     let _this = this
        //     Object.defineProperty(this.getters, key, {get(){
        //         return options.getters[key](_this.state)
        //     }})
        // }
    }
    get state(){
        return this._vm._data.$$state
    }
    set state(v){
        console.error('please use replaceState to reset state');
    }
    commit(type,payload){
        const entry = this._mutations[type]
        if(!entry){
            console.error('this is nor a mutations')
        }
        entry(this.state,payload)
    }
    dispatch(type,payload){
        const entry = this._actions[type]
        if(!entry){
            console.error('this is nor a actions')
        }
        entry(this,payload)
    }
    
}

function install (_Vue){
    Vue = _Vue
    Vue.mixin({
        // 次钩子在每个组件创建实例时都会调用
      // 根实例才有该选项
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        }
    })
}

export default {Store,install}