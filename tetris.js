//constant
//the distance moved every time, step length
const step = 20;
//divide the container
//18 rwo 10 col
const row_count = 18;
const col_count = 10;

let score = 0;

const newGameBtn = document.querySelector("#new-game");
const startBtn = document.querySelector("#start");

// >> create each model's data source, the rows and cols of each shape
const models = [
  //the first data source(L shape) horizontal L with tail facing up
  {
    //key 0 = the first block that makes up the L shape block
    0: {
      row: 2,
      col: 0,
    },
    //2nd block
    1: {
      row: 2,
      col: 1,
    },
    //3rd block
    2: {
      row: 2,
      col: 2,
    },
    //4th block
    3: {
      row: 1,
      col: 2,
    },
  },
  //2nd shape (T)
  {
    0: {
      row: 1,
      col: 1,
    },
    1: {
      row: 0,
      col: 0,
    },
    2: {
      row: 1,
      col: 0,
    },
    3: {
      row: 2,
      col: 0,
    },
  },
  //3rd Shape (o/square)
  {
    0: {
      row: 1,
      col: 1,
    },
    1: {
      row: 2,
      col: 1,
    },
    2: {
      row: 1,
      col: 2,
    },
    3: {
      row: 2,
      col: 2,
    },
  },
  //4th Shape (I)
  {
    0: {
      row: 0,
      col: 0,
    },
    1: {
      row: 0,
      col: 1,
    },
    2: {
      row: 0,
      col: 2,
    },
    3: {
      row: 0,
      col: 3,
    },
  },
  //5th Shape (Z)
  {
    0: {
      row: 1,
      col: 1,
    },
    1: {
      row: 1,
      col: 2,
    },
    2: {
      row: 2,
      col: 2,
    },
    3: {
      row: 2,
      col: 3,
    },
  },
];

//create a variable
// - representing the model we are using
let currentModel = {};

// to mark the 16-grid location
let currentX = 0;
let currentY = 0;

//record the location of each block's location, so we know when they meet each other
// key:value
//key = row_col, value = block element
const fixedBlocks = {};
//timer
let mInterval = null;

//entering game board
function init() {
  createModel();
  onKeyDown();
}

function updateScore() {
  document.getElementById("score").textContent = score;
}
// based on the model data source to create the block elements
function createModel() {
  // = test if the game can continue first
  if (isGameOver()) {
    gameOver();
    return;
  }
  //have to determine which model to use first, picked out fromm the list of Model object.
  //this will have to generate a random shape based on lodash
  currentModel = models[_.random(0, models.length - 1)];
  //have to re-initiate the location of the new block, every time this function is called
  currentX = 0;
  currentY = 0;
  //create the corresponding number of block elements, we've only designated where the blocks would go, the shape of it, but nothing have created in the model objects. now we have to fill the object in
  for (const key in currentModel) {
    const divEle = document.createElement("div");
    divEle.className = "activity-model";
    //putting all the blocks we created into the div element with the id of container
    document.getElementById("container").appendChild(divEle);
  }
  //locate the blocks
  locationBlocks();
  //automatically drop and move the shapes
  autoDown();
}

//position the location of the block elements based on teh data source
function locationBlocks() {
  //determine if the shape is within the boundaries of the container, if not, correct teh location
  checkBound();
  //1. get the block elements that was created according to the object location(rol/col)
  let eles = document.querySelectorAll(".activity-model");
  //loop through all of the elements(all of teh DVIs) created
  for (let i = 0; i < eles.length; i++) {
    //this will get each block within the shape
    let activityModelEle = eles[i];
    //2. have to get the rol# col# of each block
    //we used currentModel object to create the blocks
    let blockModel = currentModel[i];
    //based on the row# and col# of the block to locate the block to desired position
    //every block element location is determined by two values: the location of the 16-grid box and the location of the blocks within the 16-grid box
    activityModelEle.style.top = (currentY + blockModel.row) * step + "px";
    activityModelEle.style.left = (currentX + blockModel.col) * step + "px";
  }

  //3. based on the location of the block element to assign a location
}

// >> monitoring user's keyboard event
function onKeyDown() {
  document.onkeydown = function (event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
      case 38:
        console.log("up");
        //user moved it by one step, and each step is 20px defined earlier
        //move(0.-1)
        rotate(); //this is no reason to go up in the container for this game, so we are going to change the up key to rotating the grid
        break;
      case 39:
        console.log("right");
        move(1, 0);
        break;
      case 40:
        console.log("down");
        move(0, 1);
        break;
      case 37:
        console.log("left");
        move(-1, 0);
        break;
    }
  };
}

