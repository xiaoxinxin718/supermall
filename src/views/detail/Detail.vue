<template>
<div id="detail">
  <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
  <scroll class="content" ref="scroll" @scroll="contentScroll" :probeType="3">
    <detail-swiper :top-image="topImage"></detail-swiper>
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shop"/>
    <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
    <detail-param-info ref="params" :param-info="paramInfo"/>
    <detail-comment-info ref="comment" :comment-info="commentInfo"/>
    <goods-list ref="recommend" :goods="recommendInfo"/>
  </scroll>
  <back-top @click.native="backClick" v-show="isShowBackTop"/>
  <detail-bottom-bar @addToCart="addToCart"/>

<!--  <toast :message="message" :show="show"/>-->
</div>
</template>

<script>
  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import {getDetailData,Goods,Shop,GoodsParam,getRecommend} from "network/detail"
  import {itemListenerMixin,backTopMixin} from 'common/mixin'
  import {debounce} from "../../common/utils";

  // import Toast from "components/common/toast/Toast";

  export default {
    name: "detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      GoodsList,
      Scroll,
      // Toast
    },
    data(){
      return{
        iid:null,
        topImage: [],
        goods: {},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommendInfo:[],
        themeTopYs:[],
        getThemeTopY :null,
        currentIndex : 0,
        // message: '',
        // show: false
      }
    },
    created() {
      //保存每个商品的iid，以便获取数据
      this.iid = this.$route.params.iid
      // console.log(this.iid)

      //获取每个商品详情页的数据
      getDetailData(this.iid).then((res)=>{
        //1.获取顶部的图片轮播数据
        // console.log(res);
        const data = res.result
        this.topImage = data.itemInfo.topImages

        //2.获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

        //3.获取店铺信息
        this.shop = new Shop(data.shopInfo)

        //4.获取商品信息
        this.detailInfo = data.detailInfo

        // 5.保存参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

        //6.取出评论信息
        if(data.rate.cRate !==0){
          this.commentInfo = data.rate.list[0]
        }

        //1.第一次获取,值不对
        //值不对的原因 this.$refs.params.$el 压根没有渲染
        // this.themeTopYs = []
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        //
        // console.log(this.themeTopYs);

        // this.$nextTick(()=>{
        //   //2.第二次获取:值不对
        //   //值不对的原因，图片没有计算在内
        //   //根据最新的数据，对应的DOM是已经被渲染出来
        //   //但是图片依然是没有加载完(目前获取到offsetTop不包含其中的图片)
        //   //offsetTop值不对的时候，都是因为图片的问题
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        //
        //   console.log(this.themeTopYs);
        // })
      })

      //获取商品推荐数据
      getRecommend().then(res=>{
        this.recommendInfo=res.data.list;
        console.log(this.recommendInfo)
      })

      //4.给getThemeTopY赋值(给对this.themeTopYs赋值的操作进行防抖)
      this.getThemeTopY = debounce(()=>{
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

        // console.log(this.themeTopYs);
      },300)

    },
   mixins:[itemListenerMixin,backTopMixin],
    methods:{
      imageLoad(){
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index){
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
      },
      contentScroll(position){
        let positionY = -position.y
        // console.log(positionY);

        //2.positionY和主题中值进行对比
        //[0,7938,9120,9452]
        //positionY在 0和 7938之间, index = 0
        //positionY在 7938和 9120之间, index = 1
        //positionY在 9120和 9452之间, index = 2
        //positionY超过9452, index = 3
      let length = this.themeTopYs.length
        for(let i = 0;i<length;i++){
          if(this.currentIndex!==i&&(i<length-1&&positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])||(i===length-1&&positionY>=this.themeTopYs[i])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
        this.isShowBackTop = -(position.y)>1000
      },
      addToCart(){
        //1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImage[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        //2.将商品添加到购物车里面
       this.$store.dispatch('addCart', product).then(res=>{
         // this.show = true
         // this.message = res;
         // setTimeout(()=>{
         //   this.show = false;
         //   this.message = ''
         // },1500)
         this.$toast.show(res,1500)
       })
      }
    },
    destroyed() {
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    }
  }
</script>

<style scoped>
#detail{
  position: relative;
  z-index: 99;
  background-color: #fff;
  height: 100vh;
}
.detail-nav{
  position: relative;
  z-index: 9;
  background-color: #fff;

}
  .content{
    height: calc(100% - 93px);
  }
</style>
