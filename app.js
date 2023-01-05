var c_canvas;
var context;
var runButton;
var pauseButton;
var randomiseButton;
var runbuttonIsClicked = false;

function creategrid(rows, useRandom) {
  const grid = [];
  for (let x = 0; x < rows; x++) {
    grid[x] = [];
    for (let y = 0; y < rows; y++) {
      if (useRandom) {
        addCellWithRandomValue(grid, x, y);
      } else {
        grid[x][y] = 0;
      }
    }
  }
  return grid;
}

function addCellWithRandomValue(grid, x, y) {
  grid[x] = grid[x] || [];
  grid[y] = grid[y] || [];
  let active = Math.random() > 0.5 ? 1 : 0;
  grid[x][y] = active;
}

function draw(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      //console.log(grid[x][y] + " ");
    }
    //console.log(gridOfCells);
  }
}

function determineNeighbours(grid) {
  const newGridOfCells = creategrid(10, false);

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let cellValueOnNextTick = checkThreeByThree(
        grid,
        x,
        y,
        grid.length,
        grid[x].length
      );
      newGridOfCells[x][y] = cellValueOnNextTick;

      if (cellValueOnNextTick == 1) {
        // todo
        // colour the appropriate square
        context.fillStyle = "#ADFF2F";
        context.fillRect(x * 50, y * 50, 50, 50);
      } else if (cellValueOnNextTick == 0) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(x * 50, y * 50, 50, 50);
      }
    }
  }
  return newGridOfCells;
}

function checkThreeByThree(grid, x, y, length, height) {
  let surroundingAliveCells = 0;

  if (x - 1 >= 0 && x - 1 < length && y - 1 >= 0 && y - 1 < height) {
    if (grid[x - 1][y - 1] == 1) {
      surroundingAliveCells++;
    }
  }

  if (x >= 0 && x < length && y - 1 >= 0 && y - 1 < height) {
    if (grid[x][y - 1] == 1) {
      surroundingAliveCells++;
    }
  }

  if (x + 1 >= 0 && x + 1 < length && y - 1 >= 0 && y - 1 < height) {
    if (grid[x + 1][y - 1] == 1) {
      surroundingAliveCells++;
    }
  }

  if (x - 1 >= 0 && x - 1 < length && y >= 0 && y < height) {
    if (grid[x - 1][y] == 1) {
      surroundingAliveCells++;
    }
  }

  if (x + 1 >= 0 && x + 1 < length && y >= 0 && y < height) {
    if (grid[x + 1][y] == 1) {
      surroundingAliveCells++;
    }
  }

  if (x - 1 >= 0 && x - 1 < length && y + 1 >= 0 && y + 1 < height) {
    if (grid[x - 1][y + 1] == 1) {
      surroundingAliveCells++;
    }
  }

  if (x >= 0 && x < length && y + 1 >= 0 && y + 1 < height) {
    if (grid[x][y + 1] == 1) {
      surroundingAliveCells++;
    }
  }

  if (x + 1 >= 0 && x + 1 < length && y + 1 >= 0 && y + 1 < height) {
    if (grid[x + 1][y + 1] == 1) {
      surroundingAliveCells++;
    }
  }

  // alive cell becomes dead
  if (grid[x][y] == 1 && surroundingAliveCells < 2) {
    return 0;
  }
  // alive cell stays alive
  else if (
    grid[x][y] == 1 &&
    (surroundingAliveCells == 2 || surroundingAliveCells == 3)
  ) {
    return 1;
  }
  // alive becomes dead
  else if (grid[x][y] == 1 && surroundingAliveCells > 3) {
    return 0;
  }
  //dead becomes alive
  else if (grid[x][y] == 0 && surroundingAliveCells == 3) {
    return 1;
  } else {
    // dead with less than or greater than 3 stays dead
    return 0;
  }
}

// global.document = new JSDOM(html).window.document;

