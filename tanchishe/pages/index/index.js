//index.js
var startX = 0, startY=0;
var moveX = 0, moveY = 0;
var lengthX = 0, lengthY = 0;
var snakeObject = {
  color:"red",
  x:0,y:0,
  w:20,h:20
};

var snakeBody = [];
var foods = [];
var windowW = 0,windowH = 0;

var direction = "right";
var snakeMoveDirecion = "right";
var frameNum = 0;
var collideBol = true;

Page({
  data: {

  },
  snakeTouchStart: function (e) {
    startX = e.touches[0].x;
    startY = e.touches[0].y;
  },
  snakeTouchMove: function (e) {
    moveX = e.touches[0].x;
    moveY = e.touches[0].y;
    lengthX = moveX - startX;
    lengthY = moveY - startY;

    if (Math.abs(lengthX) > Math.abs(lengthY) && lengthX > 0){
      direction = "right";
    } else if (Math.abs(lengthX) > Math.abs(lengthY) && lengthX < 0) {
      direction = "left";
    } else if (Math.abs(lengthX) < Math.abs(lengthY) && lengthY > 0) {
      direction = "down";
    } else if (Math.abs(lengthX) < Math.abs(lengthY) && lengthY < 0) {
      direction = "up";
    }
  },
  snakeTouchEnd: function (e) {
    snakeMoveDirecion = direction;
  },

  onReady: function(){
    var context = wx.createCanvasContext();

    function drawSnake(snakeObject) {
      context.setFillStyle(snakeObject.color);
      context.beginPath();
      context.rect(snakeObject.x, snakeObject.y, snakeObject.w, snakeObject.h);
      context.closePath();
      context.fill();
    }
//碰撞函数
    function  collide(obj1,obj2){
      var l1= obj1.x;
      var r1 = l1+obj1.w;
      var t1 = obj1.y;
      var b1 = t1+obj1.h;

      var l2 = obj2.x;
      var r2 = l2 + obj2.w;
      var t2 = obj2.y;
      var b2 = t2+obj2.h;
      if(r1>l2 && l1<r2 && b1>t2 && t1<b2){
            return true;
      }else{
            return false;
      }
    }

    function animate(){
      frameNum++;
      if (frameNum % 20 == 0) {
        snakeBody.push({
          color: "green",
          x: snakeObject.x, y: snakeObject.y,
          w: 20, h: 20
        });
        if (snakeBody.length > 2) {
          if (collideBol){
            snakeBody.shift();
          }else{
            collideBol = true;
          }
         
        }
        switch (snakeMoveDirecion) {
          case 'right':
            snakeObject.x += 20;
            break;
          case 'left':
            snakeObject.x -= 20;
            break;
          case 'down':
            snakeObject.y += 20;
            break;
          case 'up':
            snakeObject.y -= 20;
            break;
        }
      }

      drawSnake(snakeObject);

      for(var i=0;i<snakeBody.length;i++){
        drawSnake(snakeBody[i]);
      }
      for (var i = 0; i < foods.length; i++) {
        drawSnake(foods[i]);
        if (collide(snakeObject, foods[i])){
          console.info("撞上了");
          collideBol = false;
          foods[i].reset();
        }
      }

      wx.drawCanvas({
        canvasId:"snakeVanvas",
        actions: context.getActions()
      });
      
      requestAnimationFrame(animate);
    }
    function random(min, max){
      return parseInt(Math.random() * (max - min)) + min;
    }
    function Food(){
      this.x = random(0,windowW);
      this.y = random(0, windowH);
      this.w = 15;
      this.h = 15;
      this.color = "rgb(" + random(0,255) + "," + random(0,255) + ","+ random(0,255) +   ")";

      this.reset = function(){
        this.x = random(0, windowW);
        this.y = random(0, windowH);
        this.color = "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")";
      }

    }
     wx.getSystemInfo({
      success: function (res) {
        windowW = res.windowWidth;
        windowH = res.windowHeight;

        for(var i=0;i<1;i++){
            var foodObj = new Food();
            foods.push(foodObj);
        }
        animate();
      }
    })
     
  },
  onLoad: function () {
        
  }
})
