ipc = require('electron').ipcRenderer;
ipc.on('message', (event, message) => console.log(message));
pixel = require("node-pixel");
const five = require('johnny-five');

const quizContainer = document.getElementById('quiz');
const nothing = document.getElementById('nothing');
let bothPlayers = [];
const scoreOne = []
let playerOne = 0;
const scoreTwo = [];
let playerTwo = 0;
let q = 0;
let showAnswers = false;
let readyToStart1 = false;
let readyToStart2 = false;

let playersReady = [];

let introduceRed = false;
let introduceBlue = false;

let introduceRedTimer = 0;
let introduceBlueTimer = 0;

let introduceRedFilled = 0;
let introduceBlueFilled = 0;

let decRed = false;
let decRedArray = [];

let incRedDecBlue = false;
let incRedDecBlueArray = [];

let decAll = false;

let turnOffStrip = false;

let intro = false;
let introStop = false;


ipc.on('messageFromSecond', (event, message) => {
    showAnswers = true;
    handleQuestions()
});

ipc.on('changeStrip', (event, message) => {
    console.log(message);

    if (message === 'introduceRed') {
        strip.color('#000');
        introduceRed = true;

    } else if (message === 'introduceBlue') {
        introduceBlue = true;

    } else if (message === "decRed") {
        decRed = true;
    } else if (message === "incRedDecBlue") {
        incRedDecBlue = true;
        decRed = false;
    } else if (message === "decAll") {
        decAll = true;
        incRedDecBlue = false;
    } else if (message === "turnOffStrip") {
        turnOffStrip = true;
        decAll = false;
        updateStrip();

    } else if (message === "intro") {
        intro = true;
        console.log('intro');
        for(i = 0; i < 27; i++) {
            strip.pixel(i).color("#1676E1");
            strip.pixel(i + strip.length / 2).color("#1676E1");
        }

        for(i = 54; i < 81; i++) {
            strip.pixel(i).color('#FF0C30');
            strip.pixel(i + strip.length / 2).color("#FF0C30");
        }

        strip.show();
    } else if (message = "introStop") {
        introStop = true;
        intro = false;
    }

});


const allQuestions = [
    {
        question: `Heb je ooit gehoord over de filter bubbel?`,
        answers: {
            A: [`Ja`, 2],
            B: [`Wel eens van gehoord`, 1],
            C: [`Nog nooit`, 0]
        },
    },
    {
        question: `Hoe kies jij welke film, serie of show je gaat kijken?`,
        answers: {
            A: [`Iets onder mijn recommendations`, 0],
            B: [`Iets wat een vriend me heeft aangeraden`, 2],
            C: [`Iets met positieve reviews`, 1]
        },
    },
    {
        question: `Wat doe jij wanneer een website je vraagt hun cookies te accepteren?`,
        answers: {
            A: [`Accepteren`, 0],
            B: [`Opties selecteren`, 2],
            C: [`Weigeren`, 1]
        },
    },
    {
        question: `Wat zou jij doen als je een entertainend, choquerend artikel leest?`,
        answers: {
            A: [`Delen zonder twijfel`, 0],
            B: [`Kijken of de nieuwsbron betrouwbaar lijkt`, 1],
            C: [`Controleren met meerdere bronnen`, 2]
        },
    },
    {
        question: `Wat zou jij doen wanneer een facebook-vriend iets post waar je niet mee akkoord gaat?`,
        answers: {
            A: [`Lezen en reageren met open mind`, 2],
            B: [`Sarcastisch reageren en misschien zelfs blokkeren`, 0],
            C: [`Ogen rollen en verder scrollen`, 1]

        },
    },
    
    {
        question: `Hoe vaak verwijder jij cookies?`,
        answers: {
            A: [`Kan dat dan?`, 0],
            B: [`1 a 5 keer per jaar`, 1],
            C: [`meer dan 5 keer per jaar`, 2]

        },
    }
];


var board = new five.Board({
    repl: false
});
var strip = null;
var ledOne = null;
var ledTwo = null;



const showQuestions = (questions, quizContainer) => {
    const output = [];
    let answers;

    for (let i = 0; i < questions.length; i++) {
        answers = [];
        const answ = questions[i].answers
        for (const letter in answ) {

            answers.push(
                '<label class="question' + letter + '">'
                + '<input type="radio" name="question' + i + '" value="' + letter + '">'
                + questions[i].answers[letter][0]
                + '</label><br>'
            );
        }

        output.push(
            '<div class="questionContainer">' +
            '<div class="question">' + questions[i].question + '</div>'
            + '<div class="answers">' + answers.join('') + '</div>' + '</div>'
        );
    }
    quizContainer.innerHTML = output.join('');
}

