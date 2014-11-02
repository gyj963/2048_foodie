/**
 * Created by Administrator on 14-10-27.
 */
function compare(a,b){
	var
		pt = /undefined|number|string|boolean/,
		fn = /^(function\s*)(\w*\b)/,
		cr = 'constructor',
		cn = 'childNodes',
		pn = 'parentNode',
		ce = arguments.callee;
	if(pt.test(typeof a) || pt.test(typeof b) || a === null || b === null){
		return a === b || (isNaN(a) && isNaN(b)); //为了方便，此处假定NaN == NaN
	}
	if(a[cr] !== b[cr]){
		return false;
	}
	switch(a[cr]){
		case Date : {
			return a.valueOf() === b.valueOf();
		}
		case Function : {
			return a.toString().replace(fn,'$1') === b.toString().replace(fn,'$1'); //硬编码中声明函数的方式会影响到toString的结果，因此用正则进行格式化
		}
		case Array : {
			if(a.length !== b.length){
				return false;
			}
			for(var i=0;i<a.length;i++){
				if(!ce(a[i],b[i])){
					return false;
				}
			}
			break;
		}
		default : {
			var alen = 0, blen = 0, d;
			if(a === b){
				return true;
			}
			if(a[cn] || a[pn] || b[cn] || b[pn]){
				return a === b;
			}
			for(d in a){
				alen++ ;
			}
			for(d in b){
				blen++;
			}
			if(alen !== blen){
				return false;
			}
			for(d in a){
				if(!ce(a[d],b[d])){
					return false;
				}
			}
			break;
		}
	}
	return true;
}
//console.log(compare({},{a:1})); //false
//console.log(compare({a:1},{b:2})); //false
//console.log(compare({b:2,a:1},{a:1,b:2})); //true
//console.log(compare({a:function(){return false;},b:2},{a:function(){return false;},b:2})); //true
//console.log(compare([],[])); //true
//console.log(compare([2,1],[1,2])); //false
//console.log(compare(function(){alert(1)},function(){})); //false
//console.log(compare(function aaa(){alert(1)},function(){alert(1)})); //true
//console.log(compare(document.getElementsByTagName("a")[0],document.getElementsByTagName("a")[1])); //false
//console.log(compare(document.getElementsByTagName("a")[0],document.getElementsByTagName("a")[0])); //true
