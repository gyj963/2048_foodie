/**
 * Created by Administrator on 14-10-30.
 */
/*global $:false */
/*global document:true */
/*global scoreData:true */
/*global pause:true */
/*global skin:true */
'use strict';

//一些阻塞的事件：gameover；success
var pause = (function(){
	var board = document.getElementById('pause'),
		gameoverBox = board.getElementsByClassName('gameover')[0],
		winBox = board.getElementsByClassName('win')[0],
		skinBox = board.getElementsByClassName('skin')[0];
	var event = function(grid){
		var hidePause = function(){
			board.className = 'hide';
			gameoverBox.className = 'gameover hide';
			winBox.className = 'win hide';
			skinBox.className = 'skin hide';
			grid.bindEvent();
		};
		$('.gameover .restart').on('click',function(){
			hidePause();
			gameoverBox.className = 'gameover hide';
		}).on('tap',function(){
            hidePause();
            gameoverBox.className = 'gameover hide';
        });
		$('.win .restart').on('click',function(){
			hidePause();
			winBox.className = 'win hide';
		}).on('tap',function(){
            hidePause();
            winBox.className = 'win hide';
        });
		$('#pause').on('click',function(){
			hidePause();
			skinBox.className = 'skin hide';
		}).on('tap',function(){
            hidePause();
            skinBox.className = 'skin hide';
        });

		$('#pause .skin .change').on('click',function(){
			skin.setSkin(this.id);
			hidePause();
		}).on('tap',function(){
			skin.setSkin(this.id);
	        hidePause();
        });
	};
	var gameover = function(grid){
		var scoreBox = gameoverBox.getElementsByTagName('span')[0],
			currentScore = scoreData.getCurrentScore();
		scoreBox.innerHTML = currentScore;
		board.className = '';
		gameoverBox.className = 'gameover';
		grid.unbindEvent();
	};
	var win = function(grid){
		var scoreBox = winBox.getElementsByTagName('span')[0],
			currentScore = scoreData.getCurrentScore();
		scoreBox.innerHTML = currentScore;
		board.className = '';
		winBox.className = 'win';
		grid.unbindEvent();
	};
	var changeSkin = function(grid){
		board.className = '';
		skinBox.className = 'skin';
		grid.unbindEvent();
	};
	var initPauseBoard = function(grid){
		board.className = 'hide';
		event(grid);
	};
	return {
		event : event,
		win : win,
		gameover : gameover,
		changeSkin : changeSkin,
		initPauseBoard : initPauseBoard
	};
})();