const ledOn = (led) => {
    if (led === 'ledOne') {
        ledOne = new five.Led(4);
        ledOne.on();
    } else if (led === 'ledTwo') {
        ledTwo = new five.Led(5);
        ledTwo.on();
    }
}

const ledOff = (led) => {
    if (led === 'ledOne') {
        ledOne = new five.Led(4);
        ledOne.off();
    } else if (led === 'ledTwo') {
        ledTwo = new five.Led(5);
        ledTwo.off();
    }

}

const handleQuestions = () => {
    //console.log('speler 1; ' + playerOne);
    //console.log('speler 2: ' + playerTwo);
    console.log('speler 1: ' + scoreOne)
    console.log('speler 2: ' + scoreTwo)
    //console.log(showAnswers)
    if (showAnswers === false) {
        quizContainer.style.display = "none"
        nothing.style.display = "block"
    } else if (showAnswers === true) {
        if (!bothPlayers.includes(1)) {
            ledOn('ledOne')
        }

        if (!bothPlayers.includes(2)) {
            ledOn('ledTwo');
        }
        console.log(bothPlayers);
        nothing.style.display = "none"
        quizContainer.style.display = "block"
        quizContainer.classList.add("fade-in")
    }
}

const showResults = (questions, key, player) => {
    let singleScore = questions[q].answers[key][1];
    if (player === 1) {
        if (playerOne + singleScore < 0) {
            singleScore = 0;
        }
        scoreOne.push(singleScore)
        playerOne = scoreOne.reduce((a, b) => a + b, 0);

    } else if (player === 2) {
        if (playerTwo + singleScore < 0) {
            singleScore = 0;
        }
        scoreTwo.push(singleScore)
        playerTwo = scoreTwo.reduce((a, b) => a + b, 0);
    }
}


const handleHiddenQuestion = () => {
    const allQuestionsContainers = document.getElementById(`quiz`).childNodes
    if (q == 0) {
        allQuestionsContainers[0].style.display = "block";
    } else if (q > allQuestions.length - 1) {
        const oldQ = q - 1;
        allQuestionsContainers[oldQ].style.display = "none";
        console.log("end")
    } else {
        const oldQ = q - 1;
        allQuestionsContainers[oldQ].style.display = "none";
        allQuestionsContainers[q].style.display = "block";
    }
}

handleQuestions()
showQuestions(allQuestions, quizContainer);

if (q == 0) {
    handleHiddenQuestion()
}

const checkBothPlayers = (player, key) => {
    const existsKey = bothPlayers.includes(player);
    if (existsKey == false) {
        bothPlayers.push(player);
        //checkButton(key)
        showResults(allQuestions, key, player);
    }
    const pOne = bothPlayers.includes(1)
    const pTwo = bothPlayers.includes(2);

    console.log(bothPlayers);
    if (pOne) {
        ledOff('ledOne');
    }
    if (pTwo) {
        ledOff('ledTwo');
    }
    if (pOne && pTwo) {
        bothPlayers = [];
        showAnswers = false;
        handleQuestions();
        q++
        handleHiddenQuestion();
        ipc.send('reply');
        updateStrip();
    }
}


//VARIABELEN
const aantalPunten = allQuestions.length * 2;
console.log('Aantal punten die kunnen behaald worden: ' + aantalPunten);

// blauwe ledjes die nu branden
let usedLedsBlue = [];

// rode ledjes die nu branden
let usedLedsRed = [];

