const isObject = v => typeof v === 'object' && v !== null 

function reactive(obj){
    if(!isObject(obj)){
        return obj
    }
    return new Proxy(obj, {
        get(target,key,receiver){
            const res = Reflect.get(target,key,receiver)
            console.log('get',key); 
            //依赖收集
            track(target,key)
            return isObject(res) ? reactive(res) : res
        },
        set(target,key,value,receiver){
            const res = Reflect.set(target,key,value,receiver)
            //触发副作用
            trigger(target,key)
            console.log('set',key);
            return res
        },
        deleteProperty(target,key){
            const res = Reflect.get(target,key)
             //触发副作用
             trigger(target,key)
            console.log('deleteProperty');
            return res
        }
    })
}

// 临时存储副作用函数
const effectStack = []

//副作用函数：建立传入fn和其内部的依赖之间映射关系
function effect(fn){
    //执行fn触发依赖的get方法
    const e = createReactiveEffect(fn)
    //立即执行
    e()
}

function createReactiveEffect(fn){
    //封装fn;处理错误、保存到stack
    const effect = function(...args){
        try {
            //入栈
            effectStack.push(effect)
            return fn(...args)
        } finally {
            effectStack.pop()
        }
    }
    return effect
}

//依赖收集
const targetMap = new WeakMap()
function track(target,key){
    //获取副作用函数
    const effect = effectStack[effectStack.length-1]
    if(effect){
        //初始化时target这个key不存在
        let depMap = targetMap.get(target)
        if(!depMap){
            depMap = new Map()
            targetMap.set(target,depMap)
        }
        //从depMap中获取副作用函数集合
        let deps = depMap.get(key)
        if(!deps){
            deps = new Set()
            depMap.set(key,deps)
        }
         //放入新传入的副作用函数
        deps.add(effect)
    }
}

//触发副作用
function trigger(target,key){
    const depMap = targetMap.get(target)
    if(!depMap){
        return
    }
    const deps = depMap.get(key)
    if(deps){
        deps.forEach(dep=>dep())
    }
}

const state = reactive({foo:'foo',a:{b:[1,2,3]},c:[1,2,3]})
effect(()=>{
    console.log('effect',state.foo)
})
