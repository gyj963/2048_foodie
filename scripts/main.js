function compare(a,b){var c=/undefined|number|string|boolean/,d=/^(function\s*)(\w*\b)/,e="constructor",f="childNodes",g="parentNode",h=arguments.callee;if(c.test(typeof a)||c.test(typeof b)||null===a||null===b)return a===b||isNaN(a)&&isNaN(b);if(a[e]!==b[e])return!1;switch(a[e]){case Date:return a.valueOf()===b.valueOf();case Function:return a.toString().replace(d,"$1")===b.toString().replace(d,"$1");case Array:if(a.length!==b.length)return!1;for(var i=0;i<a.length;i++)if(!h(a[i],b[i]))return!1;break;default:var j,k=0,l=0;if(a===b)return!0;if(a[f]||a[g]||b[f]||b[g])return a===b;for(j in a)k++;for(j in b)l++;if(k!==l)return!1;for(j in a)if(!h(a[j],b[j]))return!1}return!0}function Grid(){return this._gridTable=document.getElementById("grid-table"),this._trs=this._gridTable.getElementsByTagName("tr"),this.scoreContainer=document.getElementById("score-container"),this.bestContainer=document.getElementById("best-container"),this.animated=!1,this.init(),this.bindEvent(),this}Object.prototype.clone=function(){var a;a=this.constructor===Object?new this.constructor:new this.constructor(this.valueOf());for(var b in this)a[b]!==this[b]&&(a[b]="object"==typeof this[b]?this[b].clone():this[b]);return a.toString=this.toString,a.valueOf=this.valueOf,a};var gridData=function(){var a=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],b=function(b,c){a[b.h][b.v]=c},c=function(){return a},d=function(b){a=b};return{setState:b,getState:c,updateState:d}}(),scoreData=function(){var a=0,b=0,c=function(b){a=b},d=function(){return a},e=function(){var c=document.getElementById("score-container"),d=document.getElementById("best-container");c.innerHTML=a,d.innerHTML=b},f=function(a){b=a},g=function(){return b};return{setCurrentScore:c,getCurrentScore:d,setBestScore:f,getBestScore:g,updateScore:e}}();Grid.prototype.init=function(){var a=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];if(this.isInitState=!1,this.bestScore=localStorage.bestScore?parseInt(localStorage.bestScore):0,this.currentScore=localStorage.currentScore?parseInt(localStorage.currentScore):0,localStorage.state?this.state=JSON.parse(localStorage.state):(this.state=a,this.isInitState=!0),scoreData.setCurrentScore(this.currentScore),scoreData.setBestScore(this.bestScore),gridData.updateState(this.state),this.isInitState){for(var b=this.generateCoord(),c=this.generateCoord();;){var d=!0;for(var e in c)b[e]!==c[e]&&(d=!1);if(!d)break;c=this.generateCoord()}this.generateGrid(b),this.generateGrid(c),this.state=gridData.getState(),localStorage.state=JSON.stringify(gridData.getState())}for(var f=0;f<this.state.length;f++)for(var g=0;g<this.state[0].length;g++)0!==this.state[f][g]&&this.setGrid({h:f,v:g},this.state[f][g]);this.scoreContainer.innerHTML=this.currentScore,this.bestContainer.innerHTML=this.bestScore},Grid.prototype.restart=function(){var a=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];this.currentScore=0,this.state=a,scoreData.setCurrentScore(this.currentScore),gridData.updateState(this.state),this.clearGrid();for(var b=this.generateCoord(),c=this.generateCoord();;){var d=!0;for(var e in c)b[e]!==c[e]&&(d=!1);if(!d)break;c=this.generateCoord()}this.generateGrid(b),this.generateGrid(c),this.state=gridData.getState(),localStorage.state=JSON.stringify(gridData.getState()),localStorage.currentScore=0;for(var f=0;f<this.state.length;f++)for(var g=0;g<this.state[0].length;g++)0!==this.state[f][g]&&this.setGrid({h:f,v:g},this.state[f][g]);this.scoreContainer.innerHTML=this.currentScore},Grid.prototype.checkSuccess=function(){for(var a=!1,b=gridData.getState(),c=0;c<b.length;c++)for(var d=0;d<b[0].length;d++)if(2048===b[c][d]){a=!0;break}return a},Grid.prototype.checkFull=function(){for(var a=!0,b=gridData.getState(),c=0;c<b.length;c++)for(var d=0;d<b[0].length;d++)if(!b[c][d]){a=!1;break}return a},Grid.prototype.updateScore=function(a){this.currentScore=parseInt(this.currentScore)+parseInt(a),scoreData.setCurrentScore(parseInt(this.currentScore)),this.currentScore=scoreData.getCurrentScore(),localStorage.currentScore=parseInt(this.currentScore),localStorage.state=JSON.stringify(gridData.getState()),parseInt(this.currentScore)>parseInt(this.bestScore)&&(this.bestScore=parseInt(this.currentScore),scoreData.setBestScore(parseInt(this.bestScore)),localStorage.bestScore=parseInt(this.bestScore)),scoreData.updateScore()},Grid.prototype.generateCoord=function(){for(var a=Math.floor(4*Math.random()),b=Math.floor(4*Math.random()),c=gridData.getState(),d=c[a][b],e=0;0!==d;){if(e>=16){for(var f=0;f<c.length;f++)for(var g=0;g<c[0].length;g++)if(!c[f][g]){a=f,b=g;break}break}e%2===0?(d=c[(a+1)%4][b],a=(a+1)%4):(d=c[a][(b+1)%4],b=(b+1)%4),e++}return{h:a,v:b}},Grid.prototype.generateInitNum=function(){var a=Math.floor(10*Math.random());return a>1?2:4},Grid.prototype.generateGrid=function(a){var b=this.generateInitNum();this.setGrid(a,b),gridData.setState(a,b)},Grid.prototype.setGrid=function(a,b){var c=document.createElement("div"),d=this._trs[a.h].getElementsByTagName("td"),e=d[a.v],f=Math.log(b)/Math.log(2),g="block"+f%5;c.className="",c.className="grid "+g,c.innerHTML=b,e.innerHTML="",e.appendChild(c)},Grid.prototype.clearGrid=function(){for(var a=this,b=gridData.getState(),c=0;c<b.length;c++)for(var d=0;d<b[0].length;d++){var e=a._trs[c].getElementsByTagName("td"),f=e[d];f.innerHTML=""}},Grid.prototype.transState=function(a,b){var c=0,d=function(a){for(var b=0;b<=a.length-1;b++){for(var d=-1,e=0,f=!1;e<a[b].length;)0!==a[b][e]&&(f=!0,0>d?d=e:a[b][d]===a[b][e]?(a[b][d]=2*a[b][e],a[b][e]=0,c+=parseInt(a[b][d]),d=-1):d=e),e++;if(f){for(var g=[0,0,0,0],h=0,i=0;h<=a[b].length-1;h++)a[b][h]&&(g[i++]=a[b][h]);a[b]=g}}},e=function(a){for(var b=0;b<=a.length-1;b++){for(var d=-1,e=a[b].length-1,f=!1;e>=0;)0!==a[b][e]&&(f=!0,0>d?d=e:a[b][d]===a[b][e]?(a[b][d]=2*a[b][e],a[b][e]=0,c+=parseInt(a[b][d]),d=-1):d=e),e--;if(f){for(var g=[0,0,0,0],h=a[b].length-1,i=a[b].length-1;h>=0;h--)a[b][h]&&(g[i--]=a[b][h]);a[b]=g}}},f=function(a){for(var b=0;b<a[0].length;b++){for(var d=-1,e=0,f=!1;e<a.length;)0!==a[e][b]&&(f=!0,0>d?d=e:a[d][b]===a[e][b]?(a[d][b]=2*a[e][b],a[e][b]=0,c+=parseInt(a[d][b]),d=-1):d=e),e++;if(f){for(var g=[0,0,0,0],h=0,i=0;h<a.length;h++)a[h][b]&&(g[i++]=a[h][b]);for(var j=0;j<g.length;j++)a[j][b]=g[j]}}},g=function(a){for(var b=a[0].length-1;b>=0;b--){for(var d=-1,e=a.length-1,f=!1;e>=0;)0!==a[e][b]&&(f=!0,0>d?d=e:a[d][b]===a[e][b]?(a[d][b]=2*a[e][b],a[e][b]=0,c+=parseInt(a[d][b]),d=-1):d=e),e--;if(f){for(var g=[0,0,0,0],h=a.length-1,i=a.length-1;h>=0;h--)a[h][b]&&(g[i--]=a[h][b]);for(var j=0;j<g.length;j++)a[j][b]=g[j]}}};switch(a){case"left":return d(b),c;case"right":return e(b),c;case"up":return f(b),c;case"down":return g(b),c}},Grid.prototype.moveGrid=function(a,b,c,d){var e=this,f=0,g=0,h=function(a,g,h,i,j){var k={},l=window.innerWidth,m=1.6,n=73+m,o=40+m,p=98+m,q=0,r=0,s=0,t={},u=l>=800?p:700>l?o:n,v={},w={},x={};"lr"===a?(v=e._trs[g].getElementsByTagName("td"),w=v[h],x=w.getElementsByTagName("div"),k=$(x[0]),q=(i-h)*u,s=c[g][i],t={h:g,v:i}):"tb"===a&&(v=e._trs[h].getElementsByTagName("td"),w=v[g],x=w.getElementsByTagName("div"),k=$(x[0]),r=(i-h)*u,s=c[i][g],t={h:i,v:g}),e.animated=!0,function(a,g){k.animate({translate3d:""+q+"px,"+r+"px,0"},200,"ease-in",function(){e.setGrid(a,g),this.remove(),f++,f===j&&(gridData.updateState(c),e.generateGrid(e.generateCoord()),b=gridData.getState(),c=b.clone(),e.updateScore(d)),e.animated=!1})}(t,s)},i=function(a,b){var c=!1,d=function(d){for(var e=0;e<=b.length-1;e++)for(var f=0,g=0;f<a[e].length&&g<b[e].length;){for(;!a[e][f]&&f<a[e].length;)f++;for(;!b[e][g]&&g<b[e].length;)g++;if(f>=a[e].length||!b[e][g])break;f!==g?(d(e,f,g),a[e][f]===b[e][g]?(g++,f++):a[e][f]!==b[e][g]&&b[e][g]/a[e][f]===2&&(c?(c=!1,g++,f++):(c=!0,f++))):a[e][f]===b[e][g]?(g++,f++):a[e][f]!==b[e][g]&&b[e][g]/a[e][f]===2?c||(c=!0,f++):(g++,f++)}};d(function(){g++}),d(function(a,b,c){h("lr",a,b,c,g)})},j=function(a,b){var c=!1,d=function(d){for(var e=0;e<=b.length-1;e++)for(var f=a[e].length-1,g=b[e].length-1;f>=0&&g>=0;){for(;!a[e][f]&&f>=0;)f--;for(;!b[e][g]&&g>=0;)g--;if(0>f||!b[e][g])break;f!==g?(d(e,f,g),a[e][f]===b[e][g]?(g--,f--):a[e][f]!==b[e][g]&&b[e][g]/a[e][f]===2&&(c?(c=!1,g--,f--):(c=!0,f--))):a[e][f]===b[e][g]?(g--,f--):a[e][f]!==b[e][g]&&b[e][g]/a[e][f]===2?c||(c=!0,f--):(g--,f--)}};d(function(){g++}),d(function(a,b,c){h("lr",a,b,c,g)})},k=function(a,b){var c=!1,d=function(d){for(var e=0;e<b[0].length;e++)for(var f=0,g=0;g<b.length&&f<a.length;){for(;f<a.length&&!a[f][e];)f++;for(;g<b.length&&!b[g][e];)g++;if(f>=a.length||!b[g][e])break;f!==g?(d(e,f,g),a[f][e]===b[g][e]?(g++,f++):a[f][e]!==b[g][e]&&b[g][e]/a[f][e]===2&&(c?(c=!1,g++,f++):(c=!0,f++))):a[f][e]===b[g][e]?(g++,f++):a[f][e]!==b[g][e]&&b[g][e]/a[f][e]===2?c||(c=!0,f++):(g++,f++)}};d(function(){g++}),d(function(a,b,c){h("tb",a,b,c,g)})},l=function(a,b){var c=!1,d=function(d){for(var e=0;e<=b[0].length-1;e++)for(var f=a.length-1,g=b.length-1;f>=0&&g>=0;){for(;f>=0&&!a[f][e];)f--;for(;g>=0&&!b[g][e];)g--;if(0>f||!b[g][e])break;f!==g?(d(e,f,g),a[f][e]===b[g][e]?(g--,f--):a[f][e]!==b[g][e]&&b[g][e]/a[f][e]===2&&(c?(c=!1,g--,f--):(c=!0,f--))):a[f][e]===b[g][e]?(g--,f--):a[f][e]!==b[g][e]&&b[g][e]/a[f][e]===2?c||(c=!0,f--):(g--,f--)}};d(function(){g++}),d(function(a,b,c){h("tb",a,b,c,g)})};switch(a){case"left":i(b,c);break;case"right":j(b,c);break;case"up":k(b,c);break;case"down":l(b,c)}},Grid.prototype.bindEvent=function(){var a=($("body"),document.getElementById("game-container")),b=$(a),c=gridData.getState(),d=c.clone(),e=this,f=function(){c=gridData.getState(),d=c.clone()},g=function(a,b){var g=!1;if(!e.animated){f();var h=e.transState(a,d);if(e.checkSuccess()?pause.win(e):e.checkFull()&&compare(c,d)&&(g=!0),g)for(var i=["left","right","up","down"],j=d.clone(),k=0;k<i.length;k++)if(e.transState(i[k],j),!compare(c,j)){g=!1;break}g&&pause.gameover(e),e.moveGrid(a,c,d,h)}b.preventDefault()};b.on("swipeLeft",function(a){g("left",a)}).on("swipeRight",function(a){g("right",a)}).on("swipeUp",function(a){g("up",a)}).on("swipeDown",function(a){g("down",a)}),$(document).keydown(function(a){var b=a.keyCode;switch(b){case 37:g("left",a);break;case 39:g("right",a);break;case 40:g("down",a);break;case 38:g("up",a)}}),$(".restart").on("click",function(){e.restart()})},Grid.prototype.unbindEvent=function(){var a=($("body"),$(gameContainer));a.unbind("swipeLeft").unbind("swipeRight").unbind("swipeUp").unbind("swipeDown"),$(document).unbind("keydown")};var WeixinApi=function(){function a(a,b){b=b||{};var c=function(a){WeixinJSBridge.invoke("shareTimeline",{appid:a.appId?a.appId:"",img_url:a.imgUrl,link:a.link,desc:a.title,title:a.desc,img_width:"640",img_height:"640"},function(a){switch(a.err_msg){case"share_timeline:cancel":b.cancel&&b.cancel(a);break;case"share_timeline:confirm":case"share_timeline:ok":b.confirm&&b.confirm(a);break;case"share_timeline:fail":default:b.fail&&b.fail(a)}b.all&&b.all(a)})};WeixinJSBridge.on("menu:share:timeline",function(d){b.async&&b.ready?(window._wx_loadedCb_=b.dataLoaded||new Function,window._wx_loadedCb_.toString().indexOf("_wx_loadedCb_")>0&&(window._wx_loadedCb_=new Function),b.dataLoaded=function(a){window._wx_loadedCb_(a),c(a)},b.ready&&b.ready(d)):(b.ready&&b.ready(d),c(a))})}function b(a,b){b=b||{};var c=function(a){WeixinJSBridge.invoke("sendAppMessage",{appid:a.appId?a.appId:"",img_url:a.imgUrl,link:a.link,desc:a.desc,title:a.title,img_width:"640",img_height:"640"},function(a){switch(a.err_msg){case"send_app_msg:cancel":b.cancel&&b.cancel(a);break;case"send_app_msg:confirm":case"send_app_msg:ok":b.confirm&&b.confirm(a);break;case"send_app_msg:fail":default:b.fail&&b.fail(a)}b.all&&b.all(a)})};WeixinJSBridge.on("menu:share:appmessage",function(d){b.async&&b.ready?(window._wx_loadedCb_=b.dataLoaded||new Function,window._wx_loadedCb_.toString().indexOf("_wx_loadedCb_")>0&&(window._wx_loadedCb_=new Function),b.dataLoaded=function(a){window._wx_loadedCb_(a),c(a)},b.ready&&b.ready(d)):(b.ready&&b.ready(d),c(a))})}function c(a,b){b=b||{};var c=function(a){WeixinJSBridge.invoke("shareWeibo",{content:a.desc,url:a.link},function(a){switch(a.err_msg){case"share_weibo:cancel":b.cancel&&b.cancel(a);break;case"share_weibo:confirm":case"share_weibo:ok":b.confirm&&b.confirm(a);break;case"share_weibo:fail":default:b.fail&&b.fail(a)}b.all&&b.all(a)})};WeixinJSBridge.on("menu:share:weibo",function(d){b.async&&b.ready?(window._wx_loadedCb_=b.dataLoaded||new Function,window._wx_loadedCb_.toString().indexOf("_wx_loadedCb_")>0&&(window._wx_loadedCb_=new Function),b.dataLoaded=function(a){window._wx_loadedCb_(a),c(a)},b.ready&&b.ready(d)):(b.ready&&b.ready(d),c(a))})}function d(a,b){b=b||{};var c=function(a,c){if("timeline"==a.shareTo){var d=c.title;c.title=c.desc||d,c.desc=d}a.generalShare({appid:c.appId?c.appId:"",img_url:c.imgUrl,link:c.link,desc:c.desc,title:c.title,img_width:"640",img_height:"640"},function(c){switch(c.err_msg){case"general_share:cancel":b.cancel&&b.cancel(c,a.shareTo);break;case"general_share:confirm":case"general_share:ok":b.confirm&&b.confirm(c,a.shareTo);break;case"general_share:fail":default:b.fail&&b.fail(c,a.shareTo)}b.all&&b.all(c,a.shareTo)})};WeixinJSBridge.on("menu:general:share",function(d){b.async&&b.ready?(window._wx_loadedCb_=b.dataLoaded||new Function,window._wx_loadedCb_.toString().indexOf("_wx_loadedCb_")>0&&(window._wx_loadedCb_=new Function),b.dataLoaded=function(a){window._wx_loadedCb_(a),c(d,a)},b.ready&&b.ready(d,d.shareTo)):(b.ready&&b.ready(d,d.shareTo),c(d,a))})}function e(a,b){b=b||{},WeixinJSBridge.invoke("addContact",{webtype:"1",username:a},function(a){var c=!a.err_msg||"add_contact:ok"==a.err_msg||"add_contact:added"==a.err_msg;c?b.success&&b.success(a):b.fail&&b.fail(a)})}function f(a,b){a&&b&&0!=b.length&&WeixinJSBridge.invoke("imagePreview",{current:a,urls:b})}function g(){WeixinJSBridge.call("showOptionMenu")}function h(){WeixinJSBridge.call("hideOptionMenu")}function i(){WeixinJSBridge.call("showToolbar")}function j(){WeixinJSBridge.call("hideToolbar")}function k(a){a&&"function"==typeof a&&WeixinJSBridge.invoke("getNetworkType",{},function(b){a(b.err_msg)})}function l(a){a=a||{},WeixinJSBridge.invoke("closeWindow",{},function(b){switch(b.err_msg){case"close_window:ok":a.success&&a.success(b);break;default:a.fail&&a.fail(b)}})}function m(a){if(a&&"function"==typeof a){var b=this,c=function(){a(b)};"undefined"==typeof window.WeixinJSBridge?document.addEventListener?document.addEventListener("WeixinJSBridgeReady",c,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",c),document.attachEvent("onWeixinJSBridgeReady",c)):c()}}function n(){return/MicroMessenger/i.test(navigator.userAgent)}function o(a){a=a||{},WeixinJSBridge.invoke("scanQRCode",{},function(b){switch(b.err_msg){case"scan_qrcode:ok":a.success&&a.success(b);break;default:a.fail&&a.fail(b)}})}function p(a,b){b=b||{},WeixinJSBridge.invoke("getInstallState",{packageUrl:a.packageUrl||"",packageName:a.packageName||""},function(a){var c=a.err_msg,d=c.match(/state:yes_?(.*)$/);d?(a.version=d[1]||"",b.success&&b.success(a)):b.fail&&b.fail(a),b.all&&b.all(a)})}function q(a){window.onerror=function(b,c,d,e){if("function"==typeof a)a({message:b,script:c,line:d,column:e});else{var f=[];f.push("额，代码有错。。。"),f.push("\n错误信息：",b),f.push("\n出错文件：",c),f.push("\n出错位置：",d+"行，"+e+"列"),alert(f.join(""))}}}return{version:"2.5",enableDebugMode:q,ready:m,shareToTimeline:a,shareToWeibo:c,shareToFriend:b,generalShare:d,addContact:e,showOptionMenu:g,hideOptionMenu:h,showToolbar:i,hideToolbar:j,getNetworkType:k,imagePreview:f,closeWindow:l,openInWeixin:n,getInstallState:p,scanQRCode:o}}(),adjustHeight=function(){var a=document.body.scrollHeight,b=document.getElementById("pause");b.style.height=a+"px"},changeSkin=function(a){$(".changeSkin").on("click",function(){pause.changeSkin(a)})},initSkin=function(){skin.setSkin(skin.getLocalStorage())};window.onload=function(){adjustHeight(),initSkin();var a=new Grid;pause.initPauseBoard(a),weiboShare(),changeSkin(a)};var pause=function(){var a=document.getElementById("pause"),b=a.getElementsByClassName("gameover")[0],c=a.getElementsByClassName("win")[0],d=a.getElementsByClassName("skin")[0],e=function(e){var f=function(){a.className="hide",b.className="gameover hide",c.className="win hide",d.className="skin hide",e.bindEvent()};$(".gameover .restart").on("click",function(){f(),b.className="gameover hide"}).on("tap",function(){f(),b.className="gameover hide"}),$(".win .restart").on("click",function(){f(),c.className="win hide"}).on("tap",function(){f(),c.className="win hide"}),$("#pause").on("click",function(){f(),d.className="skin hide"}).on("tap",function(){f(),d.className="skin hide"}),$("#pause .skin .change").on("click",function(){skin.setSkin(this.id),f()}).on("tap",function(){skin.setSkin(this.id),f()})},f=function(c){var d=b.getElementsByTagName("span")[0],e=scoreData.getCurrentScore();d.innerHTML=e,a.className="",b.className="gameover",c.unbindEvent()},g=function(b){var d=c.getElementsByTagName("span")[0],e=scoreData.getCurrentScore();d.innerHTML=e,a.className="",c.className="win",b.unbindEvent()},h=function(b){a.className="",d.className="skin",b.unbindEvent()},i=function(b){a.className="hide",e(b)};return{event:e,win:g,gameover:f,changeSkin:h,initPauseBoard:i}}(),shareData=function(){var a="来玩吃货版2048（¯﹃¯）",b="(author/coder:@小熊跳跳跳 ;UI assistant:@大牛每天要画画 ;）",c='我正在玩"吃货版2048",你也来试试吧（ps：请确认你处于非饥饿状态..（¯﹃¯））'+b,d=window.location.href,e=window.location.href+"mdImg/qrcode.png",f=function(){return a},g=function(){return c},h=function(a,c){var d='我玩 "吃货版2048" 以'+a+"的高分通关啦！我的历史最高分为"+c+"!怎么？不服？不服来战！o(≧v≦)o "+b;return d},i=function(){return d},j=function(){return e};return{getTitle:f,getContent:g,getWinContent:h,getUrl:i,getImg:j}}(),weiboShare=function(){for(var a=document.getElementsByClassName("share"),b="http://service.weibo.com/share/share.php?appkey=&title="+shareData.getContent()+"&url="+shareData.getUrl()+"&pic="+shareData.getImg()+"&searchPic=true&style=simple",c="http://service.weibo.com/share/share.php?appkey=&title="+shareData.getWinContent(scoreData.getCurrentScore(),scoreData.getBestScore())+"&url="+shareData.getUrl()+"&pic="+shareData.getImg()+"&searchPic=true&style=simple",d=0;d<a.length;d++){var e=a[d].getElementsByTagName("a")[0];e.href="winShare"===e.className?c:b}};WeixinApi.ready(function(a){({imgUrl:shareData.getImg(),link:shareData.getUrl(),desc:shareData.getContent(),title:shareData.getTitle()});a.shareToFriend({},wxCalbacks)});var skin=function(){var a=function(a){console.log("setLocalStorage ,n:",a),localStorage.curSkin=""+a},b=function(){var a=localStorage.curSkin?localStorage.curSkin:"iceSkin";return console.log("getLocalStorage ,curSkin:",a),a},c=function(b){var c=document.getElementById("skinFile");c.href="styles/skin/"+b+".css",a(b)};return{setSkin:c,setLocalStorage:a,getLocalStorage:b}}();