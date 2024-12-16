let users = [];
let currentUser = null;
let currentQuestionIndex = 0;
let examTimer;
let timeRemaining = 600;

const questions = [
    { question: "Complete the same pattern A,B,C,.....?", choices: ["D", "E", "d", "e"], correct: 0 },
    { question: "Complete the same pattern a,b,c,.....?", choices: ["e", "E", "d", "D"], correct: 2 },
    { question: "What is 1 + 1?", choices: ["2", "3", "4", "5"], correct: 0 },
    { question: "What is 1 + 3?", choices: ["2", "3", "4", "5"], correct: 2 },
    { question: "What is 5 - 4?", choices: ["1", "2", "3", "4"], correct: 0 },
];

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

function registerUser() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const newUser = { firstName, lastName, email, password, markedQuestions: [], answers: [] };
    users.push(newUser);
    showPage('signin');
}

function signInUser() {
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        alert('Invalid email or password.');
        return;
    }

    currentUser = user;
    startExam();
    showPage('exam');
}

function startExam() {
    questions.sort(() => Math.random() - 0.5);
    displayQuestion();
    startTimer();
    displayMarkedQuestions();
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.question;

    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';

    question.choices.forEach((choice, index) => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="choice" value="${index}"> ${choice}`;
        choicesDiv.appendChild(label);

        if (currentUser.answers[currentQuestionIndex] === index) {
            label.querySelector('input').checked = true;
        }
    });

    updateMarkButton();
}

function recordAnswer(selectedChoice) {
    currentUser.answers[currentQuestionIndex] = selectedChoice;
}

function nextQuestion() {
    const selectedAnswer = document.querySelector('input[name="choice"]:checked');
    if (selectedAnswer) {
        recordAnswer(parseInt(selectedAnswer.value));
    }

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        alert('This is the last question.');
    }
}

function prevQuestion() {
    const selectedAnswer = document.querySelector('input[name="choice"]:checked');
    if (selectedAnswer) {
        recordAnswer(parseInt(selectedAnswer.value));
    }

    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    } else {
        alert('This is the first question.');
    }
}

function markQuestion() {
    const questionIndex = currentQuestionIndex;

    if (currentUser.markedQuestions.includes(questionIndex)) {
        currentUser.markedQuestions = currentUser.markedQuestions.filter(index => index !== questionIndex);
    } else {
        currentUser.markedQuestions.push(questionIndex);
    }

    updateMarkButton();
    displayMarkedQuestions();
}

function updateMarkButton() {
    const markButton = document.querySelector('button[onclick="markQuestion()"]');
    markButton.textContent = currentUser.markedQuestions.includes(currentQuestionIndex) ? "Unmark" : "Mark";
}

function displayMarkedQuestions() {
    const markedQuestionsDiv = document.getElementById('markedQuestionsList');
    markedQuestionsDiv.innerHTML = '';

    currentUser.markedQuestions.forEach(questionIndex => {
        const questionItem = document.createElement('li');
        questionItem.textContent = `Question ${questionIndex + 1}`;
        questionItem.onclick = () => {
            currentQuestionIndex = questionIndex;
            displayQuestion();
        };
        markedQuestionsDiv.appendChild(questionItem);
    });
}

function submitExam() {
    clearInterval(examTimer);

    let correctAnswers = 0;
    questions.forEach((question, index) => {
        if (currentUser.answers[index] === question.correct) {
            correctAnswers++;
        }
    });

    const resultMessage = correctAnswers >= 3 
        ? `Succeeded! You got ${correctAnswers} out of ${questions.length} correct.` 
        : `Failed! You got ${correctAnswers} out of ${questions.length} correct.`;

    showPage('grades');
    document.getElementById('gradesMessage').textContent = resultMessage;
}

function startTimer() {
    examTimer = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById('time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(examTimer);
            showTimeoutPage();
        }
    }, 1000);
}

function showTimeoutPage() {
    showPage('timeout');
    document.getElementById('timeoutMessage').textContent = `Sorry, ${currentUser.firstName}. Time is up!`;
}
