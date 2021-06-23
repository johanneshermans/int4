// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//const serialport = require('serialport')

const ipc = require('electron').ipcRenderer;
const $vid = document.querySelector(`.video`);
const loops = [[true, 29], [true, 79], [true, 110], [true, 120], [true, 130], [true, 140], [true, 150], [true, 160]];
const audioPlays = [false, false, false];
let vidTime = 0;
let loopCounter = 0;
let introDone = false;
let startVideo = false
let introAudio;

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
      startVideo = true;
      startAudio();
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

  if (introAudio.paused) {
    if (!introDone) {
      introDone = true;
      $vid.play();
      const audio = new Audio(`static/main${loopCounter + 1}.wav`);
      audio.play();
    }
  }
  if (loops[loopCounter][0]) {
    if (vidTime > loops[loopCounter][1]) {

      $vid.currentTime = loops[loopCounter][1] - 2.9;
      ipc.send('rep');
    }
  }

  if (loopCounter > 0) {
    if (vidTime > loops[loopCounter - 1][1] + 1.5 && !audioPlays[loopCounter]) {
      console.log('done');
      audioPlays[loopCounter] = true;
      const audio = new Audio(`static/main${loopCounter + 1}.wav`);
      audio.play();
    }
  }
  window.requestAnimationFrame(drawLoop);
}

const checkTime = () => {
  
  // INTRODUCTION FIRST RED THEN BLUE
  if(vidTime > 0 && introStop) {
    introStop = false;
    ipc.send('changeStrip', 'introStop')
  }
  
  if(vidTime > 2 && introduceRed) {
    introduceRed = false;
    ipc.send('changeStrip', 'introduceRed');
  }
  
  
  if (vidTime > 4 && introduceBlue) {
    introduceBlue = false;
    ipc.send('changeStrip', "introduceBlue");
  } 

  if (vidTime > 7 && decRed) {
    decRed = false;
    ipc.send('changeStrip', 'decRed');
  }

  if(vidTime > 9 && incRedDecBlue) {
    incRedDecBlue = false;
    ipc.send('changeStrip', 'incRedDecBlue');
  }

  if (vidTime > 11 && decAll) {
    decAll = false;
    ipc.send('changeStrip', 'decAll');
  }

  if(vidTime > 13 && turnOffStrip) {
    turnOffStrip = false;
    ipc.send('changeStrip', 'turnOffStrip')
  }

}

const startAudio = () => {
  introAudio = new Audio(`static/intro.wav`);
  introAudio.play();
}


const init = () => {
  
  /*document.addEventListener('keydown', function (event) {
    
    console.log(event.keyCode)
    if (event.keyCode == 32 && !startVideo) {
      startVideo = true;
      startAudio();
      drawLoop();
    }
  });*/

}

init()