// >> moving the block -----------------------------------------------------------------------------------
function move(x, y) {
  // -- control the block to move ------------------------------------------------------------------------
  //get the element first
  //having [0] only allows us to control the first block of the entire shape. We can take it out to control the whole shape, but it's not efficient because if we are controlling each block, that means we have to keep track of every single blocks when it comes to rotations and row cancellation during the game, it wouldn't be smart
  //   let activityModelEle = document.getElementsByClassName("activity-model")[0];
  //get the position of the element, if its already at 0, then move it by the number
  //   activityModelEle.style.top =
  //     parseInt(activityModelEle.style.top || 0) + y * step + "px";
  //   activityModelEle.style.left =
  //     parseInt(activityModelEle.style.left || 0) + x * step + "px";
  // --------------------------------------------------------------------------------------------------------
  //the parameters coordinate has to be the location the block is intended to go to, not it's current.
  //so we use currentX + X = when it WANTS to go
  if (isMeet(currentX + x, currentY + y, currentModel)) {
    //when the bottom border touches, we ar moving the y-axis, so changes to the y-axis
    if (y !== 0) {
      //models bottom border are touched
      fixedBottomModel();
    }
    return;
  }
  //we want to manipulate the whole model, not just by the single block of the shape, this is where teh 16-grid(4*4) comes into play. To manipulate the entire shape, we have to locate the 16-grid inside the container.
  currentX += x; //currentX = currentX + x
  currentY += y;
  //now we want to locate the shape/block elements by locating the 16-grid box
  locationBlocks();
}

// >> rotating the shapes --------------------------------------------------------------------------------
function rotate() {
  //clone currentModel
  let cloneCurrentModel = _.cloneDeep(currentModel);
  //calculation method
  //post- rotation row = pre-rotation col
  //post-rotation col = 3 - pre-rotation row

  //loop through the numbers of the model
  for (const key in cloneCurrentModel) {
    let blockModel = cloneCurrentModel[key];
    //calculate
    //row, col# needs to go into row, so we can take out the existing value in row and put it in a temp variable. so now the row variable empty, then we can just put the col value straight into row.
    let temp = blockModel.row;
    blockModel.row = blockModel.col;
    //col
    blockModel.col = 3 - temp;
  }

  //we can use current x,y coordinate because there is no position changes
  if (isMeet(currentX, currentY, cloneCurrentModel)) {
    return;
  }

  //accepts the rotation
  currentModel = cloneCurrentModel;
  //re-position the block
  locationBlocks();
}

// >> control the shape models to move only within the container -----------------------------------------
function checkBound() {
  //define the boundary of the activity
  //no need for top boundary because user cannot move it up
  let leftBound = 0,
    rightBound = col_count,
    bottomBound = row_count;
  //when the shape model exceeds the boundary, we will let the 4x4 box to retreat one step back
  for (let key in currentModel) {
    let blockModel = currentModel[key];
    //left boundary
    if (blockModel.col + currentX < leftBound) {
      currentX++;
    }
    //right boundary
    if (blockModel.col + currentX >= rightBound) {
      currentX--;
    }
    //bottom boundary
    if (blockModel.row + currentY >= bottomBound) {
      currentY--;
      //2. make the model unable to be moved
      fixedBottomModel();
    }
  }
}
// >> fix the blocks at the bottom -------------------------------------------------------------------
function fixedBottomModel() {
  //1. change the model's style = changing the blocks style
  let activityModelEles = document.getElementsByClassName("activity-model");
  //every time we changed the element to fixed-model class, it takes away from the total number of length of the activity-model, so it will give us an error.
  //   for (let i = 0; i < activityModelEles.length; i++) {
  //so instead, we are going to count down.
  for (i = activityModelEles.length - 1; i >= 0; i--) {
    //get every block
    let activityModelEle = activityModelEles[i];
    //now change the class name to the classname we create in teh css file that corresponds to this style
    activityModelEle.className = "fixed-model";
    //to keep track of the locations of each block, so we can tell when one grid as a block there already, for the block collision function, we need to put the settled/fixed blocks into the object we created
    let blockModel = currentModel[i];
    fixedBlocks[currentY + blockModel.row + "_" + (currentX + blockModel.col)] =
      activityModelEle;
    console.log(fixedBlocks);
  }

  //call this function to determine if we need to clear the row
  isRemoveLine();
  //3. generate new model
  createModel();
}

