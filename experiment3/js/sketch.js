// sketch.js - purpose and description here
// Author: Your Name
// Date:

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


// draw() function is called repeatedly, it's the main animation loop
var s = function( p ){
  /* exported preload, setup, draw, placeTile */

  /* global generateGrid drawGrid */

  let seed = 0;
  let tilesetImage;
  let currentGrid = [];
  let numRows, numCols;

  p.preload = function() {
    tilesetImage = p.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  }

  p.reseed = function() {
    seed = (seed | 0) + 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    p.select("#seedReport").html("seed " + seed);
    p.regenerateGrid();
  }

  p.regenerateGrid = function() {
    p.select("#asciiBox1").value(p.gridToString(p.generateGrid(numCols, numRows)));
    p.reparseGrid();
  }

  p.reparseGrid = function() {
    currentGrid = p.stringToGrid(p.select("#asciiBox1").value());
  }

  p.gridToString = function(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }

  p.stringToGrid = function(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }

  p.setup = function() {
    numCols = p.select("#asciiBox1").attribute("rows") | 0;
    numRows = p.select("#asciiBox1").attribute("cols") | 0;
  
    p.createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer1");
    p.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  
    p.select("#reseedButton").mousePressed(p.reseed);
    p.select("#asciiBox1").input(p.reparseGrid);
  
    p.reseed();
  }

  p.draw = function() {
    p.randomSeed(seed);
    p.drawGrid(currentGrid);
  }
  
  p.placeTile = function(i, j, ti, tj) {
    p.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }

 // solution

  p.generateGrid = function(numCols, numRows) {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push("_");
      }
      grid.push(row);
    }
    
    
    // ocean
    for (let j = 0; j < numCols; j++) {
      for (let i = p.random((numRows/4) * 3, numRows/2) | 0; i < numRows; i++) {
        grid[i][j] = "~"
      }
    }
    
    // houses
    for (let i = 1; i < numRows/2; i++){
      for (let j = 1; j < numCols/2; j++){
        if (p.random(1, 100) > 98 && grid[i][j] == "_") {
          grid[i][j] = "h";
        }
      }
    }
    
    //trees
    ///let treeSpawn = false;
    
    for (let i = 0; i < numRows/2; i++){
      for (let j = numCols/2; j < numCols-1; j++){
        if (p.random(1, 100) > 90 && grid[i][j] == "_") {
          grid[i][j] = "t";
        }
      }
    }
  
    return grid;
  }

  p.drawGrid = function(grid) {
    p.background(128);
    if (p.mouseX % 12 == 0){
      seed++
    }
    
    for(let i = 0; i < grid.length; i++) { // row
      for(let j = 0; j < grid[i].length; j++) { // col
        if (p.gridCheck(grid, i, j, "_")){
          p.placeTile(i, j, p.random(4) | 0, 1) // grass
        } else if (p.gridCheck(grid, i, j, "h")){
          p.placeTile(i, j, p.random(26, 28)|0, p.random(0, 4)|0) // ocean
        } else if (p.gridCheck(grid, i, j, "t")){
          p.placeTile(i, j, p.random(16, 17) | 0, p.random(0, 3) | 0) //tree
        } else {
          p.drawContext(grid, i, j, "_", 0, 0)
        }
      }
    }
  }
  
  p.gridCheck = function(grid, i, j, target){
    if (i < grid.length && j < grid[i].length && grid[i][j] == target){
      return 1;
    }
    return 0;
  }

  p.gridCode = function(grid, i, j, target){
    let northBit = p.gridCheck(grid, i-1, j, target);
    let westBit = p.gridCheck(grid, i, j-1, target);
    let eastBit = p.gridCheck(grid, i, j+1, target);
    let southBit = p.gridCheck(grid, i+1, j, target);
    return (northBit<<0)+(westBit<<1)+(eastBit<<2)+(southBit<<3)
  }

  p.drawContext = function(grid, i, j, target, ti, tj){
    let code = p.gridCode(grid, i, j, target)
    let [tiOffset, tjOffset] = lookup[code]
    if (code == 0){
      p.placeTile(i, j, p.random(0, 4)|0, 13)
    } else {
      p.placeTile(i, j, ti + tiOffset, tj + tjOffset)
    }
  }

  // [x, y]
const lookup = [
  [0, 13], // 0. 
  [0, 18], // 1. has only top
  [0, 18], // 2. has only left
  [0, 18], // 3. has top and left
  [0, 18], // 4. has only right
  [0, 18], // 5. has top and right
  [0, 1], // 6. 
  [0, 1], // 7. 
  [10, 0], // 8. has only bottom
  [-1, 0], // 9. 
  [-1, -3], // 10. has bottom and left
  [0, 0], // 11. 
  [0, 9], // 12. has bottom and right
  [0, 0], // 13. 
  [0, 10], // 14. has bottom, left and right
  [0, 18], // 15. has all
  ]  
}

var overworld = new p5(s, 'overworld')

