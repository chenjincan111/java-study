var API_URL = getApp().globalData.APP_URL+'/sdJava/movie/getMyMovies';
var app = getApp();

Page({
  data: {
  	title:"加载中。。",
  	movies:[]
  },
  onLoad:function (){

    var that = this;
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    });

    //获取微信用户信息
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
      console.log(userInfo);

      app.getOpenIdTap();
    });

  	wx.request({
      url:  API_URL,
      data: { openId: app.globalData.OPEN_ID},
  		header:{
  			'Content-Type': 'application/json'
  		},
  		success:function (res){
  			wx.hideToast();
  			var data = res.data;
  			console.log(data);
        if (!data.success){
          that.setData({
            title: "获取数据异常"
          });
        }else{
          that.setData({
            title: data.title,
            movies: data.movies
          });
        }
  		}
  	});
  }
})