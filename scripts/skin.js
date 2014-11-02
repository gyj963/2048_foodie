/**
 * Created by Administrator on 14-11-1.
 */
/*global document:true */
/*global unescape:true */
'use strict';
var skin=(function(){
	var setCookie=function(n){
		var expires=new Date();
		expires.setTime(expires.getTime()+24*60*60*365*1000);
		var flag='Skin_Cookie='+n;
		document.cookie=flag+';expires='+expires.toGMTString();
	};

	var readCookie = function(){
		var skin=0;
		var mycookie=document.cookie;
		var name='Skin_Cookie';
		var start1=mycookie.indexOf(name+'=');
		if(start1===-1){
			skin=0;
		}
		else{
			var start=mycookie.indexOf('=',start1)+1;
			var end=mycookie.indexOf(';',start);
			if(end===-1){
				end=mycookie.length;
			}
			var values= unescape(mycookie.substring(start,end));
			if (values!==null)
			{
				skin=values;
			}
		}
		return skin;

	};
	var setSkin=function(n){
		setCookie(n);
		var skinFile = document.getElementById('skinFile');
		skinFile.href='styles/skin/'+n+'.css';
	};
	return {
		setSkin : setSkin
	};
})();
