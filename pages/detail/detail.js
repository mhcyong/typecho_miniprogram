// pages/detail/detail.js//
var API = require('../../utils/api');
var Net = require('../../utils/net');
var app = getApp();

var SystemInfo = wx.getSystemInfoSync()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [],
    thispath: 'page/detail/detail',
    cid: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.cid = options.item;
    var that = this
            //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        });
      this.loadData();
  },

  loadData() {
    var that = this;    
    Net.request({
        url: API.GetPostsbyCID(this.data.cid),            
        success: function(res) {
            var detail = res.data.detail
            that.setData({
                item: detail,
                article: app.towxml(detail.text,'markdown')
            });
        }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
     this.loadData();
   },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: this.data.item.title,
      path: this.data.item.thispath + '?cid=' + this.data.cid,
      imageUrl: this.data.item.str_value,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },


  /**
	 * 用户点击右上角分享至朋友圈
	 */
	onShareTimeline: function () {
		return {
			title: this.data.item.title,
			imageUrl: this.data.item.str_value,
		}
	},
	  
	/**
	 * 用户点击右上角添加到收藏
	 */
	onAddToFavorites: function () {
		return {
			title: this.data.item.title,
			imageUrl: this.data.item.str_value,
		}
	},
})