<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p @click="$store.commit('add')">counter:{{$store.state.counter}}</p>
    <p @click="$store.dispatch('add')">async counter:{{$store.state.counter}}</p>
    <p @click="">getters counter:{{$store.getters.doubleCounter}}</p>
    <router-view/>
  </div>
</template>
