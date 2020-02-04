<template>
<div id="tabContentCate">
  <div v-for="(item,index) in subcategories.list" class="tabCate-item" :key="index">
    <a :href="item.link">
      <img :src="item.image" alt="" class="item-img">
      <div class="item-text">{{item.title}}</div>
    </a>
  </div>
</div>
</template>

<script>
  export default {
    name: "",
    props:{
      subcategories:{
        type :Object,
        default(){
          return {}
        }
      }
    }
  }
</script>

<style scoped>
#tabContentCate{
  margin-left: 5px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
  .tabCate-item{
    text-align: center;
    font-size: 12px;
    flex: 33%;
  }
  .item-img{
    width: 80%;
    margin-top: 15px;
  }
  .item-text{
    margin-top: 15px;
  }
</style>
