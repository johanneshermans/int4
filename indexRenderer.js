// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//const serialport = require('serialport')

const ipc = require('electron').ipcRenderer;
const $vid = document.querySelector(`.video`);
const loops = [[true, 107], [true, 213.2], [true, 308], [true, 382], [true, 440], [true, 471]];
let vidTime = 0;
let loopCounter = 0;

let drawLoopCounter = 0

let introduceRed = true;
let introduceBlue = true;
let decRed = true;
let incRedDecBlue = true;
let decAll = true;
let turnOffStrip = true;
let introStop = true;

ipc.on('messageFromMain', (event, message) => {
  console.log(message)
  loops[loopCounter][0] = false
  loopCounter++
  console.log(loopCounter)
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
  console.log($vid.currentTime);
  drawLoopCounter++;
  vidTime = $vid.currentTime;

  //console.log(drawLoopCounter);

  if(drawLoopCounter % 4 == 0) {
    checkTime();
  }

  if (loops[loopCounter][0]) {
    if (vidTime > loops[loopCounter][1]) {
      $vid.currentTime = loops[loopCounter][1] - 2.9;
      ipc.send('rep');
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

}

