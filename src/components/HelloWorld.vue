<template>
<Communication></Communication> 
 
</template>

<script>
import Communication from '@/components/communication';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    Communication,
    // FormExample,
    // SlotExample,
    // TreeExample
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
