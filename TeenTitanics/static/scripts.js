//initialization of base variables
var canvas =document.getElementById("canvas");
var ctx=canvas.getContext("2d");
/*var pre_canvas=document.createElement('canvas');
pre_canvas.width=canvas.width; //I'll pre-render later
pre_canvas.height=canvas.height;
var pre_ctx=pre_canvas.getContext("2d");*/
//image processing
var wall = new Image();
wall.src="../static/wall.png";
var wallV=1;
var brick = new Image();
brick.src="../static/brick.png";
var brickV=2;
var bomb = new Image();
bomb.src="../static/bomb.png";
var bombV=3;
var explosion = new Image();
explosion.src="../static/explosion4.png";
var explosionV=4;
var empty=0;
function Pokemon(name,speed,startX,startY){
	this.name=name;
	this.hp=15;
	this.speed=speed;
	this.img = new Image();
	this.img.src="../static/"+name+".png";
	this.maxBomb=3;
	this.xCor=startX;
	this.yCor=startY;
	this.tileX=(startX/50)|0;
	this.tileY=(startY/50)|0;
}
//Map tile amount
var mapHeight=(canvas.height/50)|0;
var mapWidth=(canvas.width/50)|0;
//Creates empty array
var mapArr= new Array(mapHeight).fill(empty);
for(var i=0;i<mapWidth;i++){
	mapArr[i]=new Array(mapHeight).fill(empty);//decimal pipe is cool
}
//var pkmn= new Pokemon("squirtle",1); //1 player
var pkmn0=new Pokemon(document.getElementById("pokemon").value,1,50,50); //2 players now
var pkmn1=new Pokemon("pikachu",1,950,450);
//pkmn.img.onload = function (){
window.onload=function(){
	renderBase(0,0,canvas.width,canvas.height);
	createBoard();
	updatePkmn();
};
function updatePkmn(){
	//ctx.drawImage(pkmn.img,xCor,yCor,50,50); 1 player
	ctx.drawImage(pkmn0.img,pkmn0.xCor,pkmn0.yCor,50,50);//2 players
	ctx.drawImage(pkmn1.img,pkmn1.xCor,pkmn1.yCor,50,50);
	document.getElementById("p1hp").innerHTML="HP: "+pkmn0.hp;
	document.getElementById("p2hp").innerHTML="HP: "+pkmn1.hp;
	document.getElementById("p1bomb").innerHTML="Bombs Left:" +pkmn0.maxBomb;
	document.getElementById("p2bomb").innerHTML="Bombs Left:" +pkmn1.maxBomb;
	document.getElementById("p1speed").innerHTML="Speed:" +pkmn0.speed;
	document.getElementById("p2speed").innerHTML="Speed:" +pkmn1.speed;
}
function createBoard(){
	var row;
	var col;
	for(row =1;row<mapWidth-1;row++){
		for(col=1;col<mapHeight-1;col++){
			let chance = Math.random()*2|0;
			if(!chance){
			ctx.drawImage(brick,row*50,col*50,50,50);
			mapArr[row][col]=brickV;
			}
		}
	}
	//Shave off the corners
	renderBase(0,0,150,150);
	mapArr[1][1]=empty;
	mapArr[1][2]=empty;
	mapArr[2][1]=empty;
	renderBase(canvas.width-150,0,150,150);
	mapArr[mapWidth-2][1]=empty;
	mapArr[mapWidth-2][2]=empty;
	mapArr[mapWidth-3][1]=empty;
	renderBase(0,canvas.height-150,150,150);
	mapArr[1][mapHeight-2]=empty;
	mapArr[1][mapHeight-3]=empty;
	mapArr[2][mapHeight-2]=empty;
	renderBase(canvas.width-150,canvas.height-150,150,150);
	mapArr[mapWidth-2][mapHeight-2]=empty;
	mapArr[mapWidth-2][mapHeight-3]=empty;
	mapArr[mapWidth-3][mapHeight-2]=empty;
	for(row =0;row<mapWidth;row++){
		for(col=0;col<mapHeight;col++){
			if(row==0 || col ==0 || row==mapWidth-1 || col==mapHeight-1 ||(row %2==0 && col%2==0)){
			ctx.drawImage(wall,row*50,col*50,50,50);
			mapArr[row][col]=wallV;
			}
		}
	}
}
function renderBase(startX,startY,width,height){
	ctx.fillStyle = "green";
	ctx.fillRect(startX, startY, width, height);
}
function renderChar(){
	//ctx.drawImage(pkmn.img, xCor, yCor,50,50); 1 player
	if(pkmn0.hp){
	ctx.drawImage(pkmn0.img,pkmn0.xCor,pkmn0.yCor,50,50);//2 player
	}
	if(pkmn1.hp){
	ctx.drawImage(pkmn1.img,pkmn1.xCor,pkmn1.yCor,50,50);
	}
}
function renderBoard(){
	renderBase(0,0,canvas.height,canvas.width);
	for(var row =0;row<mapWidth;row++){
		for(var col=0;col<mapHeight;col++){
			switch(mapArr[row][col]){
				case 0:
					renderBase(row*50,col*50,50,50);
					break;
				case 1:
					ctx.drawImage(wall,row*50,col*50,50,50);
					break;
				case 2:
					ctx.drawImage(brick,row*50,col*50,50,50);
					break;
			}
		}
	}
}
var validKeysP0 = ["w","a","s","d"];//for player one
var validKeysP1 = ["ArrowUp","ArrowLeft","ArrowDown","ArrowRight"];//for player two
var last_clicked0 = 0;//player 1 buffer
var last_clicked1 = 0;//player 2 buffer
var last_used0=0;//bomb reload
var last_used1=0;
window.addEventListener("keydown",function(e){
	var keypress= e.key;
	if(pkmn0.hp&&validKeysP0.indexOf(keypress)>-1){
		if(Date.now()-last_clicked0 <500)return;
		last_clicked0 = Date.now();
		movement(keypress,50,validKeysP0,pkmn0);
	}
	else if(pkmn1.hp&&validKeysP1.indexOf(keypress)>-1){
		if(Date.now()-last_clicked1 <500)return;
		last_clicked1 = Date.now();
		movement(keypress,50,validKeysP1,pkmn1);
	}
	else if(pkmn0.hp&&keypress==" "){
		if(pkmn0.maxBomb){
			pkmn0.maxBomb--;
			action(1,pkmn0.xCor,pkmn0.yCor,pkmn0);
		}
	}
	else if(pkmn1.hp&&keypress=="0"){
		if(pkmn1.maxBomb){
			pkmn1.maxBomb--;
			action(1,pkmn1.xCor,pkmn1.yCor,pkmn1);
		}
	}
	if(pkmn0.maxBomb<3){
		if(Date.now()-last_used0<5000)return;
		last_used0=Date.now();
		pkmn0.maxBomb++;
	}
	if(pkmn1.maxBomb<3){
		if(Date.now()-last_used1<5000)return;
		last_used1=Date.now();
		pkmn1.maxBomb++;
	}
});
function loseHp(locX,locY,pkmn){
	if((locX ==pkmn.tileX) &&(locY==pkmn.tileY)){
		if(pkmn.hp){
		pkmn.hp-=5;
		}
		return true;
	}
}
function action(time,xLoc,yLoc,pkmn){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	renderBoard();
	if(time<4){
	ctx.drawImage(bomb,xLoc+25-(25*time/3),yLoc+25-(25*time/3),15*time,15*time);
	}
	else if(time==4){//explosion logic
	var northCon=false;
	var southCon=false;
	var eastCon=false;
	var westCon=false;
	var dealtDmg=false;
	var xTile=(xLoc/50)|0;//yes i have good naming conventions
	var yTile=(yLoc/50)|0;
	ctx.drawImage(explosion,xLoc,yLoc,50,50);
	if(!dealtDmg){dealtDmg=loseHp(xTile,yTile,pkmn);}
	if(mapArr[xTile-1][yTile]==empty){
		ctx.drawImage(explosion,xLoc-50,yLoc,50,50);
		westCon=true;
		if(!dealtDmg){dealtDmg=loseHp(xTile-1,yTile,pkmn);}
	}
	if(mapArr[xTile-1][yTile]==brickV){
		renderBase(xLoc-50,yLoc,50,50);
		mapArr[xTile-1][yTile]=empty;
	}
	if(westCon&&mapArr[xTile-2][yTile]==empty){
		ctx.drawImage(explosion,xLoc-100,yLoc,50,50);
		if(!dealtDmg){dealtDmg=loseHp(xTile-2,yTile,pkmn);}
	}
	if(westCon&&mapArr[xTile-2][yTile]==brickV){
		renderBase(xLoc-100,yLoc,50,50);
		mapArr[xTile-2][yTile]=empty;
	}
	if(mapArr[xTile+1][yTile]==empty){
		ctx.drawImage(explosion,xLoc+50,yLoc,50,50);
		eastCon=true;
		if(!dealtDmg){dealtDmg=loseHp(xTile+1,yTile,pkmn);}
	}
	if(mapArr[xTile+1][yTile]==brickV){
		renderBase(xLoc+50,yLoc,50,50);
		mapArr[xTile+1][yTile]=empty;
	}
	if(eastCon&&mapArr[xTile+2][yTile]!=wallV){
		ctx.drawImage(explosion,xLoc+100,yLoc,50,50);
		if(!dealtDmg){dealtDmg=loseHp(xTile+2,yTile,pkmn);}
	}
	if(eastCon&&mapArr[xTile+2][yTile]==brickV){
		renderBase(xLoc+100,yLoc,50,50);
		mapArr[xTile+2][yTile]=empty;
	}
	if(mapArr[xTile][yTile-1]==empty){
		ctx.drawImage(explosion,xLoc,yLoc-50,50,50);
		southCon=true;
		if(!dealtDmg){dealtDmg=loseHp(xTile,yTile-1,pkmn);}
	}
	if(mapArr[xTile][yTile-1]==brickV){
		renderBase(xLoc,yLoc-50,50,50);
		mapArr[xTile][yTile-1]=empty;
	}
	if(southCon&&mapArr[xTile][yTile-2]==empty){
		ctx.drawImage(explosion,xLoc,yLoc-100,50,50);
		if(!dealtDmg){dealtDmg=loseHp(xTile,yTile-2,pkmn);}
	}
	if(southCon&&mapArr[xTile][yTile-2]==brickV){
		renderBase(xLoc,yLoc-100,50,50);
		mapArr[xTile][yTile-2]=empty;
	}
	if(mapArr[xTile][yTile+1]==empty){
		ctx.drawImage(explosion,xLoc,yLoc+50,50,50);
		northCon=true;
		if(!dealtDmg){dealtDmg=loseHp(xTile,yTile+1,pkmn);}
	}
	if(mapArr[xTile][yTile+1]==brickV){
		renderBase(xLoc,yLoc+50,50,50);
		mapArr[xTile][yTile+1]=empty;
	}
	if(northCon&&mapArr[xTile][yTile+2]==empty){
		ctx.drawImage(explosion,xLoc,yLoc+100,50,50);
		if(!dealtDmg){dealtDmg=loseHp(xTile,yTile+2,pkmn);}
	}
	if(northCon&&mapArr[xTile][yTile+2]==brickV){
		renderBase(xLoc,yLoc+100,50,50);
		mapArr[xTile][yTile+2]=empty;
	}
	}
	renderChar();
	//var startTime=new Date();
	if (time<5){
	  time++;
	  setTimeout(function(){action(time,xLoc,yLoc,pkmn);},1000);
  }
}
//var reached =false;
function movement(direction,step,array,pkmn){
	while(step){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	renderBoard();
	switch(direction){
		case array[0]:
			if(!mapArr[pkmn.tileX][pkmn.tileY-1]){
				pkmn.yCor -= pkmn.speed;
			}
		break;
		case array[1]:
			if(!mapArr[pkmn.tileX-1][pkmn.tileY]){
				pkmn.xCor -= pkmn.speed;
			}
		break;
		case array[2]:
			if(!mapArr[pkmn.tileX][pkmn.tileY+1]){
				pkmn.yCor += pkmn.speed;
			}
		break;
		case array[3]:
			if(!mapArr[pkmn.tileX+1][pkmn.tileY]){
				pkmn.xCor += pkmn.speed;
			}
		break;
	}
	renderChar();// draw image at current position
	step-=pkmn.speed;
	}
}
  /*if (step){
	  step-=pkmn.speed; //animations get stuck halfway :/
	  requestAnimationFrame(function(){movement(direction,step);});
  }
}*/
console.log(mapArr);
setInterval(function(){
	document.getElementById("p1hp").innerHTML="HP: "+pkmn0.hp;
	document.getElementById("p2hp").innerHTML="HP: "+pkmn1.hp;
	document.getElementById("p1bomb").innerHTML="Bombs Left:" +pkmn0.maxBomb;
	document.getElementById("p2bomb").innerHTML="Bombs Left:" +pkmn1.maxBomb;
		document.getElementById("p1speed").innerHTML="Speed:" +pkmn0.speed;
	document.getElementById("p2speed").innerHTML="Speed:" +pkmn1.speed;
	
	if(pkmn0.hp && pkmn1.hp){
		//document.getElementById("stat").innerHTML="Player 1 HP: "+pkmn0.hp+" Bombs: "+pkmn0.maxBomb+"<br>Player 2 HP: "+pkmn1.hp+" Bombs: "+pkmn1.maxBomb;
		}
		else{
			if(pkmn0.hp>pkmn1.hp){
				document.getElementById("stat").innerHTML="Player 2 wins!<br>";
				document.getElementById("win").value = "2";
				console.log('DONE')
				}else{
					document.getElementById("stat").innerHTML="Player 1 wins!<br>";
					document.getElementById("win").value = "1";
				}}pkmn0.tileX=(pkmn0.xCor/50)|0;pkmn1.tileX=(pkmn1.xCor/50)|0;
pkmn0.tileY=(pkmn0.yCor/50)|0;pkmn1.tileY=(pkmn1.yCor/50)|0;},500);
