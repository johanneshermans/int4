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


ipc.on('messageFromSecond', (event, message) => {
    showAnswers = true;
    handleQuestions()
});



const allQuestions = [
    {
        question: `Have you ever heard about the Filter Bubble?`,
        answers: {
            A: [`Ja`, 1],
            B: [`Wel eens van gehoord`, 0],
            C: [`Nog nooit`, -1]
        },
    },
    {
        question: `When you're planning on watching a show or movie on your streaming service, how do you choose (mostly) what movie you want to see?`,
        answers: {
            A: [`Iets onder mijn recommendations`, -1],
            B: [`Iets wat een vriend me heeft aangeraden`, 1],
            C: [`Iets met positieve reviews`, 1]
        },
    },
    {
        question: `So, what do YOU do when a website asks you to accept cookies?`,
        answers: {
            A: [`Accepteren`, -1],
            B: [`Opties selecteren`, 0],
            C: [`Weigeren`, 1]
        },
    },
    {
        question: `And how often do you clear your cookies or search history?`,
        answers: {
            A: [`Delen zonder twijfel`, -1],
            B: [`Kijken of de nieuwsbron betrouwbaar lijkt`, 0],
            C: [`Controleren met meerdere bronnen`, 1]
        },
    },
    {
        question: `Let's take this article for example. A friend has posted it on facebook, where you saw it pop up in your feed. It already has a lot of likes and comments, and quite frankly, you really liked reading that article too, so you want to share it as well. What would you do?`,
        answers: {
            A: [`Lezen en reageren met open mind`, 1],
            B: [`Sarcastisch reageren en misschien zelfs blokkeren`, -1],
            C: [`Ogen rollen en verder scrollen`, 0]

        },
    },
    {
        question: `A friend has posted this article on facebook. It already has a lot of likes and comments, however, you strongly disagree. What's going to be your first reaction?`,
        answers: {
            A: [`Zo goed als altijd`, 1],
            B: [`Af en toe wel eens`, 0],
            C: [`Nog nooit van gehoord`, -1]

        },
    },
    {
        question: `How many different browsers do you use on regular base?`,
        answers: {
            A: [`Kan dat dan?`, -1],
            B: [`1 a 5 keer per jaar`, 0],
            C: [`meer dan 5 keer per jaar`, 1]

        },
    }
];


/* const board = new five.Board({
    repl: false
});

board.on("ready", function () {
    // Define our hardware.
    // It's a 12px ring connected to pin 6.
    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [{ pin: 7, length: 216 }],
        gamma: 2.8,
    });

    // Just like DOM-ready for web developers.
    strip.on("ready", function () {
        strip.color('#FF0C30');
        strip.show();
    });
}); */



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

const handleQuestions = () => {
    console.log('speler 1; ' + playerOne);
    console.log('speler 2: ' + playerTwo)
    console.log(showAnswers)
    if (showAnswers === false) {
        quizContainer.style.display = "none"
        nothing.style.display = "block"
    } else if (showAnswers === true) {
        nothing.style.display = "none"
        quizContainer.style.display = "block"
        quizContainer.classList.add("fade-in")
    }
}

const showResults = (questions, key, player) => {
    const singleScore = questions[q].answers[key][1];
    if (player === 1) {
        scoreOne.push(singleScore)
        playerOne = scoreOne.reduce((a, b) => a + b, 0);
        if (playerOne < 0) {
            playerOne = 0;
        }
    } else if (player === 2) {
        scoreTwo.push(singleScore)
        playerTwo = scoreTwo.reduce((a, b) => a + b, 0);
        if (playerTwo < 0) {
            playerTwo = 0;
        }
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
        checkButton(key)
    }
    const pOne = bothPlayers.includes(1)
    const pTwo = bothPlayers.includes(2);
    if (pOne === true && pTwo === true) {
        bothPlayers = [];
        showAnswers = false;
        handleQuestions();
        q++
        handleHiddenQuestion();
        ipc.send('reply');
        updateStrip();
    }
}

const checkButton = (event) => {
    if (event == 75) {
        showResults(allQuestions, "A", 1);
    }
    else if (event == 76) {
        showResults(allQuestions, "B", 1);
    }
    else if (event == 77) {
        showResults(allQuestions, "C", 1);
    }
    else if (event == 81) {
        showResults(allQuestions, "A", 2);
    }
    else if (event == 83) {
        showResults(allQuestions, "B", 2);
    }
    else if (event == 68) {
        showResults(allQuestions, "C", 2);
    }
}


var board = new five.Board({
    repl: false
});
var strip = null;

//VARIABELEN
const aantalVragen = 7;
let usedLedsBlue = [];
let usedLedsRed = [];


const updateStrip = () => {
    strip.color('#000000');

    console.log(playerOne);
    console.log(playerTwo);
    const splitLength = strip.length / 2;

    const partLength = Math.round(splitLength / aantalVragen);
    const lengthScore1 = partLength * playerOne;
    const lengthScore2 = partLength * playerTwo;

    if (lengthScore1 > usedLedsRed.length) {
        const loopTimes = usedLedsRed.length;
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
    usedLedsRed.forEach(element => {
        strip.pixel(element).color('#FF0C30');
    });

    if (lengthScore2 > usedLedsBlue.length) {
        const loopTimes = usedLedsBlue.length
        for (let i = 0; i < lengthScore1 - loopTimes; i++) {
            const randomInt = Math.floor(Math.random() * splitLength + splitLength);
            if (!usedLedsBlue.includes(randomInt)) {
                usedLedsBlue.push(randomInt);
            } else {
                i = i - 1;
            }
        }
    } else if (lengthScore2 < usedLedsBlue.length) {
        for (let i = 0; i < usedLedsBlue.length - lengthScore1; i++) {
            const randomInt = Math.floor(Math.random() * (usedLedsBlue.length - 1));
            strip.pixel(usedLedsBlue[randomInt]).color('#000');
            usedLedsBlue.splice(randomInt, 1);

        }
    }
    usedLedsBlue.forEach(element => {
        strip.pixel(element).color('#1676E1');
    });
    strip.show();


}

//BOARD
board.on("ready", function () {

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [{ pin: 7, length: 216 },],
        gamma: 2.8,
    });

    const splitLength = strip.length / 2;
    console.log(splitLength);

    const partLength = Math.round(splitLength / aantalVragen);
    const lengthScore1 = partLength * playerOne;
    const lengthScore2 = partLength * playerTwo;

    // Just like DOM-ready for web developers.
    strip.on("ready", function () {

        //gespleten
        for (let i = 0; i < splitLength; i++) {
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
        }
        strip.color('#ff0066');
        strip.show();
    });

});

const init = () => {
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 75 || event.keyCode == 76 || event.keyCode == 77) {
            checkBothPlayers(2, event.keyCode);
        } else if (event.keyCode == 81 || event.keyCode == 83 || event.keyCode == 68) {
            checkBothPlayers(1, event.keyCode);
        }
    });
}
init()
