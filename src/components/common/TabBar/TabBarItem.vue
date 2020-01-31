<template>
    <div class="tab-bar-item" @click="itemClick">
      <div v-if="!isActive">
        <slot name="item-icon"></slot>
      </div>
     <div v-else>
       <slot name="item-icon-active"></slot>
     </div>
     <div :style="isActiveColor">
       <slot name="item-text"></slot>
     </div>
    </div>
</template>

<script>
  export default {
    name: "",
    props:{
      path:String,
      activeColor:{
        type:String,
        default: 'red'
      }
    },
    data(){
      return{
        // isActive: true
      }
    },
    computed:{
      isActive(){
        //等价于
        //return this.$route.path === this.path
        return this.$route.path.indexOf(this.path) !== -1
      },
      isActiveColor(){
        return this.isActive?{color:this.activeColor}:{}
      }
    },
    methods:{
      itemClick(){
        this.$router.push(this.path)
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }
  .tab-bar-item img{
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
  .active{
    color:red;
  }
</style>
