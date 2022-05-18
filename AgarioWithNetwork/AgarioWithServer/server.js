
var blobs = [];
var food = [];

function Blob(id, x, y, r){
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
}

function Food(x, y, r){
  this.x = x;
  this.y = y;
  this.r = r;
}

var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("Agario server running");

var socket = require('socket.io');
var io = socket(server);

setInterval(heartbeat, 3);
function heartbeat (){
  io.sockets.emit('heartbeat', blobs);
}

setInterval(heartbeatfood, 3);
function heartbeatfood (){
for(var j = blobs.length - 1; j >= 0; j--){
  for(var i = food.length - 1; i >= 0; i--){
    var d = Math.sqrt(((blobs[j].x - food[i].x)*(blobs[j].x - food[i].x))+((blobs[j].y - food[i].y)*(blobs[j].y - food[i].y)));
      if(d < blobs[j].r + food[i].r){
        var sum = 3.14 * blobs[j].r * blobs[j].r + 3.14 * food[i].r * food[i].r;
        blobs[j].r = Math.sqrt(sum / 3.14);
        food.splice(i, 1);
        io.sockets.emit('heartbeatfood', food);
      }
    }

    // Decide which blob eats the other one
    for(var k = blobs.length - 1; k >= 0; k--){
      if(i != j){
        var d = Math.sqrt(((blobs[j].x - blobs[k].x)*(blobs[j].x - blobs[k].x))+((blobs[j].y - blobs[k].y)*(blobs[j].y - blobs[k].y)));
        if(d < blobs[j].r + blobs[k].r){
          var sum = 3.14 * blobs[j].r * blobs[j].r + 3.14 * blobs[k].r * blobs[k].r;
          if(blobs[j].r > blobs[k].r){
            blobs[j].r = Math.sqrt(sum / 3.14);

            io.to(blobs[k].id).emit("you_died");
            console.log('Died: ' + blobs[k].id);
            blobs.splice(k, 1);
          } else if (blobs[j].r < blobs[k].r){
            blobs[k].r = Math.sqrt(sum / 3.14);

            io.to(blobs[j].id).emit("you_died");
            console.log('Died: ' + blobs[j].id);
            blobs.splice(j, 1);
          }
          io.sockets.emit('heartbeat', blobs);
        }
    }
  }

    io.sockets.emit('heartbeatfood', food);
    for(var i = food.length; i < 100; i++){
      var x = Math.random(-600, 600)*2000;
      var y = Math.random(-600, 600)*2000;
      food[i] = new Food(x, y, 16);
    }
  }
 }



io.sockets.on('connection', newConnection);

function newConnection(socket){
  console.log('new connection: ' + socket.id);

  socket.on('start',
    function(data){
      // console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
      var blob = new Blob(socket.id, Math.random(1000), Math.random(1000), data.r);
      blobs.push(blob);

  }
);
  socket.on('update',
    function(data){
      //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);

      for(var i = 0; i < blobs.length; i++){
        if(socket.id == blobs[i].id){
          blobs[i].x = data.x;
          blobs[i].y = data.y;
        }
      }
    }
  );

  socket.on('disconnect', function() {
      console.log('disconnected: ' + socket.id);

      for(var k = blobs.length - 1; k >= 0; k--){
        if(socket.id == blobs[k].id){
          blobs.splice(k, 1);
        }
      }
   });

   
}
