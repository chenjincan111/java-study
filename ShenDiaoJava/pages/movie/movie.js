var API_URL = getApp().globalData.APP_URL +'/sdJava/movie/getMovieDetail';

Page({
	data:{
		movie:{}
	},
	onLoad:function (params){
		var that = this;
		wx.request({
		  url: API_URL+'?id='+params.id, 
		  data: {},
		  header: {
		      'Content-Type': 'application/json'
		  },
		  success: function(res) {
		    //console.log(res.data)
		    that.setData({
		    	movie: res.data.movie
		    });
		  }
		})
	}
});