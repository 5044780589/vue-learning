function defineReactive(obj,key,val){
    observe(val)
    Object.defineProperty(obj,key,{
        get(){
            console.log('get--',val)
            return val
        },
        set(newVal){
            if(newVal!==val){
                console.log('set--',val)
                observe(newVal)
                val = newVal
            }
        }
    })
}

function observe(obj){
    if(typeof obj  !=='object'||obj===null){
        return
    }
    //改写成ES6形式
    // Object.keys(obj).forEach(item => {
    //     defineReactive(obj,item,obj[item])
    // });
    new Observe(obj)
}

class Observe{
    constructor(value) {
        this.value = value
        if(Array.isArray(this.value)){

        }else{
            this.walk(value)
        }
    }
    walk(obj){
        Object.keys(obj).forEach(item => {
            defineReactive(obj,item,obj[item])
        });
    }
}

function proxy(vm){
    Object.keys(vm.$data).forEach((key)=>{
        Object.defineProperty(vm,key,{
            get(){
                return vm.$data[key]
            },
            set(newVal){
                vm.$data[key] = newVal
            }
        })
    })
}

class KVue {
    constructor(options){
        this.$options = options;
        this.$data = options.data
        //监听器
        observe(this.$data)
        //代理
        proxy(this)
    }
}