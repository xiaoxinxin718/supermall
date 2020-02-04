export default {
    addCart(state,payload){
      return new Promise((resolve, reject) => {
        //payload新添加的商品
        let oldProduct = null
        for(let item of state.cartList){
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
          state.cartList.push(payload)
          resolve('加入购物车成功')
        }
      })
    }
}
