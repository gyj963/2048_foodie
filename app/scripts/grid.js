/**
 * Created by Administrator on 14-10-21.
 */
/*global $:false */
/*global document:true */
/*global localStorage:true */
/*global scoreData:true */
/*global gridData:true */
/*global window:true */
/*global compare:true */
/*global pause:true */
'use strict';


function Grid(){
	this._gridTable = document.getElementById('grid-table');
	this._trs = this._gridTable.getElementsByTagName('tr');
	this.scoreContainer = document.getElementById('score-container');
	this.bestContainer = document.getElementById('best-container');
	this.animated = false;

	this.init();
	this.bindEvent();
	return this;
}
//初始化分数和当前状态（localstorage中存的）
Grid.prototype.init = function(){
	var initstate = [
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0]];

	this.isInitState = false;
	this.bestScore = localStorage.bestScore?parseInt(localStorage.bestScore): 0;
	this.currentScore = localStorage.currentScore?parseInt(localStorage.currentScore): 0;

	if(localStorage.state){
		this.state = JSON.parse(localStorage.state);
	}else{
		this.state = initstate;
		this.isInitState = true;
	}
	scoreData.setCurrentScore(this.currentScore);
	scoreData.setBestScore(this.bestScore);
	gridData.updateState(this.state);

	if(this.isInitState){
		var initCoorda = this.generateCoord(),
			initCoordb = this.generateCoord();

		while(true){
			var equal=true;
			for(var k in initCoordb){
				if(initCoorda[k]!==initCoordb[k]){
					equal = false;
				}
			}
			if(equal){
				initCoordb = this.generateCoord();
			}else{
				break;
			}
		}
		this.generateGrid(initCoorda);
		this.generateGrid(initCoordb);
		this.state = gridData.getState();
		localStorage.state = JSON.stringify(gridData.getState());
	}

	for(var i=0;i<this.state.length;i++){
		for(var j=0;j<this.state[0].length;j++){
			if(this.state[i][j]!==0){
				this.setGrid({h:i,v:j},this.state[i][j]);
			}
		}
	}

	this.scoreContainer.innerHTML = this.currentScore;
	this.bestContainer.innerHTML = this.bestScore;
};
//重新开始
Grid.prototype.restart = function(){
	var initstate = [
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0]];

	this.currentScore = 0;
	this.state = initstate;
	scoreData.setCurrentScore(this.currentScore);
	gridData.updateState(this.state);
	this.clearGrid();
	var initCoorda = this.generateCoord(),
		initCoordb = this.generateCoord();

	while(true){
		var equal=true;
		for(var k in initCoordb){
			if(initCoorda[k]!==initCoordb[k]){
				equal = false;
			}
		}
		if(equal){
			initCoordb = this.generateCoord();
		}else{
			break;
		}
	}
	this.generateGrid(initCoorda);
	this.generateGrid(initCoordb);
	this.state = gridData.getState();
	localStorage.state = JSON.stringify(gridData.getState());
	localStorage.currentScore = 0;

	for(var i=0;i<this.state.length;i++){
		for(var j=0;j<this.state[0].length;j++){
			if(this.state[i][j]!==0){
				this.setGrid({h:i,v:j},this.state[i][j]);
			}
		}
	}

	this.scoreContainer.innerHTML = this.currentScore;
};
//检查是否成功
Grid.prototype.checkSuccess = function(){
	var success = false,
		state = gridData.getState();
	for(var i=0;i<state.length;i++){
		for(var j=0;j<state[0].length;j++){
			if(state[i][j] === 2048){
				success = true;
				break;
			}
		}
	}
	return success;
};
//检查是否格子已满
Grid.prototype.checkFull=function(){
	var full=true,
		state = gridData.getState();
	for(var i=0;i<state.length;i++){
		for(var j=0;j<state[0].length;j++){
			if(!state[i][j]){
				full = false;
				break;
			}
		}
	}
	return full;
};
//更新分数
Grid.prototype.updateScore=function(score){
	this.currentScore = parseInt(this.currentScore)+parseInt(score);
	scoreData.setCurrentScore(parseInt(this.currentScore));
	this.currentScore = scoreData.getCurrentScore();
	localStorage.currentScore = parseInt(this.currentScore);
	localStorage.state = JSON.stringify(gridData.getState());
	if(parseInt(this.currentScore) > parseInt(this.bestScore)){
		this.bestScore = parseInt(this.currentScore);
		scoreData.setBestScore(parseInt(this.bestScore));
		localStorage.bestScore = parseInt(this.bestScore);
	}
	scoreData.updateScore();
};

