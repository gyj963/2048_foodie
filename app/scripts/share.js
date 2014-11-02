/**
 * Created by Administrator on 14-10-31.
 */
/*global $:false */
/*global document:true */
/*global scoreData:true */
/*global window:true */
/*global WeixinApi:true */
/*global yourServerUrl:true */
/*global yourPostData:true */
/*global wxcalbacks:true */
'use strict';
var shareData = (function(){
    var title = '来玩吃货版2048（¯﹃¯）',
	    authorInfo = "(author/coder:@小熊跳跳跳 ;UI assistant:@大牛每天要画画 ;）",
	    content = '我正在玩"吃货版2048",你也来试试吧（ps：请确认你处于非饥饿状态..（¯﹃¯））'+authorInfo,
	    url = window.location.href,
	    img = window.location.href+'images/icon/favicon2048.png';
	var getTitle = function(){
		return title;
	};
	var getContent = function(){
	   return content;
	};
	var getWinContent = function(currentScore,bestScore){
	   var winContent = '我玩 "吃货版2048" 以'+currentScore+'的高分通关啦！我的历史最高分为'+bestScore+'!怎么？不服？不服来战！o(≧v≦)o '+authorInfo;
	   return winContent;
	};
    var getUrl = function(){
	    return url;
    };
	var getImg = function(){
		return img;
	};
	return {
		getTitle:getTitle,
		getContent:getContent,
		getWinContent:getWinContent,
		getUrl:getUrl,
		getImg:getImg
	}
})();
var weiboShare = function(){
	var share = document.getElementsByClassName('share'),
		hrefContent = 'http://service.weibo.com/share/share.php?appkey=&title='+shareData.getContent()+'&url='+shareData.getUrl()+'&pic='+shareData.getImg()+'&searchPic=true&style=simple',
		hrefWinContent = 'http://service.weibo.com/share/share.php?appkey=&title='+shareData.getWinContent(scoreData.getCurrentScore(),scoreData.getBestScore())+'&url='+shareData.getUrl()+'&pic='+shareData.getImg()+'&searchPic=true&style=simple';
	for(var i = 0;i<share.length;i++){
		var aitem = share[i].getElementsByTagName('a')[0];

		if(aitem.className==='winShare'){
			aitem.href = hrefWinContent;
		}else{
			aitem.href = hrefContent;
		}
	}
};
/**!
 * 微信内置浏览器的Javascript API，功能包括：
 *
 * 1、分享到微信朋友圈
 * 2、分享给微信好友
 * 3、分享到腾讯微博
 * 4、隐藏/显示右上角的菜单入口
 * 5、隐藏/显示底部浏览器工具栏
 * 6、获取当前的网络状态
 * 7、调起微信客户端的图片播放组件
 * @author zhaoxianlie(http://www.baidufe.com)
 */
// 所有功能必须包含在 WeixinApi.ready 中进行
WeixinApi.ready(function(Api){
	// 微信分享的数据
	var wxData = {
		'imgUrl':shareData.getImg(),
		'link':shareData.getUrl(),
		'desc':shareData.getContent(),
		'title':shareData.getTitle()
	};

	// 分享的回调
	var wxCallbacks = {
		// 分享过程需要异步执行
		async : true,
		// 分享操作开始之前
		ready:function () {
			var self = this;
			// 假设你需要在这里发一个 ajax 请求去获取分享数据
			$.post(yourServerUrl,yourPostData,function(responseData){
				// 可以解析reponseData得到wxData
				var wxData = responseData;
				// 调用dataLoaded方法，会自动触发分享操作
				// 注意，当且仅当 async为true时，wxCallbacks.dataLoaded才会被初始化，并调用
				self.dataLoaded(wxData);
			});
		}
		/* cancel、fail、confirm、all 方法同示例2，此处略掉 */
	};

	// 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
	Api.shareToFriend({}, wxCalbacks);
});
