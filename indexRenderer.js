// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//const serialport = require('serialport')

const ipc = require('electron').ipcRenderer;
const openSecondWindowButton = document.getElementById('open-second-window');
const $vid = document.querySelector(`.video`);
let loop = true

ipc.on('messageFromMain', (event, message) => {
  console.log(message)
  loop = false
});

openSecondWindowButton.addEventListener('click', (event) => {
  ipc.send('rep', `back`);
});

const drawLoop = (bool) => {

  const vidTime = $vid.currentTime;
  if (loop) {
    console.log(vidTime)
    if (vidTime > 79) {

      $vid.currentTime = 76;
      ipc.send('rep');
    }
  }

  window.requestAnimationFrame(drawLoop);
}


const init = () => {
  drawLoop();
}

init()