//生成一个随机坐标
Grid.prototype.generateCoord = function(){

	var h = Math.floor(Math.random()*4),  //生成0-3的整数
		v = Math.floor(Math.random()*4),
		state = gridData.getState(),
		targetGridState = state[h][v],
	    count = 0;
	while(targetGridState!==0){
//		这样找没有数字的格子，是为了避免多次随机数随意到同一个地方..
		if(count>=16){
			for(var i=0;i<state.length;i++){
				for(var j=0;j<state[0].length;j++){
					if(!state[i][j]){
						h=i;
						v=j;
						break;
					}
				}
			}
			break;
		}else{
			if(count % 2 === 0){
				targetGridState=state[(h+1)%4][v];
				h=(h+1)%4;
			}
			else {
				targetGridState=state[h][(v+1)%4];
				v=(v+1)%4;
			}
		}
		count++;
	}
	return {h:h, v:v};    //h:横 v:纵
};

//生成2或4作为每次新产生的格子中的数
Grid.prototype.generateInitNum = function(){
	var num = Math.floor(Math.random()*10);  //生成0或1
	return num>1?2:4;
};

//根据传入的坐标对象生成新的带有2或4的格子
Grid.prototype.generateGrid = function(coord){
	var initNum = this.generateInitNum();
	this.setGrid(coord,initNum);
//	并写入新状态
	gridData.setState(coord,initNum);
};

//根据传入的坐标对象生成新的带有num的格子
Grid.prototype.setGrid = function(coord,num){
	var newGrid = document.createElement('div'),
		tds = this._trs[coord.h].getElementsByTagName('td'),
		targetGrid = tds[coord.v],
		log = Math.log(num)/Math.log(2),
		blockClass = 'block'+log%5;

//	将新格子加入DOM中
	newGrid.className = '';
	newGrid.className = 'grid '+blockClass;
	newGrid.innerHTML = num;
//	目标格子中如果原来有数字就要清空 再将新数字添加进去
	targetGrid.innerHTML='';
	targetGrid.appendChild(newGrid);
};

//清空格子
Grid.prototype.clearGrid = function(){
	var parent = this,
		state = gridData.getState();

	for(var i=0;i<state.length;i++){
		for(var j=0;j<state[0].length;j++){
			var tds = parent._trs[i].getElementsByTagName('td'),
				targetGrid = tds[j];

			targetGrid.innerHTML='';
		}
	}
};

