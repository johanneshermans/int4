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
		if (vidTime > 3.8 && vidTime < 3.9) {
			$vid.currentTime = 2.8;
			ipc.send('rep');
		}
	}

	window.requestAnimationFrame(drawLoop);
}


const init = () => {
	drawLoop();
}

init()
