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

generateQuiz(allQuestions, quizContainer, resultsContainer, submitButton);

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

// new quiz engine

const questionsArray = [
    {
        question: `Have you ever heard about the Filter Bubble?`,
        answers: {
            a: `Yes`,
            b: `I'm not sure`,
            c: `Definitely not`
        },
        positive: `a`,
        neutral: `b`,
        negative: `c`
    },
    {
        question: `When you're planning on watching a show or movie on your streaming service, how do you choose (mostly) what movie you want to see?`,
        answers: {
            a: `I actually don't have a streaming service...`,
            b: `I scroll through my feed and watch whatever I know I'll enjoy.`,
            c: `I'll probably search for a specific series of movie that a friend recommended to me.`
        },
        positive: `a`,
        neutral: `c`,
        negative: `b`
    },
    {
        question: `So, what do YOU do when a website asks you to accept cookies?`,
        answers: {
            a: `I just click "Accept".`,
            b: `If possible, I select the information that I'll give them.`,
            c: `I'll always press "Cancel".`
        },
        positive: `c`,
        neutral: `b`,
        negative: `a`
    },
    {
        question: `And how often do you clear your cookies or search history?`,
        answers: {
            a: `Urm... should I do that?`,
            b: `About 1 to 5 times per year.`,
            c: `Certainly more than 5 times each year.`
        },
        positive: `c`,
        neutral: `b`,
        negative: `a`
    },
    {
        question: `Let's take this article for example. A friend has posted it on facebook, where you saw it pop up in your feed. It already has a lot of likes and comments, and quite frankly, you really liked reading that article too, so you want to share it as well. What would you do?`,
        answers: {
            a: `I'll always check multiple other sources before sharing.`,
            b: `I'd just post is without asking many questions.`,
            c: `If I'm questioning the articles plausibility, I'll first do a fact-check.`

        },
        positive: `a`,
        neutral: `c`,
        negative: `b`
    },
    {
        question: `A friend has posted this article on facebook. It already has a lot of likes and comments, however, you strongly disagree. What's going to be your first reaction?`,
        answers: {
            a: `I'll read the comments with an open mind and may leave a comment myself.`,
            b: `I'll roll my eyes and keep on scrolling.`,
            c: `I'll leave an ironic comment and might even unfriend him afterwards.`

        },
        positive: `a`,
        neutral: `b`,
        negative: `c`
    },
    {
        question: `How many different browsers do you use on regular base?`,
        answers: {
            a: `just 1`,
            b: `2`,
            c: `more than 2`

        },
        positive: `c`,
        neutral: `b`,
        negative: `a`
    },
    {
        question: `How often do you watch the news on tv or listen on the radio?`,
        answers: {
            a: `I'll actively go watch the news frequently.`,
            b: `I won't switch channels if it pops up, but I won't go looking for it either.`,
            c: `I avoid having to hear or watch the news.`

        },
        positive: `a`,
        neutral: `b`,
        negative: `c`
    }
];

let questionNumber = 1;
const questionSelector = document.getElementById(`questions`);

const showQuestions = () => {
    for (let i = 0; i < questionsArray.length; i++) {
        console.log(questionsArray[i].question);

        questionSelector.innerHTML += `<p>${questionsArray[i].question}</p>`;

        for (const [key, value] of Object.entries(questionsArray[i].answers)) {
            console.log(`${key}: ${value}`);

            questionSelector.innerHTML += `<div>
            <input type="radio" name="question${i}" value="${i}-${value}">
            <label>${value}</label></div>
            `
        }
    }
};

const init = () => {
    showQuestions();
};

init();