/**
 * Created by Administrator on 14-11-1.
 */
/*global document:true */
/*global unescape:true */
'use strict';
var skin=(function(){
	var setLocalStorage=function(n){
		console.log("setLocalStorage ,n:",n);
		localStorage.curSkin = ''+n;
	};

	var getLocalStorage = function(){
		var curSkin = localStorage.curSkin?localStorage.curSkin: 'iceSkin';
		console.log("getLocalStorage ,curSkin:",curSkin);
		return curSkin;
	};
	var setSkin=function(n){
		var skinFile = document.getElementById('skinFile');
		skinFile.href='styles/skin/'+n+'.css';
		setLocalStorage(n);
	};
	return {
		setSkin : setSkin,
		setLocalStorage : setLocalStorage,
		getLocalStorage : getLocalStorage
	};
})();
