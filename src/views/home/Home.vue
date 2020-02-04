<template>
  <div id="home">
    <nav-bar class="hone-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control ref="tabControl1" :titles="['流行','新款','精选']" @itemClick="tabClick" v-show="isFixed"/>
    <Scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentscroll"
      :pull-up-load="true"
      @pullingUp="loadMore">
      <home-swiper :banners="banners"  @itemSwiperLoad="swiperLoad"/>
      <recommends-view :recommends="recommends"/>
      <feater-view/>
      <tab-control ref="tabControl2" :titles="['流行','新款','精选']" @itemClick="tabClick"/>
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
  import {itemListenerMixin,backTopMixin} from 'common/mixin'
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
        tabControlOffsetTop:0,
        isFixed: false,
        saveY : 0,
        itemImgListener:null
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
    mixins:[itemListenerMixin,backTopMixin],
    //保留home离开后的位置,再次进入的时候直接回到上次home界面的位置
    activated(){
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()
      // console.log(this.saveY);

      //2.取消全局监听事件
      this.$bus.$off('itemImageLoad',this.itemImgListener)

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
        this.$refs.tabControl1.controlIndex = index
        this.$refs.tabControl2.controlIndex = index
      },
      contentscroll(position){
        //1.判断BackTop是否显示
        this.isShowBackTop = -(position.y)>1000

        //2.判断tabControl是否吸顶
        this.isFixed = -(position.y) > this.tabControlOffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.showGoods)
      },
      swiperLoad(){
        //2.获取tabControl的offsetTop
        //所有的组件都有一个属性$el:用于获取组件中的元素
        this.tabControlOffsetTop=this.$refs.tabControl2.$el.offsetTop
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
