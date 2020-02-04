<template>
<div class="nav-bar">
  <div slot="center">
    商品分类
  </div>
</div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  export default {
    name: "",
    components:{
      NavBar
    }
  }
</script>

<style scoped>
.nav-bar{
  height: 44px;
  color: #fff;
  text-align: center;
  background-color: #ff8198;
  line-height: 44px;
  font-size: 16px;
  font-weight: bold;
}
</style>
