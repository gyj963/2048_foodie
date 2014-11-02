/**
 * Created by Administrator on 14-10-28.
 */
/*global document:true */
/*global scoreData:true */
/*global gridData:true */
'use strict';

//记录当前状态的矩阵及set get操作
var gridData = (function(){
	var state = [
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0]
	];
	var setState = function(coord,num){
		state[coord.h][coord.v] = num;
	};
	var getState = function(){
		return state;
	};
	var updateState = function(newState){
		state =newState;
	};
	return {
		setState : setState,
		getState : getState,
		updateState : updateState
	};
})();

//记录分数数据
var scoreData = (function(){
	var currentScore = 0,
		bestScore = 0;

	var setCurrentScore = function(score){
		currentScore = score;
	};
	var getCurrentScore = function(){
		return currentScore;
	};
	var updateScore = function(){
		var scoreContainer = document.getElementById('score-container'),
			bestContainer = document.getElementById('best-container');

		scoreContainer.innerHTML = currentScore;
		bestContainer.innerHTML = bestScore;
	};
	var setBestScore = function(score){
		bestScore = score;
	};
	var getBestScore = function(){
		return bestScore;
	};
	return {
		setCurrentScore : setCurrentScore,
		getCurrentScore : getCurrentScore,
		setBestScore : setBestScore,
		getBestScore : getBestScore,
		updateScore:updateScore
	};
})();

