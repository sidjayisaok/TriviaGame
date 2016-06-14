//some of this code was forked from various open-sources with //contribution from me

  (function(){
//set up our questions as objects	  
var questions = [
{
  question: "Who invented Android?",
  choices: ["Bill Gates", "Andy Rubin", "Steve Jobs", "Peter Thiel", "Sergey Brin"],
  answers: 1
},
{
  question: "Who invented Linux?",
  choices: ["Daniel Ek", "Mark Shuttleworth", "Steve Jobs", "Bill Gates", "Linus Torvalds"],
  answers: 4
},
{
  question: "What year was Microsoft founded?",
  choices: [1972, 1973, 1974, 1975, 1976],
  answers: 3
},
{
  question: "What year did Microsoft bail out Apple?",
  choices: [1996, 1997, 1998, 1999, 2000],
  answers: 1
},
{
  question: "What does FOSS stand for?",
  choices: ["Free Open Source System", "Free Operating System Source", "Free Open System Standard",
  "Friendly Operating System Standards", "Free Open Source Software"],
  answers: 4
},
{
  question: "What does RIM mean?",
  choices: ["Registered Industrial Machines", "Royal Indian Monitors", "Research In Motion",
  "Research Insurance Makers", "Recursive Instruction Maintenance"],
  answers: 2
},
{
  question: "What year was Apple founded?",
  choices: [1976, 1977, 1978, 1979, 1980],
  answers: 0
},
{
  question: "What is the name of IBM's Artificial Intelligence that played Jeopardy?",
  choices: ["Jarvis", "Siri", "Cortana", "Brainiac", "Watson"],
  answers: 4
},
{
  question: "Which company invented AlphaGo, a program that won playing Go against Lee Se-dol?",
  choices: ["IBM", "Apple", "Microsoft", "Google", "Amazon"],
  answers: 3
},
{
  question: "Who is credited as the first computer programmer?",
  choices: ["Bill Gates", "George Babbage", "Ada Lovelace", "Alan Turing", "Bertrand Russell"],
  answers: 2
}
];

//variables used
var questionCounter = 0;
var selections = [];
var quiz = $('#quiz');

// Display initial question
displayNext();

//countdown function
window.onload = function() {
startCountDown(30, 1000, myFunction);
}

function startCountDown(i, p, f) {
    var pause = p;
    var fn = f;
    var countDownObj = document.getElementById("timer");

    countDownObj.count = function(i) {
    //write out count
    countDownObj.innerHTML = i;
    if (i === 0) {
    //execute function
        $("#next").trigger("click");
        fn();
		clearTimeout(t);
        startCountDown(30, 1000, myFunction);
        return;
    }
	//this part keeps the clock from contnuing after the game is over
    else if (questionCounter > questions.length - 1){
      return;
    }
//had to set this as a variable to keep the clock from breaking from
//multiple inputs
  t = setTimeout(function() {
    //repeat
    countDownObj.count(i - 1);
    }, pause);
}
countDownObj.count(i);
}

function myFunction(){};

// Click handler for the 'next' button
$('#next').click(function (doThis) {
  doThis.preventDefault();

  $(this).data("clicked", true);

  // Suspend click listener during fade animation
  if(quiz.is(':animated')) {
    return false;
  }
    //this stuff resets the clock as well as keeps score
	choose();
    questionCounter++;
    displayNext();
    clearTimeout(t);
    startCountDown(30, 1000, myFunction);
    return;
});

// Click handler for the 'prev' button
$('#prev').click(function (doThis) {
  doThis.preventDefault();

  if(quiz.is(':animated')) {
    return false;
  }
  choose();
  questionCounter--;
  displayNext();
});

// Click handler for the 'Start Over' button
$('#start').click(function (doThis) {
  doThis.preventDefault();

  if(quiz.is(':animated')) {
    return false;
  }
  questionCounter = 0;
  selections = [];
  displayNext();
  $('#start').hide();
  startCountDown(30, 1000, myFunction);
});

//Animates buttons on hover
$('.button').on('mouseenter', function() {
  $(this).addClass('active');
});
$('.button').on('mouseleave', function() {
  $(this).removeClass('active');
});

//Creates and returns the div that contains the questions and
//the answer selections
function createQuestionElement(index) {
  var questionBody = $('<div>', {
    id: 'question'
  });

  var header = $('<h4>Question ' + (index + 1) + ':</h4>');
  questionBody.append(header);

  var question = $('<p>').append(questions[index].question);
  questionBody.append(question);

  var radioButtons = createRadios(index);
  questionBody.append(radioButtons);

  return questionBody;
}

//Creates a list of the answer choices as radio inputs
function createRadios(index) {
  var radioList = $('<ul>');
  var item;
  var input = '';
  for (var i = 0; i < questions[index].choices.length; i++) {
    item = $('<li>');
    input = '<input type="radio" name="answer" value=' + i + ' />';
    input += questions[index].choices[i];
    item.append(input);
    radioList.append(item);
  }
  return radioList;
}

//Reads the user selection and pushes the value to an array
function choose() {
  selections[questionCounter] = +$('input[name="answer"]:checked').val();
}

//Displays next requested element
function displayNext() {
  quiz.fadeOut(function() {
    $('#question').remove();

    if(questionCounter < questions.length){
      var nextQuestion = createQuestionElement(questionCounter);
      quiz.append(nextQuestion).fadeIn();
      if (!(isNaN(selections[questionCounter]))) {
        $('input[value='+selections[questionCounter]+']').prop('checked', true);
      }

      // Controls display of 'prev' button
      if(questionCounter === 1){
        $('#prev').show();
      } else if(questionCounter === 0){

        $('#prev').hide();
        $('#next').show();
      }
    }else {
      var scoreElem = displayScore();
      quiz.append(scoreElem).fadeIn();
      $('#next').hide();
      $('#prev').hide();
      $('#start').show();
    }
  });
}

// Computes score and returns a paragraph element to be displayed
function displayScore() {
  var score = $('<p>',{id: 'question'});

  var numCorrect = 0;
  for (var i = 0; i < selections.length; i++) {
    if (selections[i] === questions[i].answers) {
      numCorrect++;
    }
  }

//final results
  score.append('You got ' + numCorrect + ' questions out of ' +
               questions.length + ' correct. Want to try again?');
  return score;
}
})
();