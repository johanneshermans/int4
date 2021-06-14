const five = require('johnny-five');
const board = new five.Board({
    repl: false
});

board.on("ready", () => {
    const led = new five.Led(9);
    led.blink(500);
});