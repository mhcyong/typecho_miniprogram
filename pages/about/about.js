// pages/about/about.js
var API = require('../../utils/api');
var Net = require('../../utils/net');
var app = getApp();

var SystemInfo = wx.getSystemInfoSync();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    item: [],
    thispath: 'page/detail/detail',
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
        url: API.GetAboutPage(),            
        success: function(res) {
            var detail = res.data.detail;    
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
  onPullDownRefresh: function () {
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
  onShareAppMessage: function () {

  }
})