var s2 = function(p){
  /* exported preload, setup, draw, placeTile */

  /* global generateGrid drawGrid */

  let seed = 0;
  let tilesetImage;
  let currentGrid = [];
  let numRows, numCols;

  p.preload = function() {
    tilesetImage = p.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  }

  p.reseed = function() {
    seed = (seed | 0) + 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    p.select("#seedReport").html("seed " + seed);
    p.regenerateGrid();
  }

  p.regenerateGrid = function() {
    p.select("#asciiBox2").value(p.gridToString(p.generateGrid(numCols, numRows)));
    p.reparseGrid();
  }

  p.reparseGrid = function() {
    currentGrid = p.stringToGrid(p.select("#asciiBox2").value());
  }

  p.gridToString = function(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }

  p.stringToGrid = function(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }

  p.setup = function() {
    numCols = p.select("#asciiBox2").attribute("rows") | 0;
    numRows = p.select("#asciiBox2").attribute("cols") | 0;
  
    p.createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer2");
    p.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  
    p.select("#reseedButton").mousePressed(p.reseed);
    p.select("#asciiBox2").input(p.reparseGrid);
  
    p.reseed();
  }

  p.draw = function() {
    p.randomSeed(seed);
    p.drawGrid(currentGrid);
  }
  
  p.placeTile = function(i, j, ti, tj) {
    p.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }

/* exported generateGrid, drawGrid */
/* global placeTile */


p.generateGrid = function(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  
  let rowStart = p.floor(p.random(1, numRows/4))
  let rowSize = p.floor(p.random(numRows/4, numRows*(7/20)))
  let colStart = p.floor(p.random(1, numCols/4));
  let colSize = p.floor(p.random(numCols/4, numCols*(7/20)));
  
  for (let i = rowStart; i < rowStart + rowSize; i++){
    for (let j = colStart; j < colStart + colSize; j++){
      grid[i][j] = '.';
    }
  }
  
  rowStart = p.floor(p.random(1, numRows/4)) // 1 to 5
  rowSize = p.floor(p.random(numRows/4, numRows*(7/20)))
  colStart = p.floor(p.random(numCols/2, (numCols/2)+2)) // 10 to 12
  colSize = p.floor(p.random(numCols*(7/20), numCols/2)) 
  
  for (let i = rowStart; i < rowStart + rowSize; i++){
    for (let j = colStart; j < colStart + colSize; j++){
      grid[i][j] = '.';
    }
  }
  
  rowStart = p.floor(p.random(numRows/2, numRows/4))
  rowSize = p.floor(p.random(numRows*(7/20), numRows*0.75))
  colStart = p.floor(p.random(1, numCols/4));
  colSize = p.floor(p.random(numCols/4, numCols*(7/20)));
  
  for (let i = rowStart; i < rowStart + rowSize; i++){
    for (let j = colStart; j < colStart + colSize; j++){
      grid[i][j] = '.';
    }
  }
  
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      // if room, random chance of 2%, and not a wall tile
      if (grid[i][j] == '.' && p.floor(p.random(1, 100)) > 97 && p.gridCode(grid, i, j, "_") == 0) { 
        grid[i][j] = 'c';   
      }
    }
  }
    


  return grid;
}


/*
[[_, _, _, _, _, _, _, _, _],
 [_, _, _, _, _, _, _, _, _]
 [_, _, _, _, _, _, _, _, _]
 [_, _, _, _, _, _, _, _, _]
 [_, _, _, _, _, _, _, _, _]
 [_, _, _, _, _, _, _, _, _]
 [_, _, _, _, _, _, _, _, _]
 [_, _, _, _, _, _, _, _, _]]
*/


p.drawGrid = function(grid) {
  p.background(128);
  if (p.mouseX % 5 == 0){
    seed++
  }

  for(let i = 0; i < grid.length; i++) { // row
    for(let j = 0; j < grid[i].length; j++) { // col
      if (p.gridCheck(grid, i, j, "_")){
        p.placeTile(i, j, p.random(21, 27) | 0, 24) // wall
      }  else if (p.gridCheck(grid, i, j, "c")){
        p.placeTile(i, j, p.random(0, 5)|0, p.random(29, 31) | 0) //chest
      } else {
        p.drawContext(grid, i, j, "_", 25, 24)
      } 
    }
  }
  
  
}

p.gridCheck = function(grid, i, j, target){
  if (i < grid.length && j < grid[i].length && grid[i][j] == target){
    return 1;
  }
  return 0;
}

// i is row
// j is column
/*
    1
  2   4
    8
*/
p.gridCode = function(grid, i, j, target){
  let northBit = p.gridCheck(grid, i-1, j, target);
  let westBit = p.gridCheck(grid, i, j-1, target);
  let eastBit = p.gridCheck(grid, i, j+1, target);
  let southBit = p.gridCheck(grid, i+1, j, target);
  return (northBit<<0)+(westBit<<1)+(eastBit<<2)+(southBit<<3)
}

p.drawContext = function(grid, i, j, target, ti, tj){
  let code = p.gridCode(grid, i, j, target)
  let [tiOffset, tjOffset] = lookup[code]
  p.placeTile(i, j, ti + tiOffset, tj + tjOffset)
}

// [x, y]
const lookup = [
  [-5, -1], // 0. 
  [-1, -3], // 1. has only top
  [-1, -3], // 2. has only left
  [-1, -3], // 3. has top and left
  [-1, -3], // 4. has only right
  [-1, -3], // 5. has top and right
  [0, 0], // 6. 
  [0, 0], // 7. 
  [-1, -3], // 8. has only bottom
  [-1, 0], // 9. 
  [-1, -3], // 10. has bottom and left
  [0, 0], // 11. 
  [-1, -3], // 12. has bottom and right
  [0, 0], // 13. 
  [0, 0], // 14. 
  [0, 0], // 15.
  [0, 0] // 16.
]
}

var dungeon = new p5(s2, 'dungeon') 




// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}