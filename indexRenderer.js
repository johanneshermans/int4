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
let endingIntroduceRed = true;

ipc.on('messageFromMain', (event, message) => {
  console.log(message)
  loops[loopCounter][0] = false
  loopCounter++
  console.log(loopCounter)
});


const drawLoop = () => {
  drawLoopCounter++;
  vidTime = $vid.currentTime;

  console.log(drawLoopCounter);

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
  if(vidTime > 40 && introduceRed) {
    introduceRed = false;
    ipc.send('changeStrip', 'introduceRed');
  } else if (vidTime > 50 && endingIntroduceRed) {
    endingIntroduceRed = false;
    ipc.send('changeStrip', "endingIntroduceRed");
  }
}

const startAudio = () => {
  introAudio = new Audio(`static/intro.wav`);
  introAudio.play();
}


const init = () => {
  startVideo = true;
  startAudio();
  drawLoop();
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

