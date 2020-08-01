// pages/index/index.js
// 引入SDK核心类
var QQMapWX = require('../../qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'FQLBZ-474AU-DGTVG-2DOZU-STEE3-JQFL4'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '获取中',
    // 轮播图
    swiperList: [],
    // 导航栏
    navList: [],
    // 拼团数据
    groupData: [],
    // 广告数据
    adArr: [],
    // 猜你喜欢
    guessArr: []
  },
  // 获取地理位置
  getLocation() { 
    let page = this
    // 1.通过微信小程序的api获取当前的经纬度
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        // 2.把经纬度换成字体
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
              // 获取到地址
              if(res.status == 0) {
                const city = res.result.address_component.city
                page.setData({
                  city: city
                })
              }
          },
          fail: function (res) {
              console.log(res);
          }
        });
        // 通过获取当前位置来获取店铺
        page.getGuessArr(latitude, longitude)
      }
     })
  },
  // 获取轮播图
  getSwiperList() {
    // 发送请求获取数据
    wx.request({
      url: 'http://api.meituan.com/index/swiper',
      success: (res) => {
        if(res.statusCode == 200) {
          this.setData({
            swiperList: res.data
          })
        }
      }
    });
      
  },
  // 获取导航栏数据
  getNavList() {
    // 发送请求获取数据
    wx.request({
      url: 'http://api.meituan.com/index/entry',
      success: (res) => {
        if(res.statusCode == 200) {
          this.setData({
            navList: res.data
          })
        }
      }
    });
  },
  // 获取拼团数据
  getGroupData() {
    // 发送请求获取数据
    wx.request({
      url: 'http://api.meituan.com/index/pingtuan',
      success: (res) => {
        if(res.statusCode == 200) {
          this.setData({
            groupData: res.data
          })
        }
      }
    });
  },
  // 获取广告数据
  getAdArr() {
    wx.request({
      url: 'http://api.meituan.com/index/ad',
      success: (res) => {
        if(res.statusCode == 200) {
          this.setData({
            adArr: res.data
          })
        }
      }
    });
  },
  // 获取猜你喜欢数据
  getGuessArr(latitude, longitude) {
    let page = this
    wx.request({
      url: 'http://api.meituan.com/index/like',
      success: (res) => {
        if(res.statusCode == 200) {
          let disArr = res.data.map(v => {
            return {
              latitude: v.distance.lat,
              longitude: v.distance.lng
            }
          })
          // 通过经纬度来计算当前位置到店铺的距离
          qqmapsdk.calculateDistance({
            //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
            //from参数不填默认当前地址
            //获取表单提交的经纬度并设置from和to参数（示例为string格式）
            from: {
              latitude: latitude,
              longitude: longitude
            }, //若起点有数据则采用起点坐标，若为空默认当前地址
            to: disArr, //终点坐标
            success: function(resolute) {//成功后的回调
              if (resolute.status == 0) {
                let guessArr = res.data.map((v,i) => {
                  v.distance = resolute.result.elements[i].distance
                  return v
                })
                page.setData({
                  guessArr: guessArr
                })
              }
              
            },
            fail: function(error) {
              console.error(error);
            }
        });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocation()
    this.getSwiperList()
    this.getNavList()
    this.getGroupData()
    this.getAdArr()
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