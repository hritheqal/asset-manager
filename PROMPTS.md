# Step 1: Project Setup

Help me set up a new project called "interactive-quiz-app". I need:

1. Create a basic project structure with:
   - index.html (main HTML file)
   - styles.css (for styling)
   - script.js (for JavaScript)
   - A data file called quizData.js containing sample quiz questions
2. The quiz data should include:
   - At least 3 quiz topics (e.g., JavaScript, HTML, General Knowledge)
   - Each topic has 5-10 questions
   - Each question has: question text, 4 options, correct answer index, and difficulty level
3. Keep the project simple - no frameworks, just vanilla HTML/CSS/JS.

---

# Step 2: Basic Structure & Styling

Help me create the basic HTML structure and CSS styling for my quiz app.
HTML should include:

- A landing page with quiz topic selection cards
- A quiz page that shows one question at a time
- A results page with score display
  CSS should include:
- A modern, clean design with a nice color scheme
- Responsive layout that works on mobile and desktop
- Hover effects on the topic cards and answer buttons
- A progress bar to show quiz completion
  Don't add JavaScript yet - just the structure and styles.

---

# Step 3: Topic Selection Logic

Help me implement the topic selection functionality in JavaScript.
When a user clicks on a quiz topic card:

1. Hide the landing page
2. Load the questions for that selected topic
3. Show the quiz page with the first question
4. Update the progress bar to 0%
   Use the quiz data from quizData.js. Keep the code simple and add comments explaining what each part does.

---

# Step 4: Question Display & Answer Handling

Help me implement the question display and answer selection.
For each question, I need to:

1. Display the question text
2. Show 4 answer buttons in a vertical list
3. When an answer is clicked:
   - Highlight the selected answer
   - Check if it's correct
   - Show green for correct, red for wrong
   - Wait 1 second before moving to the next question
4. Track the score (add 1 point for correct answers)
5. Update the progress bar after each question
   Use the DOM to update the question content dynamically. Add clear comments.

---

# Step 5: Navigation Between Questions

Help me implement navigation between questions.
I need:

1. A "Next Question" button that appears after an answer is selected
2. When clicked, it loads the next question
3. When all questions are answered, show the results page instead
4. Add smooth transitions when changing questions (fade out/fade in)
   The transition should use CSS animations. Make sure the results page shows the final score and a restart button.

---

# Step 6: Results Page & Score Display

Help me create the results page that shows after completing a quiz.
The results page should include:

1. A congratulations message based on the score:
   - 80-100%: "Excellent! 🎉"
   - 60-79%: "Good job! 👍"
   - 40-59%: "Not bad! 📚"
   - 0-39%: "Keep practicing! 💪"
2. Display the final score (e.g., "8/10 - 80%")
3. Show a visual score (like a simple circle progress bar or emoji representation)
4. A "Try Again" button to restart the quiz
5. A "Choose Another Quiz" button to go back to topic selection
   Make it visually appealing and encouraging for the user.

---

# Step 7: Add Animations and Polish

Help me add animations and visual polish to my quiz app.
I want to add:

1. Fade-in animation when questions appear
2. Button hover effects (scale up slightly, change color)
3. Confetti animation when getting a perfect score (100%)
4. A simple loading animation between questions
5. Smooth transitions between all pages
   Use CSS animations and keyframes. Keep it performant and don't overdo it - just add nice touches that make the app feel polished.

---

# Step 8: Save High Scores with LocalStorage

Help me add a high score feature using localStorage.
I want to:

1. Save the highest score for each quiz topic
2. Display the high score on the results page
3. Show a "New High Score!" message if the user beats their previous best
4. Store high scores permanently in the browser's localStorage
   Format the data as a simple object in localStorage. Explain how localStorage works in comments.

---

# Step 9: Add a Timer Feature

Help me add a timer to track how long it takes to complete each quiz.
I need:

1. A timer that starts when the quiz begins
2. Display the time in the top corner during the quiz
3. Stop the timer when the quiz is completed
4. Show the final time on the results page
5. Format the time as "X minutes and Y seconds"
   Use JavaScript's setInterval and update the display every second.

---

# Step 10: Final Testing and Bug Fixes

Help me review and test my quiz app.
Check for and help fix any issues:

1. What happens if I refresh the page during a quiz? (Should restart or offer option to continue?)
2. What if I don't select an answer and try to move to the next question?
3. Does the app work correctly on mobile devices?
4. Are there any edge cases I might have missed?
5. Make sure all buttons work as expected
   Also help me organize my code:
6. Group related functions together
7. Add clear comments for complex logic
8. Ensure code is readable and maintainable

---

# Optional Extra Features (Only if comfortable)

I've finished the basic quiz app. Now I want to add some extra features.
Please help me add:

1. A dark/light mode toggle that persists across pages
2. Sound effects for correct/incorrect answers (using simple audio or Web Audio API)
3. A leaderboard that shows top 5 scores for each topic
4. The ability to create custom quizzes by adding questions
   Pick 1-2 features and guide me through implementing them. Start with the simplest one first.
