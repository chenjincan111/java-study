var API_URL = getApp().globalData.APP_URL + '/sdJava/movie/getMovieDetail';
var GET_DANMU_LIST_URL = getApp().globalData.APP_URL + '/sdJava/danmu/getAllDanmu';
var SAVE_DANMU_URL = getApp().globalData.APP_URL + '/sdJava/danmu/insert';

function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  inputValue: '',
  damuSendTime:0,
  movieId:'',
  data: {
    inputTxt:'',
    movie: {},
    danmuList: [
      // {
      //   text: '第 0s 出现的弹幕',
      //   color: '#ff0000',
      //   time: 0
      // }
      ]
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  onLoad: function (params) {
    this.movieId = params.id;
    var that = this;
    //获取电影资源
    wx.request({
      url: API_URL + '?id=' + params.id,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          movie: res.data.movie
        });
      }
    });
    //获取弹幕信息
    wx.request({
      url: GET_DANMU_LIST_URL + '?movieId=' + params.id,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.danmus);
        that.setData({
          danmuList: res.data.danmus
        });
      }
    });
  },
  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  //发送弹幕并保存数据库
  bindSendDanmu: function () {
    var that = this;
    if (this.inputValue == ''){
        return;
    }
    var danmuColor = getRandomColor();
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: danmuColor
    });

    // that.data.danmuList.push({
    //   color: danmuColor,
    //   time: this.damuSendTime,
    //   text: this.inputValue
    // });
    // that.setData({
    //   danmuList: that.data.danmuList
    // });

    wx.request({
      url: SAVE_DANMU_URL,
      data: {
        color: danmuColor,
        time: this.damuSendTime,
        content: this.inputValue,
        movieId: this.movieId
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        that.setData({
          inputTxt: ''
        });
        that.inputValue = '';
      }
    })
  },
  vedioUpdate: function (obj) {
    this.damuSendTime = Math.ceil(obj.detail.currentTime);
  }
});