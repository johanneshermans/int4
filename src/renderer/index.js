require('./style.css');

pixel = require("node-pixel");
five = require("johnny-five");

const allQuestions = [
    {
        question: `Have you ever heard about the Filter Bubble?`,
        answers: {
            A: [`Yes`, 1],
            B: [`I'm not sure`, 0],
            C: [`Definitely not`, -1]
        },
    },
    {
        question: `When you're planning on watching a show or movie on your streaming service, how do you choose (mostly) what movie you want to see?`,
        answers: {
            A: [`I actually don't have a streaming service...`, 1],
            B: [`I scroll through my feed and watch whatever I know I'll enjoy.`, -1],
            C: [`I'll probably search for a specific series of movie that a friend recommended to me.`, 1]
        },
    },
    {
        question: `So, what do YOU do when a website asks you to accept cookies?`,
        answers: {
            A: [`I just click "Accept".`, -1],
            B: [`If possible, I select the information that I'll give them.`, 0],
            C: [`I'll always press "Cancel".`, 1]
        },
    },
    {
        question: `And how often do you clear your cookies or search history?`,
        answers: {
            A: [`Urm... should I do that?`, -1],
            B: [`About 1 to 5 times per year.`, 0],
            C: [`Certainly more than 5 times each year.`, 1]
        },
    },
    {
        question: `Let's take this article for example. A friend has posted it on facebook, where you saw it pop up in your feed. It already has a lot of likes and comments, and quite frankly, you really liked reading that article too, so you want to share it as well. What would you do?`,
        answers: {
            A: [`I'll always check multiple other sources before sharing.`, 1],
            B: [`I'd just post it without asking many questions.`, -1],
            C: [`If I'm questioning the articles plausibility, I'll first do a fact-check.`, 0]

        },
    },
    {
        question: `A friend has posted this article on facebook. It already has a lot of likes and comments, however, you strongly disagree. What's going to be your first reaction?`,
        answers: {
            A: [`I'll read the comments with an open mind and may leave a comment myself.`, 1],
            B: [`I'll roll my eyes and keep on scrolling.`, 0],
            C: [`I'll leave an ironic comment and might even unfriend him afterwards.`, -1]

        },
    },
    {
        question: `How many different browsers do you use on regular base?`,
        answers: {
            A: [`just 1`, -1],
            B: [`2`, 0],
            C: [`more than 2`, 1]

        },
    },
    {
        question: `How often do you watch the news on tv or listen on the radio?`,
        answers: {
            A: [`I'll actively go watch the news frequently.`, 1],
            B: [`I won't switch channels if it pops up, but I won't go looking for it either.`, 0],
            C: [`I avoid having to hear or watch the news.`, -1],
        },
    }
];

let bothPlayers = [];
const scoreOne = []
let playerOne = 0;
const scoreTwo = [];
let playerTwo = 0;
let q = 0

const quizContainer = document.getElementById('quiz');

const showQuestions = (questions, quizContainer) => {
    const output = [];
    let answers;

    for (let i = 0; i < questions.length; i++) {
        answers = [];
        for (letter in questions[i].answers) {

            answers.push(
                '<label>'
                + '<input type="radio" name="question' + i + '" value="' + letter + '"><br>'
                + letter + ': '
                + questions[i].answers[letter][0]
                + '</label>'
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


const showResults = (questions, key, player) => {
    const singleScore = questions[q].answers[key][1];
    if (player === 1) {
        scoreOne.push(singleScore)
        playerOne = scoreOne.reduce((a, b) => a + b, 0);
        if(playerOne < 0) {
            playerOne = 0;
        }
    } else if (player === 2) {
        scoreTwo.push(singleScore)
        playerTwo = scoreTwo.reduce((a, b) => a + b, 0);
        if(playerTwo < 0) {
            playerTwo = 0;
        }
    }
    console.log(playerOne)
    console.log(playerTwo)
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
        console.log("twee")
        bothPlayers = [];
        q++
        handleHiddenQuestion();
        updateStrip();
    }
}

const checkButton = (event) => {
    if (event == 65) {
        showResults(allQuestions, "A", 1);
    }
    else if (event == 90) {
        showResults(allQuestions, "B", 1);
    }
    else if (event == 69) {
        showResults(allQuestions, "C", 1);
    }
    else if (event == 81) {
        showResults(allQuestions, "A", 2);
    }
    else if (event == 83) {
        showResults(allQuestions, "B", 2);
    }
    else if (event == 68) {
        showResults(allQuestions, "C", 3);
    }
}



//_____________________________________________________________________________________________________________________________________________

const rgbToHex = (rgb) => {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

var board = new five.Board({
    repl: false
});
var strip = null;

//VARIABELEN
const aantalVragen = 7;


const updateStrip = () => {
    const splitLength = strip.length / 2;
    console.log('yes');

    const partLength = Math.round(splitLength / aantalVragen);
    const lengthScore1 = partLength * playerOne;
    const lengthScore2 = partLength * playerTwo;

    let rgbScore1 = Math.round((255 / aantalVragen) * playerOne);
    let rgbScore2 = Math.round((255 / aantalVragen) * playerTwo);
    let hexString1 = rgbToHex(rgbScore1);
    let hexString2 = rgbToHex(rgbScore2);

    //gespleten
    for (let i = 0; i < splitLength; i++) {
        if (i > splitLength - lengthScore1) {
            strip.pixel(i).color('#F00');
        } else {
            strip.pixel(i).color('#000');
        }
    }

    for (let i = splitLength; i < (splitLength * 2); i++) {
        if (i < lengthScore2 + splitLength) {
            strip.pixel(i).color('#00F');
        } else {
            strip.pixel(i).color('#000');
        }
    }

    //Algemeen gemiddeld kleur
    strip.color('#' + hexString1 + '00' + hexString2);
    console.log('#' + hexString1 + '00' + hexString2);

    strip.show();

}

//BOARD
board.on("ready", function () {
    // Define our hardware.
    // It's a 12px ring connected to pin 6.
    
    bumper = new five.Button(5);
    console.log(bumper);

    bumper.on("hit", function () {

        console.log('hit');

    }).on("release", function () {
        console.log('release');

    });


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
        /*for(let i = 0; i<216; i++) {
            if(i % 2 === 0){
                strip.pixel(i).color('#F00');
            } else if(i % 2 === 1){
                strip.pixel(i).color('#00F');
            } else if(i % 3 === 2){
                strip.pixel(i).color('#FF8800');
            }
        }*/
        // Set the entire strip to pink.

        //gespleten
        for(let i=0; i<splitLength; i++) {
            if(i > splitLength-lengthScore1) {
                strip.pixel(i).color('#F00');
            } else {
                strip.pixel(i).color('#000');
            }
        }

        for(let i=splitLength; i<(splitLength*2); i++) {
            if(i < lengthScore2+splitLength) {
                strip.pixel(i).color('#00F');
            } else {
                strip.pixel(i).color('#000');
            }
        }

        //Algemeen gemiddeld kleur
        //strip.color('#' + hexString1 + '00' + hexString2);

        strip.show();
    });

});

//________________________________________________________________________________________________________________________________________________

const init = () => {
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 65 || event.keyCode == 90 || event.keyCode == 69) {
            checkBothPlayers(1, event.keyCode);
        } else if (event.keyCode == 81 || event.keyCode == 83 || event.keyCode == 68) {
            checkBothPlayers(2, event.keyCode);
        }
    });
}

init()
