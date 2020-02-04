<template>
  <swiper>
    <swiper-item v-for="(item,index) in banners" :key="index" >
      <a :href="item.link">
        <img :src="item.image" alt="" @load="swiperLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper,SwiperItem} from 'components/common/swiper'
  export default {
    name: "",
    props:{
      banners:{
        type:Array,
        default(){
          return []
        }
      }
    },
    data(){
      return {
        isLoad: false
      }
    },
    components:{
      Swiper,
      SwiperItem
    },
    methods:{
      swiperLoad(){
        if(! (this.isLoad)){
          this.$emit('itemSwiperLoad')
          this.isLoad = true
        }

      }
    }
  }
</script>

<style scoped>

</style>
