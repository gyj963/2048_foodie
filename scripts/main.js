/*global $:false */
/*global document:true */
/*global window:true */
/*global pause:true */
/*global Grid:true */
/*global weiboShare:true */
'use strict';
var adjustHeight = function(){
	var height = document.body.scrollHeight,
		container = document.getElementById('pause');
	container.style.height = height +'px';
};

var changeSkin = function(grid){
	$('.changeSkin').on('click',function(){
		pause.changeSkin(grid);
	});
};
//页面加载完毕运行函数
window.onload = function(){
	adjustHeight();
	var grid = new Grid();
	pause.initPauseBoard(grid);
	weiboShare();
	changeSkin(grid);
};


//win 快速测试
//gridData.setState({h:2,v:0},2048)







