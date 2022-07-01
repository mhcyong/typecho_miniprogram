//index.js
var API = require('../../utils/api');
var Net = require('../../utils/net');
//获取应用实例
var app = getApp();
var SystemInfo = wx.getSystemInfoSync()
Page({
    data: {
        toplist: [],
        list: [],
        page: 1,
        hasMore: true,
        loading: false,
        windowHeight: SystemInfo.windowHeight,       
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function() {
        console.log('onLoad')
        var that = this
            //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        });
        this.fetchtopposts();
        this.fetchposts();
    },
    //获取推荐文章
    fetchtopposts() {
        var that = this;
        Net.request({
            url: API.GetTopPosts(),            
            success: function(res) {
                var toplist = res.data.toplists;                
                that.setData({
                    toplist: toplist
                });
            }
        })
    },
    //获取文章列表
    fetchposts() {
        var that = this;
        this.data.loading = true;
        Net.request({
            url: API.GetPosts(this.data.page),            
            success: function(res) {
                var list = res.data.newlists;
                if (list.length === 0) {
                    that.hasMore = false;
                    return;
                }

                list.forEach(function(item) {
                    that.data.list.push(item);
                });

                that.setData({
                    list: that.data.list
                });
                that.data.page++;
                that.data.loading = false;
            }
        })
    },

    loadMore() {
        if (!this.data.hasMore || this.data.loading) return;
        this.fetchposts();
    },
    onShareAppMessage: function() {
        return {
            title: '胖蒜',
            path: '/pages/index/index',
            success: function(res) {
                // 分享成功
            },
            fail: function(res) {
                // 分享失败
            }
        }
    }
})