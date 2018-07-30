var util = require('../../utils/util.js');
var SAVE_MOVIE_URL = getApp().globalData.APP_URL + '/sdJava/movie/insert';
var app = getApp();

Page({
  data: {
    vedioType:'',
    titleBg:'',
    txareaBg: '',
    imgType: '',
    subMsg:{
      titleValue: '',  
      imgUrl: '',
      summaryValue: '', 
      vedioUrl: ''
    },
    showImgDisplay:'none'
  },
  uploadVedio: function(){
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        wx.showLoading({
          title: '请稍后',
        })
        var msg = util.getRes(res.errMsg);
        if(msg == 'ok'){
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success: function (res) {
              wx.hideLoading()
              if (util.getRes(res.errMsg) == 'ok') {
                wx.showToast({
                  title: '上传视频成功',
                  duration: 2000
                })
                var savedFilePath = res.savedFilePath
                that.setData({
                  vedioType: 'success',
                  'subMsg.vedioUrl': savedFilePath
                })
              } else {
                wx.showToast({
                  title: '上传视频失败',
                  icon: 'none',
                  duration: 2000
                })
                that.setData({
                  vedioType: 'warn'
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '上传视频失败',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            vedioType: 'warn'
          })
        }
        
      }
    })
  },
  uploadImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '请稍后',
        })
        if (util.getRes(res.errMsg) == 'ok'){
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          wx.saveFile({
            tempFilePath: tempFilePaths[0],
            success: function (res) {
              wx.hideLoading();
              if (util.getRes(res.errMsg) == 'ok') {
                wx.showToast({
                  title: '上传图片成功',
                  duration: 2000
                })
                var savedFilePath = res.savedFilePath
                that.setData({
                  imgType: 'success',
                  'subMsg.imgUrl': savedFilePath,
                  showImgDisplay:'block'
                })
              }else{
                wx.showToast({
                  title: '上传图片失败',
                  icon: 'none',
                  duration: 2000
                })
                that.setData({
                  imgType: 'warn'
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '上传图片失败',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            imgType: 'warn'
          })
        }
        
      }
    })
  },

  showImg: function(){
    wx.previewImage({
      current: this.data.subMsg.imgUrl, // 当前显示图片的http链接
      urls: [this.data.subMsg.imgUrl] // 需要预览的图片http链接列表
    })
  },

  titleInput:function(e){
    //this.data.subMsg.titleValue = e.detail.value;
    this.setData({
      'subMsg.titleValue': e.detail.value.trim()
    });
    if (e.detail.value.trim() == ''){
      this.setData({
        titleBg: 'bgWarnImg'
      });
    }else{
      this.setData({
        titleBg: 'bgSuccessImg'
      })
    }
  },
  summaryInput: function (e) {
    this.setData({
      'subMsg.summaryValue': e.detail.value.trim()
    })
    if (e.detail.value.trim() == '') {
      this.setData({
        txareaBg: 'bgWarnImg'
      })
    } else {
      this.setData({
        txareaBg: 'bgSuccessImg'
      })
    }
  },

  submitMsg: function(){
    var that = this;

    wx.showLoading({
      title: '正在提交，请稍后',
    })
    var formmsg = this.data.subMsg;
    console.log(formmsg);
    var falg = true;
    if (formmsg.summaryValue == '') {
      wx.showToast({
        title: '请输入视频简介',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        txareaBg: 'bgWarnImg'
      })
      falg = false;
    } 
    if (formmsg.imgUrl == '') {
      wx.showToast({
        title: '请输入上传封面图片',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        imgType: 'warn'
      })
      falg = false;
    }
    if (formmsg.vedioUrl == '') {
      wx.showToast({
        title: '请输入上传视频',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        vedioType: 'warn'
      })
      falg = false;
    }
    if (formmsg.titleValue == '') {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 2000
      });
      this.setData({
        titleBg: 'bgWarnImg'
      })
      falg = false;
    }
    if(!falg){
      wx.hideLoading()
      return;
    }
    wx.request({
      url: SAVE_MOVIE_URL,
      data: {
        title: formmsg.titleValue,
        imgUrl: formmsg.imgUrl,
        author: app.globalData.userInfo.nickName,
        vedioUrl: formmsg.vedioUrl,
        summary: formmsg.summaryValue,
        openId: app.globalData.OPEN_ID
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        wx.hideLoading()
        if(res.data.success){
          // wx.showToast({
          //   title: res.data.message,
          //   duration: 2000
          // });
          wx.showModal({
            title: '上传成功',
            content: '继续上传视频？',
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  vedioType: '',
                  titleBg: '',
                  txareaBg: '',
                  imgType: '',
                  'subMsg.titleValue': '',
                  'subMsg.imgUrl': '',
                  'subMsg.summaryValue': '',
                  'subMsg.vedioUrl': '',
                  showImgDisplay: 'none'
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  }

});