const updateStrip = () => {
    console.log('updated');
    strip.color('#000000');
    const splitLength = strip.length / 2;
    //console.log('Lengte van de halve strip: ' + splitLength);
    const partLength = splitLength / aantalPunten;
    //console.log('Aantal te winnen pixels voor 1 punt: ' + partLength);

    //totaal aantal ledjes van speler 1 die moeten branden
    const lengthScore1 = Math.round(partLength * playerOne);
    //console.log('Totaal aantal ledjes van speler 1 die moeten branden: ' + lengthScore1);

    //totaal aantal ledjes van speler 2 die moeten branden
    const lengthScore2 = Math.round(partLength * playerTwo);
    //console.log('totaal aantal ledjes van speler 2 die moeten branden: ' + lengthScore2);

    if (lengthScore1 > usedLedsRed.length) {
        const loopTimes = usedLedsRed.length
        for (let i = 0; i < lengthScore1 - loopTimes; i++) {
            const randomInt = Math.floor(Math.random() * splitLength);
            if (!usedLedsRed.includes(randomInt)) {
                usedLedsRed.push(randomInt);
            } else {
                i = i - 1;
            }
        }
    } else if (lengthScore1 < usedLedsRed.length) {
        for (let i = 0; i < usedLedsRed.length - lengthScore1; i++) {
            const randomInt = Math.floor(Math.random() * (usedLedsRed.length - 1));
            strip.pixel(usedLedsRed[randomInt]).color('#000');
            usedLedsRed.splice(randomInt, 1);
        }
    }

    //console.log('Rode lichtjes die nu branden: ' + usedLedsRed);
    //console.log('Aantal rode lichtjes die nu branden: ' + usedLedsRed.length);
    for (i = 0; i < splitLength; i++) {
        if (usedLedsRed.includes(i)) {
            strip.pixel(i).color('#FF0C30');
        } else {
            strip.pixel(i).color('#000');
        }
    }

    if (lengthScore2 > usedLedsBlue.length) {
        const loopTimes = usedLedsBlue.length
        for (let i = 0; i < lengthScore2 - loopTimes; i++) {
            const randomInt = Math.floor((Math.random() * splitLength) + splitLength);
            if (!usedLedsBlue.includes(randomInt)) {
                usedLedsBlue.push(randomInt);
            } else {
                i = i - 1;
            }
        }
    } else if (lengthScore2 < usedLedsBlue.length) {
        for (let i = 0; i < usedLedsBlue.length - lengthScore2; i++) {
            const randomInt = Math.floor(Math.random() * (usedLedsBlue.length - 1));
            strip.pixel(usedLedsBlue[randomInt]).color('#000');
            usedLedsBlue.splice(randomInt, 1);

        }
    }
    //console.log('Blauwe lichtjes die nu branden: ' + usedLedsBlue);
    //console.log('Aantal blauwe lichtjes die nu branden: ' + usedLedsBlue.length);
    for (i = splitLength + 1; i < splitLength * 2; i++) {
        if (usedLedsBlue.includes(i)) {
            strip.pixel(i).color('#1676E1');
        } else {
            strip.pixel(i).color('#000');
        }
    }
    strip.show();


}

const checkBothPlayersReady = () => {
    if (playersReady.includes(1)) {
        console.log('one pressed');
       
        ipc.send('startExp', 'readyOne')

    }

    if (playersReady.includes(2)) {
        console.log('two pressed');
        
        ipc.send('startExp', 'readyTwo')
    }

    if(playersReady.includes(1) && playersReady.includes(2)) {
        playersReady = [];
        const $readyText = document.querySelector(`.to-start`);
        $readyText.style.display = "none";
        ipc.send('startExp', 'startItUp')
    }
}

