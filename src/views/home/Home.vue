<template>
  <div id="home">
    <nav-bar class="hone-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <Scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentscroll"
      :pull-up-load="true"
      @pullingUp="loadMore">
      <home-swiper :banners="banners"/>
      <recommends-view :recommends="recommends"/>
      <feater-view/>
      <tab-control class="tab-control" :titles="['流行','新款','精选']" @itemClick="tabClick"/>
      <goods-list :goods="showGoodslist"/>
    </Scroll>
<!--要想在组件上绑定事件 必须加上.native修饰符-->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendsView from "./childComps/RecommendsView";
  import FeaterView from "./childComps/FeaterView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/TabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import {getHomeMultidata,getHomeGoods} from "network/home";
  export default {
    name: "",
    components:{
      HomeSwiper,
      RecommendsView,
      FeaterView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data(){
      return{
        banners: [],
        recommends:[],
        goods:{
          'pop': {page:0,list:[]},
          'new': {page:0,list:[]},
          'sell':{page:0,list:[]}
        },
        showGoods: 'pop',
        isShowBackTop : false
      }
    },
    computed:{
      showGoodslist(){
        return this.goods[this.showGoods].list
      }
    },
    //执行生命周期函数(一旦组件创建就执行)
    created() {
      //1.请求多个数据
      this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    methods:{
      //事件监听方法
      tabClick(index){
        switch (index) {
          case 0 :{
            this.showGoods = 'pop'
            break
          }
          case 1:{
            this.showGoods = 'new'
            break
          }
          case 2:{
            this.showGoods = 'sell'
          }
        }
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0)
      },
      contentscroll(position){
        this.isShowBackTop = -(position.y)>1000
      },
      loadMore(){
        this.getHomeGoods(this.showGoods)
      },

      //网络请求方法
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
          // console.log(this.banners);
          // console.log(this.recommends);
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res=>{
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page+=1
          console.log(this.goods[type].list);

          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }
  .hone-nav{
    background-color: var(--color-tint);
    color:#ffffff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .tab-control{
    position: sticky;
    top: 44px;
    z-index: 9;
  }
  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
