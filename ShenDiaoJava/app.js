
const APP_ID = 'wxd2a113aae5fcf61a';//输入小程序appid
const APP_SECRET = '82eb199a5cbf97d71c08cc9cc8e129cf';//输入小程序app_secret
App({
   globalData:{
      //APP_URL: 'http://localhost:8082',
      //APP_URL: 'http://106.14.142.93',
     APP_URL: 'https://www.cjciter.xin',
      OPEN_ID: '',//储存获取到openid
      SESSION_KEY: '',//储存获取到session_key
      userInfo:''
   },
   
   getUserInfo: function (cb) {
     var that = this
     if (this.globalData.userInfo) {
       typeof cb == "function" && cb(this.globalData.userInfo)
     } else {
       //调用登录接口
       wx.login({
         success: function () {
           wx.getUserInfo({
             success: function (res) {
               that.globalData.userInfo = res.userInfo
               typeof cb == "function" && cb(that.globalData.userInfo)
             }
           })
         }
       })
     }
   },
   getOpenIdTap: function () {
     var that = this;
     wx.login({
       success: function (res) {
         console.log(res);
         wx.request({
           //获取openid接口
           //url: 'https://api.weixin.qq.com/sns/jscode2session',
           url: that.globalData.APP_URL + '/sdJava/wx/getOpenId',
           data: {
             appid: APP_ID,
             secret: APP_SECRET,
             js_code: res.code,
             grant_type: 'authorization_code'
           },
           method: 'GET',
           success: function (res) {
             if (res.data.success){
               that.globalData.OPEN_ID = res.data.openid;//获取到的openid
               that.globalData.SESSION_KEY = res.data.session_key;//获取到session_key
             }else{
                wx.showToast({
                 title: '获取用户信息异常',
                 duration: 2000
               })
             }
           }  
         })
       }
     })
   }
})