var domain = "pangsuan.com";
var apisec = "XXXXXX";
var API_URL = 'https://' + domain + '/api.php?';

module.exports = {
  //获取首页的推荐文章
  GetTopPosts: function () {
      return this.appendAPISEC(API_URL);
  },
  //获取文章
  GetPosts: function(p) {
      return this.appendAPISEC(API_URL + 'p=' + p);
  },
  GetPostsbyCID: function(cid){
      return this.appendAPISEC(API_URL + 'cid=' + cid);
  },
  GetAboutPage: function(){
      return this.appendAPISEC(API_URL + 'ispage=1');
  },
  appendAPISEC: function(url) {
      var request = url+"&apisec="+apisec;
      return (request);
  },
  IsNull(obj) {
      return(obj != null && obj != undefined);
  },
}