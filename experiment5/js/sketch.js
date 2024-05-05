// sketch.js - purpose and description here
// Author: Jim Lee
// Date: 5/4/2024

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

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

// sketch js
/* exported preload, setup, draw */
/* global memory, dropper_inspirations, dropper_shapes, restart, rate, slider, activeScore, bestScore, fpsCounter */
/* global getInspirations, getShapes, initDesign, renderDesign, mutateDesign */

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;

let currentShape;

function preload() {
  let allInspirations = getInspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper_inspirations.appendChild(option);
  }
  dropper_inspirations.onchange = (e) =>
    inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper_inspirations.value]);

  let allShapes = getShapes();
  for (let i = 0; i < allShapes.length; i++) {
    let shape = allShapes[i];
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = shape.name;
    dropper_shapes.appendChild(option);
  }
  dropper_shapes.onchange = (e) => shapeChanged(allShapes[e.target.value]);
  currentShape = allShapes[0];

  restart.onclick = () => shapeChanged(allShapes[dropper_shapes.value]);
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
}

function shapeChanged(nextShape) {
  currentShape = nextShape;
  currentDesign = undefined;
  currentInspiration.shape = String(currentShape.name);
  memory.innerHTML = "";
  setup();
}

function setup() {
  angleMode(DEGREES); // my change
  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = initDesign(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0, 0, width, height);
  loadPixels();
  currentInspirationPixels = pixels;
}

function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;

  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1 / (1 + error / n);
}

function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

let mutationCount = 0;

function draw() {
  if (!currentDesign) {
    return;
  }
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  mutateDesign(currentDesign, currentInspiration, slider.value / 100.0);

  randomSeed(0);
  renderDesign(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
  }

  fpsCounter.innerHTML = Math.round(frameRate());
}

/* exported getInspirations, getShapes, initDesign, renderDesign, mutateDesign */

function getInspirations() {
    return [
      {
        name: "galaxy",
        assetUrl:
          "https://cdn.glitch.global/eb323e52-20cb-4d64-b604-154213464901/wikigalaxy.jpg?v=1714672498301",
        credit:
          "https://en.wikipedia.org/wiki/Galaxy#/media/File:NGC_4414_(NASA-med).jpg",
        shape: "ellipse",
      },
      {
        name: "orca",
        assetUrl:
          "https://cdn.glitch.global/eb323e52-20cb-4d64-b604-154213464901/orca.jpg?v=1714868460101",
        credit: "https://www.fisheries.noaa.gov/about/marine-mammal-laboratory",
        shape: "ellipse",
      },
      {
        name: "arctic fox",
        assetUrl:
          "https://cdn.glitch.global/eb323e52-20cb-4d64-b604-154213464901/Arctic_fox_(6375703941).jpg?v=1714887673000",
        credit:
          "https://commons.wikimedia.org/wiki/File:Arctic_fox_%286375703941%29.jpg",
        shape: "ellipse",
      },
    ];
  }
  
  function getShapes() {
    return [
      {
        name: "ellipse",
      },
      {
        name: "triangle",
      },
      {
        name: "rectangle",
      },
      {
        name: "circle",
      },
    ];
  }
  
  function initDesign(inspiration) {
    // set the canvas size based on the container
    let canvasContainer = $('.image-container'); // Select the container using jQuery
    let canvasWidth = canvasContainer.width(); // Get the width of the container
    let aspectRatio = inspiration.image.height / inspiration.image.width;
    let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
    resizeCanvas(canvasWidth/2, canvasHeight/2);
    $(".caption").text(inspiration.credit); // Set the caption text

    // add the original image to #original
    const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
    $('#original').empty();
    $('#original').append(imgHTML);
  
    let design = {
      background_color: 0,
      parameters: [],
    };
  
    switch (inspiration.shape) {
      case "ellipse":
        for (let i = 0; i < 1000; i++) {
          design.parameters.push({
            x: random(width),
            y: random(height),
            w: random(width / 2),
            h: random(height / 2),
            fill: random(255),
          });
        }
        break;
      case "triangle":
        for (let i = 0; i < 300; i++) {
          design.parameters.push({
            x1: random(width),
            y1: random(height),
            x2: random(width),
            y2: random(height),
            x3: random(width),
            y3: random(height),
            fill: random(255),
          });
        }
        break;
      case "rectangle":
        for (let i = 0; i < 300; i++) {
          design.parameters.push({
            x: random(width),
            y: random(height),
            w: random(width / 2),
            h: random(height / 2),
            fill: random(255),
          });
        }
        break;
      default:
        for (let i = 0; i < 300; i++) {
          design.parameters.push({
            x: random(width),
            y: random(height),
            diameter: random(width / 10),
            fill: random(255),
          });
        }
        break;
    }
  
    return design;
  }
  
  function renderDesign(design, inspiration) {
    noStroke();
    background(design.background_color);
  
    switch (inspiration.shape) {
      case "ellipse":
        for (let parameter of design.parameters) {
          fill(parameter.fill, 128);
          ellipse(parameter.x, parameter.y, parameter.w, parameter.h);
        }
        break;
      case "triangle":
        for (let parameter of design.parameters) {
          fill(parameter.fill, 128);
          triangle(
            parameter.x1,
            parameter.y1,
            parameter.x2,
            parameter.y2,
            parameter.x3,
            parameter.y3
          );
        }
        break;
      case "rectangle":
        for (let parameter of design.parameters) {
          fill(parameter.fill, 128);
          rect(parameter.x, parameter.y, parameter.w, parameter.h);
        }
        break;
      default:
        for (let parameter of design.parameters) {
          fill(parameter.fill, 128);
          circle(parameter.x, parameter.y, parameter.diameter);
        }
        break;
    }
  }
  
  function mutateDesign(design, inspiration, rate) {
    switch (inspiration.shape) {
      case "ellipse":
        for (let parameter of design.parameters) {
          parameter.x = mut(parameter.x, 0, width, rate);
          parameter.y = mut(parameter.y, 0, height, rate);
          parameter.w = mut(parameter.w, 0, width / 2, rate);
          parameter.h = mut(parameter.h, 0, height / 2, rate);
          parameter.fill = mut(parameter.fill, 0, 255, rate);
        }
        break;
      case "triangle":
        for (let parameter of design.parameters) {
          parameter.x1 = mut(parameter.x1, 0, width, rate);
          parameter.x2 = mut(parameter.x2, 0, width, rate);
          parameter.x3 = mut(parameter.x3, 0, width, rate);
  
          parameter.y1 = mut(parameter.y1, 0, height, rate);
          parameter.y2 = mut(parameter.y2, 0, height, rate);
          parameter.y3 = mut(parameter.y3, 0, height, rate);
  
          parameter.fill = mut(parameter.fill, 0, 255, rate);
        }
        break;
      case "rectangle":
        for (let parameter of design.parameters) {
          parameter.x = mut(parameter.x, 0, width, rate);
          parameter.y = mut(parameter.y, 0, height, rate);
          parameter.w = mut(parameter.w, 0, width / 2, rate);
          parameter.h = mut(parameter.h, 0, height / 2, rate);
          parameter.fill = mut(parameter.fill, 0, 255, rate);
        }
        break;
      default:
        for (let parameter of design.parameters) {
          parameter.x = mut(parameter.x, 0, width, rate);
          parameter.y = mut(parameter.y, 0, height, rate);
          parameter.diameter = mut(parameter.diameter, 0, width, rate);
          parameter.fill = mut(parameter.fill, 0, 255, rate);
        }
        break;
    }
  }
  
  function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
  }
  
  







// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}