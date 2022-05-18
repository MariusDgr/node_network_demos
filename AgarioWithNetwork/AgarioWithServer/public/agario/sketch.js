var socket;
var deathFlag=false;
var blob;
var blobsIds = [];
var blobsData = [];
var food = [];
var zoom = 1;
var id;

function setup() {
	createCanvas(600, 600);

	//Start socket connection
  socket = io.connect('http://localhost:3000');

	blob = new Blob(random(width), random(height), 40);
	var data = {
		x: blob.pos.x,
		y: blob.pos.y,
		r: blob.r
	};
	socket.emit('start', data);
	blobsIds.push(socket.id);

	socket.on('heartbeat',
		function(data){
			//console.log(data);
			blobsData = data;
			for(var i = blobsData.length - 1; i >= 0; i--){
				blobsIds = blobsData[i].id;
			}
		}
	);

	socket.on('heartbeatfood',
		function(data){
			//console.log(data);
			food = data;
		}
	);

	socket.on('you_died',
		function(data){
			console.log("I died");
			deathFlag = true;
		}
	);
}

function sleep (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function draw() {
	// Check if I still am in the game
	if(deathFlag == true){
		sleep(1000).then(() => {
			background(0);
			noStroke();
			fill(255);
			textAlign(CENTER);
			text('Refresh to play agian', width/2, height/2);
		});
		
	}else{

	background(0);
	translate(width/2, height/2);
	var newzoom = 35 / blob.r;
	zoom = lerp(zoom, newzoom, 0.1);
	scale(zoom);
	translate(-blob.pos.x, -blob.pos.y);
	for(var i = blobsData.length - 1; i >= 0; i--){
		if(blobsData[i].id == socket.id){
			blob.r = blobsData[i].r;
		}
	}
	
	blob.show();
	blob.update();
	blob.constrain();
	
	var data = {
		x: blob.pos.x,
		y: blob.pos.y,
	};
	socket.emit('update', data);

	for(var i = blobsData.length - 1; i >= 0; i--){
		if(blobsData[i].id != socket.id){
			fill(0, 0, 255);
			blob.bubbly_display(blobsData[i].x, blobsData[i].y, blobsData[i].r, i+blob.ctr, color('rgb(0,0,255)'));

			fill(255);
			textAlign(CENTER);
			textSize(12);
			text(blobsData[i].id, blobsData[i].x, blobsData[i].y + blobsData[i].r*1.2);
		}
	}
	for(var i = food.length - 1; i >= 0; i--){
		fill(237, 26, 26, 200);
		ellipse(food[i].x, food[i].y, food[i].r*2, food[i].r*2);

	}
}
}
