//index.js
var startX = 0, startY=0;
var moveX = 0, moveY = 0;
var lengthX = 0, lengthY = 0;
var snakeObject = {
  color:"red",
  x:0,y:0,
  w:20,h:20
};

var direction = "right";
var snakeMoveDirecion = "right";
var frameNum = 0;

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

    function animate(){
      frameNum++;
      if (frameNum % 20 == 0) {
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

      context.setFillStyle(snakeObject.color);
      context.beginPath();
      context.rect(snakeObject.x, snakeObject.y, snakeObject.w, snakeObject.h);
      context.closePath();
      context.fill();

      wx.drawCanvas({
        canvasId:"snakeVanvas",
        actions: context.getActions()
      });
      
      requestAnimationFrame(animate);
    }
    animate();  
  },
  onLoad: function () {
        
  }
})
