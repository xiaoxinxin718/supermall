<template>
  <div class="category">
    <category-nav-bar class="nav-bar"></category-nav-bar>
    <div class="category-content">
        <tab-menu  :categories="categories" @detailClick="detailClick"></tab-menu>
      <scroll id="tab-content">
        <tab-content-cate :subcategories="showSubcategory"></tab-content-cate>
        <tab-control :titles="['综合','新品','销量']" class="tab-control" @itemClick="itemClick"></tab-control>
        <tab-content-detail :detail="showDetail"></tab-content-detail>
      </scroll>

    </div>
  </div>
</template>

<script>
  import CategoryNavBar from "./childComps/CategoryNavBar";
  import TabMenu from "./childComps/TabMenu";
  import TabContentCate from "./childComps/TabContentCate";
  import Scroll from "components/common/scroll/Scroll";
  import TabControl from "components/content/TabControl/TabControl";
  import TabContentDetail from "./childComps/TabContentDetail";

  import {getCategory,getSubcategory,getCategoryDetail} from 'network/category'
  export default {
    name: "",
    data(){
      return{
        categories:[],
        categoryData:{},
        currentIndex : -1,
        currType : 'pop'
      }
    },
    components:{
      CategoryNavBar,
      TabMenu,
      TabContentCate,
      Scroll,
      TabControl,
      TabContentDetail
    },
    computed:{
      showSubcategory(){
        if(this.currentIndex === -1) return{}
        return this.categoryData[this.currentIndex].subcategories
      },
      showDetail(){
        if(this.currentIndex===-1) return[]
        // console.log(this.categoryData[this.currentIndex].categoryDetail[this.currType]);
        return  this.categoryData[this.currentIndex].categoryDetail[this.currType]
      }
    },
    created() {
      getCategory().then(res=>{
        // console.log(res);
        this.categories = res.data.category.list
        // 2.初始化每个类别的子数据
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {},
            categoryDetail: {
              'pop': [],
              'new': [],
              'sell': []
            }
          }
        }
        this.getSubcategories(0)
      })
    },
    methods:{
      getSubcategories(index){
        this.currentIndex = index
        const mailkey = this.categories[index].maitKey
        getSubcategory(mailkey).then(res=>{
          // console.log(res);
          res.data.list.splice(res.data.list.length-1,1)
          this.categoryData[index].subcategories = res.data
          this.categoryData = {...this.categoryData}
          // console.log(this.categoryData);
          this.getCategoryDetail('pop')
          this.getCategoryDetail('new')
          this.getCategoryDetail('sell')
        })
      },
      getCategoryDetail(type){
        // 1.获取请求的miniWallkey
        const miniWallkey = this.categories[this.currentIndex].miniWallkey;
        // 2.发送请求,传入miniWallkey和type
        getCategoryDetail(miniWallkey, type).then(res => {
          // 3.将获取的数据保存下来
          this.categoryData[this.currentIndex].categoryDetail[type] = res
          this.categoryData = {...this.categoryData}
        })
      },
      itemClick(index){
        switch (index) {
          case 0 :{
            this.currType = 'pop'
            break
          }
          case 1:{
            this.currType = 'new'
            break
          }
          case 2:{
            this.currType = 'sell'
          }
        }
      },
      detailClick(index){
        this.getSubcategories(index)
      }
    }
  }
</script>

<style scoped>
  .category {
    height: 100vh;
  }
  .category-content{
    height: calc(100% - 44px - 49px);
    display: flex;
  }
  .nav-bar{
    position: relative;
    z-index: 2;
  }
  #tab-content{
    height: 100%;
    flex: 1;
  }
  .tab-control{
    margin-top: 25px;
  }

</style>