//向各个方向移动后的状态数组的变化 dir：方向 state：状态数组
Grid.prototype.transState = function(dir,state){
	var score = 0;
	var toLeft=function(state){
//		向左滑动后状态矩阵的状态值
		for(var i = 0; i <= state.length-1; i++){
			var bv = -1,    //起始纵坐标
				j = 0,
				hasNonZeroNum=false;
//			找到这一行中非0的数，相邻且相等的数，左边的数*2，右边置0
//			比如一行中数状态是 [2,0,2,2] 处理完后 [4,0,0,2]
			while(j < state[i].length){
				if(state[i][j]!==0){
					hasNonZeroNum=true;
					if(bv < 0){
						bv = j;
					}else if(state[i][bv]===state[i][j]){
						state[i][bv] = state[i][j]*2;
						state[i][j] = 0;
						score += parseInt(state[i][bv]);
						bv = -1;
					}else{
						bv = j;
					}
				}
				j++;
			}
//			如果找到了非0数，一定需要调整（去0：数组前，数字间；补0：数组后）
			if(hasNonZeroNum){
				var tmpArr = [0,0,0,0];
				for(var m = 0,n = 0; m<=state[i].length-1; m++){
					if(state[i][m]){
						tmpArr[n++] = state[i][m];
					}
				}
				state[i]=tmpArr;
			}
		}
	};
	var toRight=function(state){
//		向右滑动后状态矩阵的状态值
		for(var i = 0; i <= state.length-1; i++){
			var bv = -1,    //起始纵坐标
				j = state[i].length-1,
				hasNonZeroNum=false;
//			找到这一行中非0的数，相邻且相等的数，右边的数*2，左边置0
//			比如一行中数状态是 [2,0,2,2] 处理完后 [2,0,0,4]
			while(j >= 0){
				if(state[i][j]!==0){
					hasNonZeroNum=true;
					if(bv < 0){
						bv = j;
					}else if(state[i][bv]===state[i][j]){
						state[i][bv] = state[i][j]*2;
						state[i][j] = 0;
						score += parseInt(state[i][bv]);
						bv = -1;
					}else{
						bv = j;
					}
				}
				j--;
			}
//			如果找到了非0数，一定需要调整（去0：数组后，数字间；补0：数组间）
			if(hasNonZeroNum){
				var tmpArr = [0,0,0,0];
				for(var m = state[i].length-1,n = state[i].length-1; m>=0; m--){
					if(state[i][m]){
						tmpArr[n--] = state[i][m];
					}
				}
				state[i]=tmpArr;
			}
		}
	};
	var toTop=function(state){
//		向上滑动后状态矩阵的状态值
		for(var j = 0; j < state[0].length; j++){
			var bv = -1,    //起始横坐标
				i = 0,
				hasNonZeroNum=false;
//			找到这一列中非0的数，相邻且相等的数，右边的数*2，左边置0
//			比如一列中数状态是 [2,0,2,2] 处理完后 [4,0,0,2]
			while(i < state.length){
				if(state[i][j]!==0){
					hasNonZeroNum=true;
					if(bv < 0){
						bv = i;
					}else if(state[bv][j]===state[i][j]){
						state[bv][j] = state[i][j]*2;
						state[i][j] = 0;
						score += parseInt(state[bv][j]);
						bv = -1;
					}else{
						bv = i;
					}
				}
				i++;
			}
//			如果找到了非0数，一定需要调整
			if(hasNonZeroNum){
				var tmpArr = [0,0,0,0];
				for(var m = 0,n = 0; m<state.length; m++){
					if(state[m][j]){
						tmpArr[n++] = state[m][j];
					}
				}
				for(var k=0;k<tmpArr.length;k++){
					state[k][j]=tmpArr[k];
				}
			}
		}
	};
	var toBottom=function(state){
//		向下滑动后状态矩阵的状态值
		for(var j = state[0].length-1; j >=0 ; j--){
			var bv = -1,    //起始横坐标
				i = state.length-1,
				hasNonZeroNum=false;
//			找到这一列中非0的数，相邻且相等的数，右边的数*2，左边置0
//			比如一列中数状态是 [2,0,2,2] 处理完后 [2,0,0,4]
			while(i >= 0 ){
				if(state[i][j]!==0){
					hasNonZeroNum=true;
					if(bv < 0){
						bv = i;
					}else if(state[bv][j]===state[i][j]){
						state[bv][j] = state[i][j]*2;
						state[i][j] = 0;
						score += parseInt(state[bv][j]);
						bv = -1;
					}else{
						bv = i;
					}
				}
				i--;
			}
//			如果找到了非0数，一定需要调整
			if(hasNonZeroNum){
				var tmpArr = [0,0,0,0];
				for(var m = state.length-1,n = state.length-1; m>=0; m--){
					if(state[m][j]){
						tmpArr[n--] = state[m][j];
					}
				}
				for(var k=0;k<tmpArr.length;k++){
					state[k][j]=tmpArr[k];
				}
			}
		}
	};
	switch (dir){
		case 'left':
			toLeft(state);
			return score;
		case 'right':
			toRight(state);
			return score;
		case 'up':
			toTop(state);
			return score;
		case 'down':
			toBottom(state);
			return score;
		default :break;
	}
};

