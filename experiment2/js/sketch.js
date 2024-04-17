// sketch.js - purpose and description here
// Author: Jim Lee
// Date: 04/16/2024

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

let seed = 727;
let snowflake_list = []

const snowColor = "#dde0e7";
const backSnowColor = "#9aa0ae";
const treeFrontLayerColor = "#07080a";
const treeMidLayerColor = "#404654";
const treeBackLayerColor = "#8f95a3";
const backgroundColor = "#cdcfdb";

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

function reimagine(){
  seed++;
}

// setup() function is called once when the program starts
function setup() {
  createCanvas(400, 200);
  //createButton("reimagine").mousePressed(() => seed++);
  angleMode(DEGREES)
  
  
  
  
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();


                     
  for (let i = 0; i < random(150, 200); i++){
    snowflake_list.push({
      x: random(width),
      y: random(height),
      size: random(5, 10)
    })
  }
  
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  // call a method on the instance
  myInstance.myMethod();
  randomSeed(seed);  
  background(100);
  noStroke();
  
  fill(backgroundColor);
  rect(0, 0, width, height - 40);
  
  let noiseLevel = 2
  let y1 = height - (height/5)
  
  // backmost trees
  stroke(treeBackLayerColor)
  thickness = height/20
  strokeWeight(thickness)
  y1 = height - (height/5)
  
  for (let x1 = 0; x1 < width; x1 += random(width/20, width*3/40)){
    thickness = height/20
    for (let y2 = height - (height/5); y2 > -30; y2 -= 20){
      let max = (x1) + noiseLevel
      let min = (x1) - noiseLevel
      let x2 = random(min, max)
      line(mouseX/300 + x1, y1, mouseX/300 + x2, y2)
      thickness -= 0.5;
      strokeWeight(thickness)
      x1 = x2;
      y1 = y2;
    }
    push()
    let branchThickeness = width * 0.2
    translate(x1, -branchThickeness * 3)
    rotate(random(160, 200))
    branch(10, branchThickeness)
    pop()
  }

  // middle trees
  stroke(treeMidLayerColor)
  strokeWeight(thickness)
  y1 = height - (height/5)
  
  for (let x1 = 0; x1 < width; x1 += random(width/8, width*3/20)){
    thickness = height/20
    for (let y2 = height - (height/5); y2 > -30; y2 -= 20){
      let max = (x1) + noiseLevel
      let min = (x1) - noiseLevel
      let x2 = random(min, max)
      line(mouseX/350 + x1, y1, mouseX/350 + x2, y2)
      thickness -= 0.5;
      strokeWeight(thickness)
      x1 = x2;
      y1 = y2;
    }
    push()
    let branchThickeness = width * 0.2
    translate(x1, -branchThickeness*3)
    rotate(random(160, 200))
    branch(10, branchThickeness)
    pop()
  }
  
  // frontmost trees
  stroke(treeFrontLayerColor)
  strokeWeight(thickness);
  y1 = height - (height/5)
  
  for (let x1 = 0; x1 < width; x1 += random(width/40, width/8)){
    thickness = height/13.3
    for (let y2 = height - (height/5); y2 > -30; y2 -= 20){
      let max = (x1) + noiseLevel
      let min = (x1) - noiseLevel
      let x2 = random(min, max);
      line(mouseX/300 + x1, y1, mouseX/300 + x2, y2)
      thickness--;
      strokeWeight(thickness)
      x1 = x2;
      y1 = y2;
    }
    
  }
  
  
  
  // darker snow layer
  strokeWeight(0)
  fill(backSnowColor);
  beginShape();
  vertex(-50, height - (height/6))
  const steps = 15;
  for (let i = 0; i < steps+1; i++){
    let x = (width * i) / steps ;
    let y = (height- (height/5)) - (random() * random() * random() * height) / 6 - height / 50;
    vertex(mouseX/300 + x, y);
  }
  vertex(width + 50, height - (height/6));
  endShape(CLOSE);
  
  // front snow layer
  fill(snowColor);
  beginShape();
  vertex(-50, height)
  for (let i = 0; i < steps+1; i++){
    let x = (width * i) / steps ;
    let y = (height - (height/6)) - (random() * random() * random() * height) / 20 - height / 50;
    vertex(mouseX/300 + x, y);
  }
  vertex(width + 50, height);
  endShape(CLOSE);
  
  let branchColor = "#ffffff"

  // left side branches  
  push()
  translate(-width/8 * 2, height/20)
  stroke(branchColor)
  rotate(90)
  branch(width/40, width/8)
  pop()
  
  // right side branches
  push()
  translate(width+(width/8 * 2), height/20)
  stroke(branchColor)
  rotate(-90)
  branch(width/40, width/8) 
  pop()
  
  // snow fall
  // https://editor.p5js.org/shilpaamehta/sketches/Yll34qBr8
  // https://p5js.org/examples/simulate-snowflakes.html
  
  for (let i = 0; i < snowflake_list.length; i++){
    const snowflake = snowflake_list[i];
    ellipse(snowflake.x, snowflake.y, snowflake.size)
    
    if (snowflake.y > height){ // reset snowflake to top of screen when it reaches bottom
      snowflake.y = 0;
    } else if (snowflake.x > width){
      snowflake.x = random([0, width])
    } else {
      snowflake.x += random(-2, 2)
      snowflake.y += random(5, 5.5)
    }
  }
  
}

// https://www.youtube.com/watch?v=-3HwUKsovBE
function branch(weight, length){
  push()
  if (length > 75){
    strokeWeight(weight)
    line(mouseX/400, 0, mouseX/400, -length)
    translate(0, -length)
    rotate(random(20, 30))
    branch(weight * random(0.6, 0.7), length * random(0.7, 0.9))
    rotate(random(-50, -60))
    branch(weight * random(0.6, 0.7), length * random(0.7, 0.9))
  }
  pop()
  
  
}
  

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}