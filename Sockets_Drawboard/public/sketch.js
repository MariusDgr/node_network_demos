var socket;

function setup() {
  createCanvas(500, 500);
  background(51);

  socket = io.connect('http://localhost:3000');
  socket.on('mouse', newDrawing);
}

function newDrawing(data){
  noStroke();
  fill(255, 0, 100);
  ellipse(data.x, data.y, 10, 10);
}

function mouseDragged(){
  console.log('Sending ' + mouseX + ', ' + mouseY);

  var data = {
    x: mouseX,
    y: mouseY
  };
  socket.emit('mouse', data);

  noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 10, 10);
}

function draw() {

}
