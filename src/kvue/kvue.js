//为了实现数组响应式，重写Array.prototype

//对象响应式
function defineReactive(obj,key,val){
    
    observe(val)

    const dep = new Dep()
    Object.defineProperty(obj,key,{
        get(){
            // console.log('get--',val)
            Dep.target&&dep.addDep(Dep.target)
            if (Array.isArray(val)) {
                dependArray(val)
            }
            return val
        },
        set(newVal){
            if(newVal!==val){
                // console.log('set--',val)
                observe(newVal)
                val = newVal
                dep.notify()
            }
        }
    })
}

function dependArray (value) {
    for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
      e = value[i];
    //   e && e.__ob__ && e.__ob__.dep.addDep();
    Dep.target&&dep.addDep(Dep.target)
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
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
const orginalArray = Array.prototype
var arrayMethods = Object.create(orginalArray);
var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];
  methodsToPatch.forEach(function (method) {
    var original = orginalArray[method];
    // arrayMethods[method] = function(){
    //     var args = [], len = arguments.length;
    //     while ( len-- ) args[ len ] = arguments[ len ];
    //     original.apply(this, args);
    //     var ob = this.__ob__;
    //     var inserted;
    //     switch (method) {
    //         case 'push':
    //         case 'unshift':
    //             inserted = args;
    //             break
    //         case 'splice':
    //             inserted = args.slice(2);
    //             break
    //     }
        
    //     if (inserted) { ob.observeArray(inserted); }
    //     const dep = new Dep()
    //     dep.notify();
    // }
    def(arrayMethods, method, function mutator () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
        console.log(this,arguments)
        var result = original.apply(this, args);
        var ob = this.__ob__;
        var inserted;
        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break
          case 'splice':
            inserted = args.slice(2);
            break
        }
        if (inserted) { ob.observeArray(inserted); }
        // notify change
        ob.dep.notify();
        return result
      });
    
})

function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }
  var hasProto = '__proto__' in {};
  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  
  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
   function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

class Observe{
    constructor(value) {
        this.value = value
        this.dep = new Dep();
        def(value, '__ob__', this);
        if(Array.isArray(value)){
            // if (hasProto) {
            //     obj.__proto__  = arrayMethods
            //   } else {
            //     copyAugment(obj, arrayMethods, arrayKeys);
            //   }
            value.__proto__  = arrayMethods
            this.observeArray(value);
        }else{
            this.walk(value)
        }
        

    }
    walk(obj){
        Object.keys(obj).forEach(item => {
            defineReactive(obj,item,obj[item])
        });
        
    }
    observeArray (items) {
        for (var i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
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

class Compile {
    constructor(el,vm){
        this.$el = document.querySelector(el)
        this.$vm = vm
        if(this.$el){
            this.complle(this.$el)
        }
    }
    complle(el){
        const nodes = el.childNodes
        nodes.forEach((node)=>{
            if(node.nodeType === 1){
                //元素
                console.log('元素',node.nodeName)
                const attrs = node.attributes
                Array.from(attrs).forEach((attr)=>{
                   const attrName = attr.name;
                   const attrValue = attr.value;
                    if(attrName.startsWith('v-')){
                        const dir = attrName.substring(2)
                        console.log(dir)
                        this[dir]&&this[dir](node,attrValue)
                    }
                })
            }else if(this.innerTest(node)){
                //文本
                console.log('文本',node.textContent)
                this.complleText(node)
            }
            if(node.childNodes){
                this.complle(node)
            }
        })
    }
    //Watcher更新函数执行
    update(node,value,dir){
        //初始化
        const fn = this[dir+'Updater']
        /** 如果使用fn，所调用的方法中获取不到this,直接使用this[dir+'Updater']是可以的  或者所调用方法使用指针函数是可以获取到this的*/
        fn&&fn(node,this.$vm[value])
        //Watch执行更行
        new Watcher(this.$vm,value,function(val){
            fn&&fn(node,val)
        })
    }
    innerTest(node){
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    } 
    complleText(node){
        this.update(node,RegExp.$1,'text')
    }
    textUpdater(node,value){
        // console.log(this)
        node.textContent = value
    }
    // textUpdater = (node,value)=>{
    //     node.textContent = value
    // }
    text(node,value){
        this.update(node,value,'text')
    } 
    htmlUpdater(node,value){
        node.innerHTML = value
    }
    html(node,value){
        this.update(node,value,'html')
    }
}

const watchers = []
class Watcher {
    constructor(vm,key,updateFn){
        this.vm = vm
        this.key = key
        this.updateFn = updateFn

        Dep.target = this
        this.vm[this.key]
        Dep.target = null
        // watchers.push(this)
    }
    update(){
        this.updateFn.call(this.vm,this.vm[this.key])
    }
}

class Dep {
    constructor(){
        this.depList = []
    }
    addDep (watch){
        this.depList.push(watch)
        console.log(this.depList)
    }
    notify (){
        this.depList.forEach((item)=>item.update())
    }
}



class KVue {
    constructor(options){
        this.$options = options;
        this.$data = options.data
        //监听器
        observe(this.$data)
        //代理
        proxy(this)

        new Compile(options.el,this)
    }
}