//initialization of base variables
var canvas =document.getElementById("canvas");
var ctx=canvas.getContext("2d");
/*var pre_canvas=document.createElement('canvas');
pre_canvas.width=canvas.width; //I'll pre-render later
pre_canvas.height=canvas.height;
var pre_ctx=pre_canvas.getContext("2d");*/
//starting position
var xCor=50;
var yCor=50;
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
function Pokemon(name,speed){
	this.name=name;
	this.hp=50;
	this.speed=speed;
	this.img = new Image();
	this.img.src="../static/"+name+".png";
	this.maxBomb=2;
}
var tileX=(xCor/50)|0;
var tileY=(yCor/50)|0;
//Map tile amount
var mapHeight=(canvas.height/50)|0;
var mapWidth=(canvas.width/50)|0;
//Creates empty array
var mapArr= new Array(mapHeight).fill(empty);
for(var i=0;i<mapWidth;i++){
	mapArr[i]=new Array(mapHeight).fill(empty);//decimal pipe is cool
}
var pkmn= new Pokemon("squirtle",1);
pkmn.img.onload = function (){
	renderBase(0,0,canvas.width,canvas.height);
	createBoard();
	updatePkmn();
};
function updatePkmn(){
	ctx.drawImage(pkmn.img,xCor,yCor,50,50);
	document.getElementById("stat").innerHTML="HP:"+pkmn.hp;
}
function createBoard(){
	var row;
	var col;
	for(row =1;row<mapWidth-1;row++){
		for(col=1;col<mapHeight-1;col++){
			let chance = Math.random()*8|0;
			if(chance){
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
	ctx.drawImage(pkmn.img, xCor, yCor,50,50);
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
var validKeys = ["w","a","s","d"];
var last_clicked = 0;
window.addEventListener("keydown",function(e){
	var keypress= e.key;
	if(validKeys.indexOf(keypress)>-1){
		if(Date.now()-last_clicked <500)return;
		last_clicked = Date.now();
		movement(keypress,50);
	}
	else if(keypress==" "){
		action(1,xCor,yCor);
	}
});
function loseHp(locX,locY){
	if((locX ==tileX) &&(locY==tileY)){
		pkmn.hp-=5;
		return true;
	}
}
function action(time,xLoc,yLoc){
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
	if(mapArr[xTile-1][yTile]==empty){
		ctx.drawImage(explosion,xLoc-50,yLoc,50,50);
		westCon=true;
		if(!dealtDmg){dealtDmg=loseHp(xTile-1,yTile);}
	}
	if(mapArr[xTile-1][yTile]==brickV){
		renderBase(xLoc-50,yLoc,50,50);
		mapArr[xTile-1][yTile]=empty;
	}
	if(westCon&&mapArr[xTile-2][yTile]==empty){
		ctx.drawImage(explosion,xLoc-100,yLoc,50,50);
		if(!dealtDmg){dealtDmg=loseHp(xTile-2,yTile);}
	}
	if(westCon&&mapArr[xTile-2][yTile]==brickV){
		renderBase(xLoc-100,yLoc,50,50);
		mapArr[xTile-2][yTile]=empty;
	}
	if(mapArr[xTile+1][yTile]==empty){
		ctx.drawImage(explosion,xLoc+50,yLoc,50,50);
		eastCon=true;
		if(!dealtDmg){dealtDmg=loseHp(xTile+1,yTile);}
	}
	if(mapArr[xTile+1][yTile]==brickV){
		renderBase(xLoc+50,yLoc,50,50);
		mapArr[xTile+1][yTile]=empty;
	}
	if(eastCon&&mapArr[xTile+2][yTile]!=wallV){
		ctx.drawImage(explosion,xLoc+100,yLoc,50,50);
		if(!dealtDmg){dealtDmg=loseHp(xTile+2,yTile);}
	}
	if(eastCon&&mapArr[xTile+2][yTile]==brickV){
		renderBase(xLoc+100,yLoc,50,50);
		mapArr[xTile+2][yTile]=empty;
	}
	if(mapArr[xTile][yTile-1]==empty){
		ctx.drawImage(explosion,xLoc,yLoc-50,50,50);
		southCon=true;
		if(!dealtDmg){dealtDmg=loseHp(xTile,yTile-1);}
	}
	if(mapArr[xTile][yTile-1]==brickV){
		renderBase(xLoc,yLoc-50,50,50);
		mapArr[xTile][yTile-1]=empty;
	}
	if(southCon&&mapArr[xTile][yTile-2]==empty){	
		ctx.drawImage(explosion,xLoc,yLoc-100,50,50);
		if(!dealtDmg){dealtDmg=loseHp(xTile,yTile-2);}
	}
	if(southCon&&mapArr[xTile][yTile-2]==brickV){
		renderBase(xLoc,yLoc-100,50,50);
		mapArr[xTile][yTile-2]=empty;
	}
	if(mapArr[xTile][yTile+1]==empty){	
		ctx.drawImage(explosion,xLoc,yLoc+50,50,50);
		northCon=true;
		if(!dealtDmg){dealtDmg=loseHp(xTile,yTile+1);}
	}
	if(mapArr[xTile][yTile+1]==brickV){
		renderBase(xLoc,yLoc+50,50,50);
		mapArr[xTile][yTile+1]=empty;
	}	
	if(northCon&&mapArr[xTile][yTile+2]==empty){
		ctx.drawImage(explosion,xLoc,yLoc+100,50,50);
		if(!dealtDmg){dealtDmg=loseHp(xTile,yTile+2);}
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
	  setTimeout(function(){action(time,xLoc,yLoc);},1000);
  }
}
//var reached =false;
function movement(direction,step){
	while(step){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	renderBoard();
	switch(direction){
		case "w":
			if(!mapArr[tileX][tileY-1]){
				yCor -= pkmn.speed;
			}
		break;
		case "a":
			if(!mapArr[tileX-1][tileY]){
				xCor -= pkmn.speed;
			}
		break;
		case "s":
			if(!mapArr[tileX][tileY+1]){
				yCor += pkmn.speed;
			}
		break;
		case "d":
			if(!mapArr[tileX+1][tileY]){
				xCor += pkmn.speed;
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
setInterval(function(){document.getElementById("stat").innerHTML="HP:"+pkmn.hp;tileX=(xCor/50)|0;
tileY=(yCor/50)|0;},500);