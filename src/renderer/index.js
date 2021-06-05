require('./style.css');

const allQuestions = [
    {
        question: "What is 10/2?",
        answers: {
            A: ['3', -1],
            B: ['5', 0],
            C: ['115', 1]
        },
    },
    {
        question: "What is 30/3?",
        answers: {
            A: ['3', -1],
            B: ['5', 0],
            C: ['115', 1]
        },

    }
];

let playerOne = 0;
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
                + '<input type="radio" name="question' + i + '" value="' + letter + '">'
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


const showResults = (questions, key) => {
    console.log(key)
    const score = []
    const singleScore = questions[q].answers[key][1];
    score.push(singleScore)
    console.log(score.reduce((a, b) => a + b, 0))
    q++
    console.log(q);
    handleHiddenQuestion()
}


const handleHiddenQuestion = () => {
    const allQuestionsContainers = document.getElementById(`quiz`).childNodes
    console.log(allQuestionsContainers)

    if (q == 0) {
        allQuestionsContainers[0].style.display = "block";
    } else {
        const oldQ = q - 1;
        console.log(oldQ)
        allQuestionsContainers[oldQ].style.display = "none";
        allQuestionsContainers[q].style.display = "block";
    }

}


showQuestions(allQuestions, quizContainer);
if (q == 0) {
    handleHiddenQuestion()
}
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) {
        showResults(allQuestions, "A");
    }
    else if (event.keyCode == 66) {
        showResults(allQuestions, "B");
    }
    else if (event.keyCode == 67) {
        showResults(allQuestions, "C");
    }
});

