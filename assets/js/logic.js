var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');

function startQuiz() { //starts the quiz
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');

  questionsEl.removeAttribute('class');

  timerId = setInterval(clockTick, 1000);

  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() { //pulls info from the questions object and displays them using a for loop
  var currentQuestion = questions[currentQuestionIndex];

  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title;

  choicesEl.innerHTML = '';

  for (var i = 0; i < currentQuestion.choices.length; i++) {
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = i + 1 + '. ' + choice;

    choicesEl.appendChild(choiceNode);
  }
}

function questionClick(event) { //function that determines correct/incorrect clicks
  var buttonEl = event.target;

  if (!buttonEl.matches('.choice')) {
    return;
  }

  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    time -= 15;

    if (time < 0) {
      time = 0;
    }

    timerEl.textContent = time;

    feedbackEl.textContent = 'Wrong!';
  } else {
    feedbackEl.textContent = 'Correct!';
  }
  
  feedbackEl.setAttribute('class', 'feedback');
  setTimeout(function() { 
    feedbackEl.setAttribute('class', 'feedback hide'); }, 1000);

    currentQuestionIndex++;

    if (time <= 0 || currentQuestionIndex === questions.length) {
      quizEnd();
    } else {
      getQuestion();
    }
}

function quizEnd() { //stops the timer and shows score
  clearInterval(timerId);
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');

  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;

  questionsEl.setAttribute('class', 'hide');
}

function clockTick() { //shows the time ticking in the top right corner
  time--;
  timerEl.textContent = time;

  if (time <= 0) {
    quizEnd();
  }
}

function saveHighScore() { //saves the user's score
  var initials = initialsEl.value.trim();

  if (initials !== '') {
    var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

    var newScore = {
      score: time,
      initials: initials,
    };

    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    window.location.href = 'highscores.html';
  }
}

  function checkforEnter(event) { //press enter to submit score
    if (event.key === 'Enter') {
      saveHighScore();
    }
  }

  submitBtn.onclick = saveHighScore;

  startBtn.onclick = startQuiz;

  choicesEl.onclick = questionClick;

  initialsEl.onkeyup = checkforEnter;