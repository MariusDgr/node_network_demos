function Blob(x, y, r){
  this.pos = createVector(x, y);
  this.r = r;  //radius
  this.vel = createVector(0, 0);
  this.ctr = random(1000);

  this.show = function(){
    // This shows a circle
    // fill(255);
    // ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);

    // This shows a blobby circle
    fill(255);
    push();
    translate(this.pos.x, this.pos.y);
    beginShape();
    for (var a = 0; a < TWO_PI; a += PI / 200) {
      var cos_a = cos(a);
      var sin_a = sin(a);
      // noise is symmetric about origin (move to 1,1)
      var noi = noise(cos_a + 1, sin_a + 1, this.ctr);
      var d = this.r + map(noi, 0, 1, -this.r/4, this.r/4);
      vertex(d * cos_a, d * sin_a);
    }
    endShape();
    pop();
    this.ctr += 0.01;
  }

  this.constrain = function(){
    blob.pos.x = constrain(blob.pos.x, 0, 500);
    blob.pos.y = constrain(blob.pos.y, 0, 500);
  }

  this.eats = function(other){
    var d = p5.Vector.dist(this.pos, other.pos);
      if(d < this.r + other.r){
        var sum = PI * this.r * this.r + PI * other.r * other.r;
        this.r = sqrt(sum / PI);
        //this.r += other.r;
        console.log("eat");
        return true;
      } else {
        return false;
      }
  }

  this.update = function(){
    var newvel = createVector(mouseX - width/2, mouseY - height/2);
    var d = dist(mouseX, mouseY, width/2, height/2);
    var speed = map(d, 0, 2.5 * r, 0, 4);
    newvel.setMag(speed);
    this.vel.lerp(newvel, 0.2);
    this.pos.add(this.vel);
  }
}
