// Interactive Quiz App - JavaScript
// This file will contain the logic for:
// - Topic selection
// - Question display
// - Answer handling
// - Score tracking
// - Results display

// Global variables
let currentTopic = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const landingPage = document.getElementById('landing-page');
const quizPage = document.getElementById('quiz-page');
const resultsPage = document.getElementById('results-page');
const topicSelection = document.getElementById('topic-selection');
const quizTitle = document.getElementById('quiz-title');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const resultsContent = document.getElementById('results-content');

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTopics();
});

// Load quiz topics on landing page
function loadTopics() {
    // TODO: Implement in Step 3
    console.log('Topics will be loaded here');
}

// Handle topic selection
function selectTopic(topicId) {
    // TODO: Implement in Step 3
    console.log('Topic selected:', topicId);
}

// Display current question
function displayQuestion() {
    // TODO: Implement in Step 4
    console.log('Question will be displayed here');
}

// Handle answer selection
function handleAnswer(selectedAnswerIndex) {
    // TODO: Implement in Step 4
    console.log('Answer selected:', selectedAnswerIndex);
}

// Show next question or results
function nextQuestion() {
    // TODO: Implement in Step 5
    console.log('Next question will be shown');
}

// Display results
function showResults() {
    // TODO: Implement in Step 6
    console.log('Results will be shown here');
}

// Restart quiz
function restartQuiz() {
    // TODO: Implement in Step 6
    console.log('Quiz will be restarted');
}

// Go back to topic selection
function backToTopics() {
    // TODO: Implement in Step 6
    console.log('Return to topic selection');
}
