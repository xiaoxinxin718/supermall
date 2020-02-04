<template>
  <div class="cart">
<!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
<!-- 商品的列表-->
    <cart-list/>

<!-- 底部汇总-->
  <cart-button-bar/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CartList from "./childComps/CartList";
  import CartButtonBar from "./childComps/CartButtonBar";

  import {mapGetters} from 'vuex'

  export default {
    name: "",
    components:{
      NavBar,
      CartList,
      CartButtonBar
    },
    computed:{
      //将Vuex中的getters方法转化为计算属性
      ...mapGetters(['cartLength'])
    }
  }
</script>

<style scoped>
  .cart{
    height: 100vh;
  }
.nav-bar{
  background-color: var(--color-high-text);
  color:#fff;
  font-weight: 700;
}
</style>
