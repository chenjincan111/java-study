var API_URL = getApp().globalData.APP_URL + '/sdJava/movie/getAllMovies';
var app = getApp();

Page({
	data:{
		movies:[]
	},
	search:function (e){

		if (!e.detail.value.trim()){
			return;
		}
    console.log(e.detail.value.trim());
		wx.showToast({
			title:"加载中..",
			icon:"loading",
			duration:10000
		});
		var that = this;

    wx.request({
      url: API_URL,
      data: { title: e.detail.value.trim()},
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        wx.hideToast();
        var data = res.data;
        console.log(data);
        if (!data.success) {
          that.setData({
            title: "获取数据异常"
          });
        } else {
          that.setData({
            movies: data.movies
          });
        }
      }
    });


	}
});