<template>
  <swiper class="detail-swiper">
    <swiper-item v-for="(item,index) in topImage" :key="index">
      <img :src="item" alt="">
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper,SwiperItem} from 'components/common/swiper'
  export default {
    name: "",
    props:{
      topImage:{
        type:Array,
        data(){
          return []
        }
      }
    },
    components:{
      Swiper,
      SwiperItem
    }
  }
</script>

<style scoped>
.detail-swiper{
  height: 300px;
  text-align: center;
}
</style>
