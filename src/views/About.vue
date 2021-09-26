<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h1 @click="handelAdd">{{fileList}}</h1>
    <h1 @click="handelChange">{{fileMap}}</h1>
    <p @click="$store.commit('add','123')">counter:{{$store.state.counter}}</p>
    <p @click="$store.dispatch('add','123')">async counter:{{$store.state.counter}}</p>
    <p @click="">getters counter:{{$store.getters.doubleCounter}}</p>
    <router-view/>
  </div>
</template>
<script>
export default {
    data(){
        return {
            fileList:[],
            fileMap:{},
            title:'',
            summary:'',
            content:'',
            img:''
        }
    },
    methods:{
        handelAdd(){
            this.fileList.push('1')
        },
        handelChange(){
            this.fileMap.num = 1
            console.log(this.fileMap)
        }
    }
}
</script>