//BOARD
board.on("ready", function () {
    let happendOne = false
    let happendTwo = false


    ledOn('ledOne');
    ledOn('ledTwo');

    var pinOne = new five.Pin({
        pin: "A1"
    });

    var pinTwo = new five.Pin({
        pin: "A2"
    });

    pinOne.read(function (error, value) {
        if (showAnswers) {
            if (value > 600 && value < 750 && !bothPlayers.includes(1)) {
                console.log("yellowOne");
                happendOne = true;
                checkBothPlayers(1, "B");
                //setTimeout(() => { happendOne = false }, 1000);
            } else if (value > 300 && value < 400 && !bothPlayers.includes(1)) {
                console.log("blueOne");
                happendOne = true;
                checkBothPlayers(1, "C");
                //setTimeout(() => { happendOne = false }, 1000);
            }
            else if (value > 1000 && value < 1500 && !bothPlayers.includes(1)) {
                console.log("redOne");
                happendOne = true;
                checkBothPlayers(1, "A");
                //setTimeout(() => { happendOne = false }, 1000);
            }
        } else if (!readyToStart1) {
            if ((value > 600 && value < 750) || (value > 300 && value < 400) || (value > 1000 && value < 1500)) {
                ledOff('ledOne');
                readyToStart1 = true;
                console.log("player 1 ready");
                playersReady.push(1);
                checkBothPlayersReady();
            } 
        }
    });

    pinTwo.read(function (error, value) {
        if (showAnswers) {
            if (value > 600 && value < 750 && !bothPlayers.includes(2)) {
                console.log("yellowT");
                happendTwo = true;
                checkBothPlayers(2, "B");
                //setTimeout(() => { happendTwo = false }, 1000);
            } else if (value > 300 && value < 400 && !bothPlayers.includes(2)) {
                console.log("blueT");
                happendTwo = true;
                checkBothPlayers(2, "C");
                //setTimeout(() => { happendTwo = false }, 1000);
            }
            else if (value > 950 && value < 1500 && !bothPlayers.includes(2)) {
                console.log("redT");
                happendTwo = true;
                checkBothPlayers(2, "A");
                //setTimeout(() => { happendTwo = false }, 1000);
            }
        } else if (!readyToStart2) {
            if ((value > 600 && value < 750) || (value > 300 && value < 400) || (value > 1000 && value < 1500)) {
                ledOff('ledTwo');
                readyToStart2 = true;
                console.log("player 2 ready");
                playersReady.push(2);
                checkBothPlayersReady();
            }
        }
    });




    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [{ pin: 7, length: 216 },],
        gamma: 2.8,
    });



    const splitLength = strip.length / 2;
    console.log(splitLength);

    const partLength = Math.round(splitLength / aantalPunten);
    const lengthScore1 = partLength * playerOne;
    const lengthScore2 = partLength * playerTwo;

    // Just like DOM-ready for web developers.
    strip.on("ready", function () {

        //gespleten
        /*for (let i = 0; i < splitLength; i++) {
            if (i > splitLength - lengthScore1) {
                strip.pixel(i).color('#FF0C30');
            } else {
                strip.pixel(i).color('#000');
            }
        }

        for (let i = splitLength; i < (splitLength * 2); i++) {
            if (i < lengthScore2 + splitLength) {
                strip.pixel(i).color('#1676E1');
            } else {
                strip.pixel(i).color('#000');
            }
        }*/
        strip.color('#000');
        strip.show();
    });

});

const drawloop = () => {

    if (introduceRed && introduceRedFilled < 1) {
        let splitLength = strip.length / 2;
        introduceRedTimer++;

        strip.pixel(introduceRedTimer).color('#FF0C30');
        if (introduceRedTimer > splitLength - 2) {
            introduceRedTimer = 0;
            introduceRedFilled++

            if (introduceRedFilled < 1) {
                for (i = 0; i < splitLength - 1; i++) {
                    strip.pixel(i).color('#000');
                }
            }
        }

        strip.show();

    }

    if (introduceBlue && introduceBlueFilled < 1) {
        let splitLength = strip.length / 2;
        introduceBlueTimer++;

        strip.pixel(strip.length - introduceBlueTimer).color('#1676E1');
        if (introduceBlueTimer > splitLength -1) {
            introduceBlueTimer = 0;
            introduceBlueFilled++

            if (introduceBlueFilled < 1) {
                for (i = 0; i < splitLength; i++) {
                    strip.pixel(i + splitLength).color('#000');
                }
            }
        }


        strip.show();

    }

    if (decRed && decRedArray.length < strip.length / 2) {

        for (i = 0; i < 3; i++) {
            const randomInt = Math.floor(Math.random() * strip.length / 2);
            if (!decRedArray.includes(randomInt)) {
                strip.pixel(randomInt).color('#000');
                decRedArray.push(randomInt);
            }
        }

        strip.show();
    }

    if (incRedDecBlue && incRedDecBlueArray.length < strip.length / 2) {
        for (i = 0; i < 2; i++) {

            const randomInt = Math.floor(Math.random() * strip.length / 2);
            if (!incRedDecBlueArray.includes(randomInt)) {
                strip.pixel(strip.length - 1 - randomInt).color('#000');
                incRedDecBlueArray.push(randomInt);
                strip.pixel(randomInt).color('#FF0C30')
            }
        }
        strip.show();
    }

    if (decAll) {
        for (i = 0; i < 2; i++) {
        const randomInt = Math.floor(Math.random() * strip.length / 2);
        strip.pixel(randomInt).color('#000');
        strip.pixel(randomInt * 2).color('#000');
        }
        strip.show();
    }

    if (turnOffStrip) {
        turnOffStrip = false;
        strip.color('#000');
        strip.show();
    }

    if (introStop) {
        introStop = false;
        strip.color('#000');
        strip.show();
    }

    if(intro) {
        strip.shift(1, pixel.FORWARD, true);
        strip.show();
    }

    window.requestAnimationFrame(drawloop);
}

drawloop();