//移动格子
Grid.prototype.moveGrid=function(dir,oldState,preState,score){
//	move函数是移动数字格子的函数，包括新数字格子的生成，和动画的完成
//	dir：方向（'lr'==横向 'tb'===纵向）;
//	index:下标（横向即横下标，纵向即纵下标）;
//	src:源下标（横向即纵源下标，纵向即横源下标）；
//	goal：目标下标（横向即纵源下标，纵向即横源下标）
	var parent = this,
		moveCount = 0,
		moveGridCount = 0;
	var move=function(dir,index,src,goal,moveGridCount){
		var $srcGridContent = {},
			winWidth = window.innerWidth,
			gap = 1.6,
			middleSize = 73+gap,
			smallSize = 40+gap,
			bigSize = 98+gap,
			offsetX = 0,
			offsetY = 0,
			preNumInGoalGrid=0,
			coords={},
			size=winWidth>=800?bigSize:winWidth<700?smallSize:middleSize,
			tds = {},
			srcGrid = {},
			srcGridContent = {};

		if(dir ==='lr'){
			tds = parent._trs[index].getElementsByTagName('td');
			srcGrid = tds[src];
			srcGridContent=srcGrid.getElementsByTagName('div');
			$srcGridContent=$(srcGridContent[0]);
			offsetX=(goal-src)*size;
			preNumInGoalGrid=preState[index][goal];
			coords={h : index,v : goal};
		}else if(dir ==='tb'){
			tds = parent._trs[src].getElementsByTagName('td'),
			srcGrid = tds[index];
			srcGridContent=srcGrid.getElementsByTagName('div');
			$srcGridContent=$(srcGridContent[0]);
			offsetY=(goal-src)*size;
			preNumInGoalGrid=preState[goal][index];
			coords={h : goal,v : index};
		}
		parent.animated = true;
		(function(cds,num){
			$srcGridContent.animate({
				                        translate3d: ''+offsetX+'px,'+offsetY+'px,0'
			                        },200,'ease-in',function(){
				parent.setGrid(cds,num);
//              remove掉当前正在进行动画的数字格子
				this.remove();
				moveCount++;
				if(moveCount === moveGridCount){
					gridData.updateState(preState);
					parent.generateGrid(parent.generateCoord());
					oldState = gridData.getState();
					preState = oldState.clone();
					parent.updateScore(score);
				}
				parent.animated = false;
			});
		})(coords,preNumInGoalGrid);
	};
	var toLeft=function(oldState,preState){
		var sameNumMoveFlag = false;
		var compareOldAndPreState = function(event){
//		对比新老状态移动格子合并格子
			for(var i = 0; i <= preState.length-1; i++){
				var jo = 0,    //老状态最小纵下标
					jp = 0;    //新状态最小纵下标
				while(jo<oldState[i].length&&jp<preState[i].length){
					while(!oldState[i][jo]&&jo<oldState[i].length){
						jo++;
					}
					while(!preState[i][jp]&&jp<preState[i].length){
						jp++;
					}
//				jo(oldState下标)超出oldState长度,或preState[i][jp](jp为preState下标)为0,则此行处理完毕。
					if(jo>=oldState[i].length||!preState[i][jp]){
						break;
					}
//				否则当jo!==jp时说明需要oldState在preState中有移动的元素
					else if(jo !== jp){
						event(i,jo,jp);
//					当oldState[i][jo]===preState[i][jp]时说明当前移动完的元素不需要合并
						if(oldState[i][jo]===preState[i][jp]){
							jp++;
							jo++;
						}
//					当oldState[i][jo]!==preState[i][jp]时说明当前移动完的元素需要合并
//                  记录第二次preState[i][jp]/oldState[i][jo]===2的位置
//                  第一次不移动jp，第二次才移动;
						else if(oldState[i][jo]!==preState[i][jp]&&preState[i][jp]/oldState[i][jo]===2){
							if(!sameNumMoveFlag){
								sameNumMoveFlag = true;
								jo++;
							}else{
								sameNumMoveFlag = false;
								jp++;
								jo++;
							}
						}
					}
//				否则当jo===jp&&oldState[i][jo]===preState[i][jp]时说明需要oldState当前的元素不需要移动也不需要被合并
					else if(oldState[i][jo]===preState[i][jp]){
						jp++;
						jo++;
					}
//				否则当jo===jp&&oldState[i][jo]!==preState[i][jp]时说明需要oldState当前的元素需要被合并,
//              此时必然是第一次double所以记录一下下次double直接移动;
					else if(oldState[i][jo]!==preState[i][jp]&&preState[i][jp]/oldState[i][jo]===2){
						if(!sameNumMoveFlag){
							sameNumMoveFlag = true;
							jo++;
						}
					}else{
						jp++;
						jo++;
					}
				}
			}
		};
		compareOldAndPreState(function(){
			moveGridCount++;
		});
		compareOldAndPreState(function(i,jo,jp){
			move('lr',i, jo, jp,moveGridCount);
		});
	};
	var toRight=function(oldState,preState){
		var sameNumMoveFlag = false;
		var compareOldAndPreState = function(event){
//		对比新老状态移动格子合并格子
			for(var i = 0; i <= preState.length-1; i++){
				var jo = oldState[i].length-1, //老状态最大纵下标
					jp = preState[i].length-1; //新状态最大纵下标
				while(jo>=0&&jp>=0){
					while(!oldState[i][jo]&&jo>=0){
						jo--;
					}
					while(!preState[i][jp]&&jp>=0){
						jp--;
					}
//				jo(oldState下标)<0,或preState[i][jp](jp为preState下标)为0,则此行处理完毕。
					if(jo<0||!preState[i][jp]){
						break;
					}
//				否则当jo!==jp时说明需要oldState在preState中有移动的元素
					else if(jo !== jp){
						event(i,jo,jp);
//					当oldState[i][jo]===preState[i][jp]时说明当前移动完的元素不需要合并
						if(oldState[i][jo]===preState[i][jp]){
							jp--;
							jo--;
						}
//					当oldState[i][jo]!==preState[i][jp]时说明当前移动完的元素需要合并
//                  记录第二次preState[i][jp]/oldState[i][jo]===2的位置
//                  第一次不移动jp，第二次才移动;
						else if(oldState[i][jo]!==preState[i][jp]&&preState[i][jp]/oldState[i][jo]===2){
							if(!sameNumMoveFlag){
								sameNumMoveFlag = true;
								jo--;
							}else{
								sameNumMoveFlag = false;
								jp--;
								jo--;
							}
						}
					}
//				否则当jo===jp&&oldState[i][jo]===preState[i][jp]时说明需要oldState当前的元素不需要移动也不需要被合并
					else if(oldState[i][jo]===preState[i][jp]){
						jp--;
						jo--;
					}
//  			否则当jo===jp&&oldState[i][jo]!==preState[i][jp]时说明需要oldState当前的元素需要被合并,
//              此时必然是第一次double所以记录一下下次double直接移动;
					else if(oldState[i][jo]!==preState[i][jp]&&preState[i][jp]/oldState[i][jo]===2){
						if(!sameNumMoveFlag){
							sameNumMoveFlag = true;
							jo--;
						}
					}else{
						jp--;
						jo--;
					}
				}
			}
		};
		compareOldAndPreState(function(){
			moveGridCount++;
		});
		compareOldAndPreState(function(i,jo,jp){
			move('lr',i, jo, jp,moveGridCount);
		});
	};
	var toTop=function(oldState,preState){
		var sameNumMoveFlag=false;
		var compareOldAndPreState = function(event){
//		对比新老状态移动格子合并格子
			for(var j = 0; j < preState[0].length; j++){
				var io = 0,    //老状态最小横下标
					ip = 0;    //新状态最小横下标
				while(ip<preState.length&&io<oldState.length){
					while(io<oldState.length&&!oldState[io][j]){
						io++;
					}
					while(ip<preState.length&&!preState[ip][j]){
						ip++;
					}
//				io(oldState横下标)超出oldState横数,或preState[io][j](io为preState横下标)为0,则此列处理完毕。
					if(io>=oldState.length||!preState[ip][j]){
						break;
					}
//				否则当io !== ip时说明需要oldState在preState中有移动的元素
					else if(io !== ip){
						event(j, io, ip);
//					当oldState[i][jo]===preState[i][jp]时说明当前移动完的元素不需要合并
						if(oldState[io][j]===preState[ip][j]){
							ip++;
							io++;
						}
//					当oldState[io][j]!==preState[ip][j]时说明当前移动完的元素需要合并
//                  记录第二次preState[ip][j]/oldState[io][j]===2的位置
//                  第一次不移动ip，第二次才移动;
						else if(oldState[io][j]!==preState[ip][j]&&preState[ip][j]/oldState[io][j]===2){
							if(!sameNumMoveFlag){
								sameNumMoveFlag = true;
								io++;
							}else{
								sameNumMoveFlag = false;
								ip++;
								io++;
							}
						}
					}
//				否则当io === ip&&oldState[io][j]===preState[ip][j]时说明需要oldState当前的元素不需要移动也不需要被合并
					else if(oldState[io][j]===preState[ip][j]){
						ip++;
						io++;
					}
//  			否则当io === ip&&oldState[io][j]!==preState[ip][j]时说明需要oldState当前的元素需要被合并,
//              此时必然是第一次double所以记录一下下次double直接移动;
					else if(oldState[io][j]!==preState[ip][j]&&preState[ip][j]/oldState[io][j]===2){
						if(!sameNumMoveFlag){
							sameNumMoveFlag = true;
							io++;
						}
					}else{
						ip++;
						io++;
					}
				}
			}
		};
		compareOldAndPreState(function(){
			moveGridCount++;
		});
		compareOldAndPreState(function(j, io, ip){
			move('tb',j, io, ip,moveGridCount);
		});
	};
	var toBottom=function(oldState,preState){
		var sameNumMoveFlag=false;
		var compareOldAndPreState = function(event){
//		对比新老状态移动格子合并格子
			for(var j = 0; j <= preState[0].length-1; j++){
				var io = oldState.length-1, //老状态最大横下标
					ip = preState.length-1; //新状态最大横下标
				while(io>=0&&ip>=0){
					while(io>=0&&!oldState[io][j]){
						io--;
					}
					while(ip>=0&&!preState[ip][j]){
						ip--;
					}
//				io(oldState横下标)<0,或preState[ip][j](ip为preState横下标)为0,则此列处理完毕。
					if(io<0||!preState[ip][j]){
						break;
					}
//				否则当io !== ip时说明需要oldState在preState中有移动的元素
					else if(io !== ip){
						event(j, io, ip);
//					当oldState[i][jo]===preState[i][jp]时说明当前移动完的元素不需要合并
						if(oldState[io][j]===preState[ip][j]){
							ip--;
							io--;
						}
//					当oldState[io][j]!==preState[ip][j]时说明当前移动完的元素需要合并
//                  记录第二次preState[ip][j]/oldState[io][j]===2的位置
//                  第一次不移动ip，第二次才移动;
						else if(oldState[io][j]!==preState[ip][j]&&preState[ip][j]/oldState[io][j]===2){
							if(!sameNumMoveFlag){
								sameNumMoveFlag = true;
								io--;
							}else{
								sameNumMoveFlag = false;
								ip--;
								io--;
							}
						}
//					当oldState[i][jo]!==preState[i][jp]时说明当前移动完的元素需要合并 jo--;
					}
//				否则当jo===jp&&oldState[i][jo]===preState[i][jp]时说明需要oldState当前的元素不需要移动也不需要被合并
					else if(oldState[io][j]===preState[ip][j]){
						ip--;
						io--;
					}
//  			否则当io === ip&&oldState[io][j]!==preState[ip][j]时说明需要oldState当前的元素需要被合并,
//              此时必然是第一次double所以记录一下下次double直接移动;
					else if(oldState[io][j]!==preState[ip][j]&&preState[ip][j]/oldState[io][j]===2){
						if(!sameNumMoveFlag){
							sameNumMoveFlag = true;
							io--;
						}
					}else{
						ip--;
						io--;
					}
				}
			}
		};
		compareOldAndPreState(function(){
			moveGridCount++;
		});
		compareOldAndPreState(function(j, io, ip){
			move('tb',j, io, ip,moveGridCount);
		});
	};
	switch (dir){
		case 'left':
			toLeft(oldState,preState);
			break;
		case 'right':
			toRight(oldState,preState);
			break;
		case 'up':
			toTop(oldState,preState);
			break;
		case 'down':
			toBottom(oldState,preState);
			break;
		default :break;
	}
};
//绑定事件 滑动或按键
Grid.prototype.bindEvent = function(){

	var $body = $('body'),
		gameContainer = document.getElementById("game-container"),
		$gameContainer = $(gameContainer),
		oldState = gridData.getState(),
		preState = oldState.clone(),
		parent = this,
		mouseOffsetX = 0,
		mouseOffsetY = 0;

	var updateState = function(){
		oldState=gridData.getState();
		preState=oldState.clone();
	};

	var moveTo = function(dir){
		var gameoverFlag = false;
		if(!parent.animated){
			updateState();
			var score = parent.transState(dir,preState);
			if(parent.checkSuccess()){
				pause.win(parent);
			}else if(parent.checkFull()&&compare(oldState,preState)){
				gameoverFlag = true;
			}

			if(gameoverFlag){
				var dirArr = ['left','right','up','down'],
					tmpState = preState.clone();
				for(var i = 0;i < dirArr.length; i++){
					parent.transState(dirArr[i],tmpState);
					if(!compare(oldState,tmpState)){
						gameoverFlag = false;
						break;
					}
				}
			}
			if(gameoverFlag){
				pause.gameover(parent);
			}
			parent.moveGrid(dir,oldState,preState,score);
		}
	};
//	移动设备 手指滑动 控制方向
	$gameContainer.on('touchstart',function(event){
		event.preventDefault();
	}).on('touchmove',function(event){
        event.preventDefault();
    }).on('swipeLeft',function(){
		moveTo('left');
	}).on('swipeRight',function(){
        moveTo('right');
    }).on('swipeUp',function(){
        moveTo('up');
    }).on('swipeDown',function(){
        moveTo('down');
    });
//	PC 鼠标拖动 控制方向
	$gameContainer.on('mousedown',function(e){
		var e = e || window.event;
		e.preventDefault();
		mouseOffsetX = e.clientX;
		mouseOffsetY = e.clientY;
	}).on('mousemove',function(e){
        var e = e || window.event;
        e.preventDefault();
    }).on('mouseup',function(e){
        var e = e || window.event;
        e.preventDefault();
		var offsetX = e.clientX - mouseOffsetX,
			offsetY = e.clientY - mouseOffsetY;
		if(Math.abs(offsetX) < 60 && Math.abs(offsetY) < 60){
			return;
		}else if(Math.abs(offsetX) > Math.abs(offsetY)){
			if(offsetX < 0){
				moveTo('left');
			}
			else if(offsetX > 0){
				moveTo('right');
			}
		}else if(Math.abs(offsetX) < Math.abs(offsetY)){
			if(offsetY < 0){
				moveTo('up');
			}
			else if(offsetY > 0){
				moveTo('down');
			}
		}
    });
//	PC 方向键按下 控制方向
	$(document).keydown(function(event){
		var k = event.keyCode;
		switch (k){
//			按 方向键左
			case 37:
				moveTo('left');
				break;
//			按 方向键右
			case 39:
				moveTo('right');
				break;
//			按 方向键下
			case 40:
				moveTo('down');
				break;
//			按 方向键上
			case 38:
				moveTo('up');
				break;
		}
	});
	$('.restart').on('click',function(){
		parent.restart();
	});
};
Grid.prototype.unbindEvent = function(){

	var $body = $('body'),
		$gameContainer = $(gameContainer);

	$gameContainer.unbind('swipeLeft').unbind('swipeRight').unbind('swipeUp').unbind('swipeDown');
	$(document).unbind('keydown');
};