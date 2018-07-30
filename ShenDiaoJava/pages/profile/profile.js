var app = getApp();
Page({
  data: {
    userInfo: {}
  },

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    that.setData({
      userInfo: app.globalData.userInfo
    });
  }
});