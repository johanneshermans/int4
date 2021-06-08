const allQuestions = [
    {
        question: "What is 10/2?",
        answers: {
            a: '3',
            b: '5',
            c: '115'
        },
        correctAnswer: 'b'
    },
    {
        question: "What is 30/3?",
        answers: {
            a: '3',
            b: '5',
            c: '10'
        },
        correctAnswer: 'c'
    }
];

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');

generateQuiz(myQuestions, quizContainer, resultsContainer, submitButton);

function generateQuiz(questions, quizContainer, resultsContainer, submitButton) {

    function showQuestions(questions, quizContainer) {
        // we'll need a place to store the output and the answer choices
        var output = [];
        var answers;

        // for each question...
        for (var i = 0; i < questions.length; i++) {

            // first reset the list of answers
            answers = [];

            // for each available answer...
            for (letter in questions[i].answers) {

                // ...add an html radio button
                answers.push(
                    '<label>'
                    + '<input type="radio" name="question' + i + '" value="' + letter + '">'
                    + letter + ': '
                    + questions[i].answers[letter]
                    + '</label>'
                );
            }

            // add this question and its answers to the output
            output.push(
                '<div class="question">' + questions[i].question + '</div>'
                + '<div class="answers">' + answers.join('') + '</div>'
            );
        }

        // finally combine our output list into one string of html and put it on the page
        quizContainer.innerHTML = output.join('');
    }


    function showResults(questions, quizContainer, resultsContainer) {

        // gather answer containers from our quiz
        var answerContainers = quizContainer.querySelectorAll('.answers');

        // keep track of user's answers
        var userAnswer = '';
        var numCorrect = 0;

        // for each question...
        for (var i = 0; i < questions.length; i++) {

            // find selected answer
            userAnswer = (answerContainers[i].querySelector('input[name=question' + i + ']:checked') || {}).value;

            // if answer is correct
            if (userAnswer === questions[i].correctAnswer) {
                // add to the number of correct answers
                numCorrect++;

                // color the answers green
                answerContainers[i].style.color = 'lightgreen';
            }
            // if answer is wrong or blank
            else {
                // color the answers red
                answerContainers[i].style.color = 'red';
            }
        }

        // show number of correct answers out of total
        resultsContainer.innerHTML = numCorrect + ' out of ' + questions.length;
    }

    // show questions right away
    showQuestions(questions, quizContainer);

    // on submit, show results
    submitButton.onclick = function () {
        showResults(questions, quizContainer, resultsContainer);
    }

}


pixel = require("node-pixel");
five = require("johnny-five");


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

board.on("ready", function () {
    // Define our hardware.
    // It's a 12px ring connected to pin 6.
    led = new five.Led(4);
    led.off()
    bumper = new five.Button(5);
    console.log(bumper);
    led = new five.Led(4);

  bumper.on("hit", function() {

    console.log('hit');

  }).on("release", function() {
    led.off();
    console.log('release');

  });


    const aantalVragen = 7;
    const score1 = 3;
    const score2 = 5;

    const rgbScore1 = Math.round((255/aantalVragen)*score1);
    const rgbScore2 = Math.round((255/aantalVragen)*score2);

    const hexString1 = rgbToHex(rgbScore1);
    const hexString2 = rgbToHex(rgbScore2);


    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [{ pin: 7, length: 216 },],
        gamma: 2.8,
    });
    console.log(strip);

    const splitLength = strip.length/2;
    console.log(splitLength);

    const partLength = Math.round(splitLength/aantalVragen);
    const lengthScore1 = partLength*score1;
    const lengthScore2 = partLength*score2;

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
        /*for(let i=0; i<splitLength; i++) {
            console.log(i);
            if(i > splitLength-lengthScore1) {
                strip.pixel(i).color('#F00');
            }
        }

        for(let i=splitLength; i<(splitLength*2); i++) {
            console.log(i);
            if(i < lengthScore2+splitLength) {
                strip.pixel(i).color('#00F');
            }
        }*/

        //Algemeen gemiddeld kleur
        strip.color('#' + hexString1 + '00' + hexString2);

        strip.off();
    });

});