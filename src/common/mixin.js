import {debounce} from "./utils";
import BackTop from "components/content/backTop/BackTop";
export const itemListenerMixin = {
  data(){
    itemImgListener:null
  },
  mounted(){
    //3.监听Item中图片加载完成
    const refresh = debounce(this.$refs.scroll.refresh,500)
    this.itemImgListener = ()=>{
      refresh()
    }
    this.$bus.$on('itemImageLoad',this.itemImgListener)
    // console.log('我是混入中的内容');
  }
}


export  const backTopMixin = {
  components:{
    BackTop
  },
  data(){
    return{
      isShowBackTop : false,
    }
  },
  methods:{
    backClick(){
      this.$refs.scroll.scrollTo(0,0)
    },
  }
}
