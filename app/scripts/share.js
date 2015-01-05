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
	    img = window.location.href+'mdImg/qrcode.png';
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