$(document).ready(function () {
  c_canvas = document.getElementById("c");
  context = c_canvas.getContext("2d");
  runButton = document.getElementById("run");
  pauseButton = document.getElementById("pause");
  randomiseButton = document.getElementById("randomise");

  for (var x = 0; x < 500; x += 50) {
    context.moveTo(x, 0);
    context.lineTo(x, 500);
    console.log("y line drawn: " + x);
  }

  for (var y = 0; y < 500; y += 50) {
    context.moveTo(0, y);
    context.lineTo(500, y);
    console.log("x line drawn: " + y);
  }

  context.strokeStyle = "#000000";
  context.stroke();

  $(c_canvas).click(function (evt) {
    var pos = getNearestSquare(getMousePos(c_canvas, evt));
    var checkCellWhite = isCellWhite(
      context.getImageData(pos.x + 5, pos.y + 5, 1, 1).data
    );
    if (pos != null && context != undefined) {
      if (checkCellWhite == false) {
        // make it white
        context.fillStyle = "#FFFFFF";
        context.fillRect(pos.x, pos.y, 50, 50);

        // set the corresponding x,y position of gridOfCells
        // to be alive or dead
        gridOfCells[pos.x / 50][pos.y / 50] = 0;
      } else if (checkCellWhite == true) {
        // make it green
        context.fillStyle = "#ADFF2F";
        context.fillRect(pos.x, pos.y, 50, 50);

        // set the corresponding x,y position of gridOfCells
        // to be alive or dead
        gridOfCells[pos.x / 50][pos.y / 50] = 1;
      }
    }
  });

  $(runButton).click(function (button, evt) {
    $("#game_state").html("Running - hit pause to use 'randomise'");
    isRunning = true;
  });

  $(pauseButton).click(function (button, evt) {
    $("#game_state").html("Paused");
    isRunning = false;
  });

  $(randomiseButton).click(function (button, evt) {
    if (isRunning == false) {
      $("#game_state").html("Randomised and ready to run");
      randomizeGridAndPaintCanvas();
    }
  });
});

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function getNearestSquare(position) {
  var x = position.x;
  var y = position.y;
  if (x < 0 || y < 0) return null;
  x = Math.floor(x / 50) * 50;
  y = Math.floor(y / 50) * 50;
  return {
    x: x,
    y: y,
  };
}

function isCellWhite(colourArray) {
  // case that it is [0, 0, 0, 0]:

  if (
    colourArray[0] == 0 &&
    colourArray[1] == 0 &&
    colourArray[2] == 0 &&
    colourArray[3] == 0
  ) {
    return true;
  }
  if (
    colourArray[0] == 255 &&
    colourArray[1] == 255 &&
    colourArray[2] == 255 &&
    colourArray[3] == 255
  ) {
    return true;
  }
  return false;
}

function randomizeGridAndPaintCanvas() {
  // randomizing grid and paint cells
  for (let x = 0; x < gridOfCells.length; x++) {
    for (let y = 0; y < gridOfCells[x].length; y++) {
      addCellWithRandomValue(gridOfCells, x, y);
      if (gridOfCells[x][y] == 1) {
        context.fillStyle = "#ADFF2F";
        context.fillRect(x * 50, y * 50, 50, 50);
      } else {
        context.fillStyle = "#FFFFFF";
        context.fillRect(x * 50, y * 50, 50, 50);
      }
    }
  }
}

let isRunning = false;

let gridOfCells = creategrid(10, false);

draw(gridOfCells);

setInterval(function () {
  if (isRunning) {
    console.log("running...");
    gridOfCells = determineNeighbours(gridOfCells);
    draw(gridOfCells);
  }
  for (var x = 0; x < 500; x += 50) {
    context.moveTo(x, 0);
    context.lineTo(x, 500);
    console.log("y line drawn: " + x);
  }

  for (var y = 0; y < 500; y += 50) {
    context.moveTo(0, y);
    context.lineTo(500, y);
    console.log("x line drawn: " + y);
  }

  context.strokeStyle = "#000000";
  context.stroke();
}, 150);
