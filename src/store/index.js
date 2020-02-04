import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "./mutations";
import getters from "./getters";
//1.安装插件
Vue.use(Vuex)

//2.创建Store对象
const store = new Vuex.Store({
  state:{
    cartList: []
  },
  actions:{
    addCart(context,payload){
      return new Promise((resolve, reject) => {
        //payload新添加的商品
        let oldProduct = null
        for(let item of context.state.cartList){
          if(item.iid === payload.iid){
            oldProduct = item
          }
        }
        //2.判断oldProduct
        if(oldProduct){
          oldProduct.count += 1
          resolve('当前商品+1')
        }else{
          payload.count = 1
          payload.checked = true
          context.state.cartList.push(payload)
          resolve('加入购物车成功')
        }
      })
    }
  },
  getters
})

//3.挂载在Vue实例上
export  default  store
