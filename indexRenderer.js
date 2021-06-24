// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//const serialport = require('serialport')

const ipc = require('electron').ipcRenderer;
const $vid = document.querySelector(`.video`);
let loops = [[true, 107,[91, 93, 96]], [true, 213.2, [200, 205, 208]], [true, 308, [296, 298, 302]], [true, 382, [368, 372, 376]], [true, 440, [423, 425, 430]], [true, 471, [462, 464, 466]]];
let vidTime = 0;
let loopCounter = 0;
let optionCounter = 0;

let drawLoopCounter = 0

let introduceRed = true;
let introduceBlue = true;
let decRed = true;
let incRedDecBlue = true;
let decAll = true;
let turnOffStrip = true;
let introStop = true;
let fout = true;
let foutDone = true;

let aNotShown = true; 
let bNotShown = true;
let cNotShown = true;

ipc.on('messageFromMain', (event, message) => {
  console.log(message)
  loops[loopCounter][0] = false
  loopCounter++;
  if(loopCounter > 5) {
    loopCounter = 0;
  }
  console.log(loopCounter)
  aNotShown = true;
  bNotShown = true;
  cNotShown = true;
});

ipc.on('startExp', (event, message) => {
  console.log(message);
  if(message === "startItUp") {
    setTimeout(() => {
      const $readyContainer = document.querySelector(`.ready__container`);
      $readyContainer.style.display = "none";
      $vid.play();
      drawLoop();

      // VOICE ANIMATION STARTEN
      ipc.send('changeStrip', 'intro');
    }, 3000);
    
  } else if (message === "readyOne") {
    const $readyText = document.querySelector(`.ready__one`);
    $readyText.style.display = "block";
  } else if (message === "readyTwo") {
    const $readyText = document.querySelector(`.ready__two`);
    $readyText.style.display = "block";
  }
});


const drawLoop = () => {
  drawLoopCounter++;
  vidTime = $vid.currentTime;

  //console.log(drawLoopCounter);

  if(drawLoopCounter % 4 == 0) {
    checkTime();
  }

  if (loops[loopCounter][0]) {    
    if (vidTime > loops[loopCounter][2][optionCounter] && aNotShown) {
      aNotShown = false;
      optionCounter++;
      ipc.send('option', 'A');
    }

    if (vidTime > loops[loopCounter][2][optionCounter] && bNotShown) {
      bNotShown = false;
      optionCounter++;
      ipc.send('option', 'B');
    }

    if (vidTime > loops[loopCounter][2][optionCounter] && cNotShown) {
      cNotShown = false;
      optionCounter = 0;
      ipc.send('option', 'C');
    }

    if (vidTime > loops[loopCounter][1] - 3) {
      ipc.send('rep');
    }
    if (vidTime > loops[loopCounter][1]) {
      $vid.currentTime = loops[loopCounter][1] - 2.9;
    }
  }

  window.requestAnimationFrame(drawLoop);
}

const checkTime = () => {
  
  // INTRODUCTION FIRST RED THEN BLUE
  if(vidTime > 56 && introStop) {
    introStop = false;
    ipc.send('changeStrip', 'introStop')
  }
  
  if(vidTime > 124 && introduceRed) {
    introduceRed = false;
    ipc.send('changeStrip', 'introduceRed');
  }
  
  
  if (vidTime > 126 && introduceBlue) {
    introduceBlue = false;
    ipc.send('changeStrip', "introduceBlue");
  } 

  if (vidTime > 129 && decRed) {
    decRed = false;
    ipc.send('changeStrip', 'decRed');
  }

  if(vidTime > 131 && incRedDecBlue) {
    incRedDecBlue = false;
    ipc.send('changeStrip', 'incRedDecBlue');
  }

  if (vidTime > 133 && decAll) {
    decAll = false;
    ipc.send('changeStrip', 'decAll');
  }

  if(vidTime > 135 && turnOffStrip) {
    turnOffStrip = false;
    ipc.send('changeStrip', 'turnOffStrip');
    
  }

  if (vidTime > 226 && fout) {
    fout = false;
    ipc.send('changeStrip', 'fout');

  }

  if (vidTime > 228 && foutDone) {
    foutDone = false;
    ipc.send('changeStrip', 'foutDone');

  }

  if(vidTime >550) {
    restartEntireExp();
  }

}

const restartEntireExp = () => {
  /* $vid.pause();
  loops = [[true, 107, [91, 93, 96]], [true, 213.2, [200, 205, 208]], [true, 308, [296, 298, 302]], [true, 382, [368, 372, 376]], [true, 440, [423, 425, 430]], [true, 471, [462, 464, 466]]];
  loopCounter = 0;
  optionCounter = 0;
  $vid.currentTime = 0;
  drawLoopCounter = 0;
  introduceRed = true;
  introduceBlue = true;
  decRed = true;
  incRedDecBlue = true;
  decAll = true;
  turnOffStrip = true;
  introStop = true;
  fout = true;
  foutDone = true;
  aNotShown = true;
  bNotShown = true;
  cNotShown = true; */
  ipc.send('reload', 'reload');
  window.reload();
}