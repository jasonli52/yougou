/**
 * 封装一个类似于axios的请求工具库。
 * 
 * axios例子：
 * 
 * 1.设置基准路径
 * axios.defaults.baseURL = ""
 * 
 * 2.发起请求，返回的是promise
 * axios({参数}).then().catch()
 * 
 * 3.监听错误
 * axios.onError( 回调函数 )
 * 
 * 封装思路：
 * 采用单例的封装模式
 */

/**
 * 发起请求
 */
const request = function (config = {}) {
    if(!config.url){
      throw new Error("请输入url地址")
      return;
    }
    if(config.url.search(/^http/)===-1){
      config.url = request.defaults.baseURL + config.url
    }
  // 返回一个promise。resolve是成功的回调。reject是失败的回调
  return new Promise((resolve, reject) => {
    //发起小程序的请求
    wx.request({
      // 把传入的对象解构
      ...config,

      success(res) {
        // 成功之后触发then的回调函数
        resolve(res);
      },
      fail(res){
        //循环调用错误的错误函数
        request.errors.forEach(fn => {
          fn(res)
        })
      },
      
      //后台接口可能会自定义错误,错误的处理函数放倒complete来执行
      complete(res){
        //循环调用错误的错误函数
        request.errors.forEach(fn=>{
          fn(res)
        })
      }
    })
  })
};

/**
 * request的默认的属性
 */
request.defaults = {
  baseURL: "https://api.zbztb.cn/api/public/v1"
}

// 保存错误函数
request.errors = [];

/**
 * 接收错误的触发函数
 * 
 * @参数：callback | 传入的错误函数
 */
request.onError = function (callback) {
  // 先保存到错误数组中，请求错误的时候统一调用
  request.errors.push(callback);
}

export default request;