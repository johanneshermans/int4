// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//const serialport = require('serialport')

const ipc = require('electron').ipcRenderer;
const openSecondWindowButton = document.getElementById('open-second-window');
const $vid = document.querySelector(`.video`);
const loops = [[true, 29], [true, 79], [true, 110], [true, 120], [true, 130], [true, 140], [true, 150], [true, 160]];
let loopCounter = 0;


ipc.on('messageFromMain', (event, message) => {
  console.log(message)
  loops[loopCounter][0] = false
  loopCounter++
  console.log(loopCounter)
});

openSecondWindowButton.addEventListener('click', (event) => {
  ipc.send('rep', `back`);
});

const drawLoop = (bool) => {
  const vidTime = $vid.currentTime;
  console.log(loops[loopCounter][0])
  if (loops[loopCounter][0]) {
    if (vidTime > loops[loopCounter][1]) {

      $vid.currentTime = loops[loopCounter][1] - 2.9;
      ipc.send('rep');
    }
  }

  window.requestAnimationFrame(drawLoop);
}


const init = () => {
  drawLoop();
}

init()