// >> Block-Collision -------------------------------------------------------------------------------------
//x, y represent the location/value of the coordinate the block is intended to go. not it the current
//model represent the INTENDED direction the current shape is going to go.
function isMeet(x, y, model) {
  //determine collision, have to determine the moving block's next position is occupied by another block element. if there is another block, return true, if there isn't another block, return false
  for (let k in model) {
    let blockModel = model[k];
    //is the location already occupied by another block element?
    if (fixedBlocks[y + blockModel.row + "_" + (x + blockModel.col)]) {
      return true;
    }
  }
  return false;
} // ? where do we use this function? When we move the blocks!

//determine if a row is all filled
function isRemoveLine() {
  //this means, in the row, all the cols in that row contains a block
  //so we need ot loops though the cols in each row
  //go through all the rows
  for (let i = 0; i < row_count; i++) {
    //a marker, to tell us when the row is all filled up. This act as a hypothesis that the row is filled until proven false by the loop that actually goes through each col(grid) in that row
    let flag = true;
    //then go through all the col(grids) within that row
    for (let j = 0; j < col_count; j++) {
      //if the any grids in this row is not being filled, then that means the current row is not filled
      if (!fixedBlocks[i + "_" + j]) {
        //if when we try to retrieve data from the fixed blocks already at the bottom, and the data returns undefined, that means there is nothing in that col
        flag = false;
        break;
      }
      //
    }
    if (flag) {
      console.log("The current row has been filled up");
      removeLine(i);
    }
  }
}

//clear the filled row
function removeLine(line) {
  //delete all the block elements in the row
  //delete all the data of the blocks in that row as well
  //go through all the col in that row
  for (let i = 0; i < col_count; i++) {
    document
      .getElementById("container")
      .removeChild(fixedBlocks[line + "_" + i]); //line is row, i = col
    fixedBlocks[line + "_" + i] = null;
  }
  dropLines(line);
  score += 10;
  updateScore();
}

//drop all the above
function dropLines(line) {
  //1. have to add 1 to the row number of all of the above blocks, changing the data source
  //have to make the blocks to drop within the 16 grid as well
  //clear out the previous blocks

  //go through the rows that was above teh cleared out row
  for (let i = line - 1; i >= 0; i--) {
    //the cols in every row
    for (let j = 0; j < col_count; j++) {
      //if there's no data within that row, then continue
      if (!fixedBlocks[i + "_" + j]) continue;
      //exist data
      //add 1 to the row so it moves down
      fixedBlocks[i + 1 + "_" + j] = fixedBlocks[i + "_" + j];
      //then let the block drop within the 16-grid box
      fixedBlocks[i + 1 + "_" + j].style.top = (i + 1) * step + "px";
      //clear out the previous block element
      fixedBlocks[i + "_" + j] = null;
    }
  }
}

//have the shape come down automatically
//? where can we call this function? has to be after the shape is created and located on the container
function autoDown() {
  if (mInterval) {
    clearInterval(mInterval);
  }
  mInterval = setInterval(function () {
    move(0, 1); //it will let it move down the y-axis on it's own
  }, 1000); //every 600 millisecond, it will run the function move, which re-generate a block and comes down
}

//? where do we check these conditions? Before we generate new shape each time! --------------------------
//Condition to determine if the game is over
function isGameOver() {
  //when row 0 has blocks in existing where the block is going to drop
  for (let i = 0; i < col_count; i++) {
    if (fixedBlocks["0_" + i]) {
      return true;
    }
  }
  return false;
}

//function to stop the game
function gameOver() {
  //stops the interval timer
  if (mInterval) {
    clearInterval(mInterval);
  }
  resetScore();
  //alert message
  alert("Game Over!");
}
//? ------------------------------------------------------------------------------------------------------

function resetScore() {
  score = 0;
  updateScore();
}

// ----- START/PAUSE BUTTON ---------------------------------------------------------------------
//grab the button

function toggleGame() {
  if (mInterval) {
    clearInterval(mInterval);
    mInterval = null;
  } else {
    autoDown();
  }
}
//add an Eventlistener to the button and the action/function it will do when click on
startBtn.addEventListener("click", isPaused);

// --NEW GAME BUTTON -------------------------------------------------------------------------

function clearGrid() {
  for (let i = 0; i < row_count; i++) {
    for (let j = 0; j < col_count; j++) {
      if (!fixedBlocks[i + "_" + j]) continue;
      document
        .getElementById("container")
        .removeChild(fixedBlocks[i + "_" + j]); //line is row, i = col
      fixedBlocks[i + "_" + j] = null;
    }
  }
  createModel();
}
newGameBtn.addEventListener("click", clearGrid);

document.addEventListener("DOMContentLoaded", init);
