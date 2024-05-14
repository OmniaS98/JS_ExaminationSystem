  // Question constructor function
  function Question(text, answers) {
    this.text = text;
    this.answers = answers;
    this.selectedAnswer = null;
}

// Answer constructor function
function Answer(text, isCorrect) {
    this.text = text;
    this.isCorrect = isCorrect;
}
// Exam constructor function
function Exam(questions, timeLimit) {
    this.questions = questions;
    this.timeLimit = timeLimit;
    this.startTime = new Date().getTime();
    this.elapsedTime = 0;
    this.markedQuestions = [];
    this.currentQuestionIndex = 0;
    this.correctAnswers = 0;
    const storedAnswersString = localStorage.getItem('selectedAnswers');
    this.selectedAnswers = storedAnswersString ? JSON.parse(storedAnswersString) : Array.from({ length: questions.length }, () => null);

    // Function to display the current question
    this.displayCurrentQuestion = function (questionNumber = this.currentQuestionIndex + 1) {
        const currentQuestion = this.questions[questionNumber - 1];

        // Display the question and answers
        document.getElementById('question').innerHTML = currentQuestion.text;

        let answersHTML = '';
        currentQuestion.answers.forEach((answer, index) => {
            const isChecked = this.selectedAnswers[questionNumber - 1] === index ? 'checked' : '';
            answersHTML += `
    <div class="answer" for="answer${index + 1}">
        <input type="radio" class="radioo" id="answer${index + 1}" name="answer" ${isChecked} onclick="exam.selectAnswer(${index})">
        <label for="answer${index + 1}">${answer.text}</label>
    </div>`;
        });
        document.getElementById('answers').innerHTML = answersHTML;

        // Update the current question number and total questions
        document.getElementById('currentQuestion').textContent = questionNumber;
        document.getElementById('totalQuestions').textContent = this.questions.length;

        // Show the Previous and Next Question buttons
        document.getElementById('prevButton').style.display = questionNumber > 1 ? 'inline-block' : 'none';
        document.getElementById('nextButton').style.display = questionNumber < this.questions.length ? 'inline-block' : 'none';
    };

    // Function to update the progress bar
    this.updateTimer = function () {
        const currentTime = new Date().getTime();
        this.elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
        const remainingTime = this.timeLimit - this.elapsedTime;
        const progress = (this.elapsedTime / this.timeLimit) * 100;
        document.getElementById('timeProgress').style.width = `${progress}%`;
        if (this.elapsedTime > remainingTime && this.elapsedTime >= 100) {
            document.getElementById('timeProgress').style.backgroundColor = "red";
        }
       

        if (remainingTime <= 0 || this.currentQuestionIndex === this.questions.length) {
            // Display result page
            this.showResult();
        }


    };
    // Function to handle answer selection
    this.selectAnswer = function (index) {
        this.selectedAnswers[this.currentQuestionIndex] = index;
    };
    // Function to move to the previous question
    this.prevQuestion = function () {
        if (this.currentQuestionIndex > 0) {
            // Move to the previous question
            this.currentQuestionIndex--;
            // Display the previous question
            this.displayCurrentQuestion();
            this.saveSelectedAnswers();

        }
    };
    // Function to move to the next question
    this.nextQuestion = function () {
        // Move to the next question (cycling through the questions)
        this.saveSelectedAnswers();
        this.currentQuestionIndex++;
        // Display the next question
        this.displayCurrentQuestion();
    };
    // Function to display the result page
    this.showResult = function () {
        this.saveSelectedAnswers(); // Save selected answers before navigating to the result page

        // Check if the time is up
        if (this.elapsedTime >= this.timeLimit) {
            window.location.replace(`timeout.html`);
        } else {
            window.location.replace(`res.html?correctAnswers=${this.correctAnswers}&totalQuestions=${this.questions.length}`);
        }
    };
    // Function to save selected answers to local storage
    this.saveSelectedAnswers = function () {
        const answersString = JSON.stringify(this.selectedAnswers);
        localStorage.setItem('selectedAnswers', answersString);
    };

}

Exam.prototype.markQuestion = function () {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (!this.markedQuestions.includes(currentQuestion)) {
        this.markedQuestions.push(currentQuestion);

        // Update the marked questions list in the aside div
        this.updateMarkedQuestionsList();
        this.saveSelectedAnswers();

    }
};

// Function to update the marked questions list in the aside div
Exam.prototype.updateMarkedQuestionsList = function () {
    const markedQuestionsList = document.getElementById('markedQuestionsList');
    markedQuestionsList.innerHTML = '';

    this.markedQuestions.forEach((question, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Question ${this.questions.indexOf(question) + 1}`;
        const deleteButton = document.createElement('span');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteButton';
        deleteButton.onclick = () => this.deleteMarkedQuestion(index);

        listItem.appendChild(deleteButton);
        listItem.onclick = () => this.displayMarkedQuestion(index);

        markedQuestionsList.appendChild(listItem);
    });
};

// Function to delete a marked question
Exam.prototype.deleteMarkedQuestion = function (index) {
    if (index >= 0 && index < this.markedQuestions.length) {
        this.markedQuestions.splice(index, 1);
        this.updateMarkedQuestionsList();
    }
};

// Function to display a marked question
Exam.prototype.displayMarkedQuestion = function (index) {
    if (index >= 0 && index < this.markedQuestions.length) {
        this.currentQuestionIndex = this.questions.indexOf(this.markedQuestions[index]);
        this.displayCurrentQuestion();
    }
};
// Function to submit the exam and open the result page
Exam.prototype.submitExam = function () {
    this.saveSelectedAnswers();
    // Check if all questions have been answered
    if (this.selectedAnswers.every(answer => answer !== null)) {
        // Calculate correct answers for each question
        for (let i = 0; i < this.questions.length; i++) {
            const currentQuestion = this.questions[i];
            const selectedAnswer = this.selectedAnswers[i];

            // Ensure the current question and selected answer are defined
            if (currentQuestion && currentQuestion.answers[selectedAnswer]) {
                if (currentQuestion.answers[selectedAnswer].isCorrect == true) {
                    this.correctAnswers++;
                }
            }
            else {
                this.currentQuestionIndex = i;
                this.displayCurrentQuestion(i + 1);
                return; // Exit the function if an invalid answer is encountered
            }
        }
        // Display the result page
        this.showResult();
    }
    else {
        for (let i = 0; i < this.selectedAnswers.length; i++) {
            if (this.selectedAnswers[i] === null) {
                this.currentQuestionIndex = i;
                this.displayCurrentQuestion(i + 1);
                return;
            }
        }
    }
};
// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
// Example usage with 12 questions
const question1 = new Question("What is the capital of France?", [
    new Answer("Berlin", false),
    new Answer("Paris", true),
    new Answer("Madrid", false),
]);

const question2 = new Question("Which planet is known as the Red Planet?", [
    new Answer("Mars", true),
    new Answer("Jupiter", false),
    new Answer("Venus", false),
]);

const question3 = new Question("What is the largest mammal on Earth?", [
    new Answer("Elephant", false),
    new Answer("Blue Whale", true),
    new Answer("Giraffe", false),
]);

const question4 = new Question("Which programming language is known for its flexibility?", [
    new Answer("Java", false),
    new Answer("Python", true),
    new Answer("C++", false),
]);

const question5 = new Question("What is the capital of Japan?", [
    new Answer("Beijing", false),
    new Answer("Seoul", false),
    new Answer("Tokyo", true),
]);
const question6 = new Question("What is the capital of Egypt?", [
    new Answer("Cairo", true),
    new Answer("Alex", false),
    new Answer("Giza", false),
]);
const question7 = new Question("Which element has the chemical symbol 'O'?", [
    new Answer("Oxygen", true),
    new Answer("Gold", false),
    new Answer("Osmium", false),
]);

const question8 = new Question("Who wrote 'Romeo and Juliet'?", [
    new Answer("William Shakespeare", true),
    new Answer("Charles Dickens", false),
    new Answer("Jane Austen", false),
]);

const question9 = new Question("What is the capital of Australia?", [
    new Answer("Sydney", false),
    new Answer("Canberra", true),
    new Answer("Melbourne", false),
]);

const question10 = new Question("In which year did the Titanic sink?", [
    new Answer("1912", true),
    new Answer("1905", false),
    new Answer("1925", false),
]);

const question11 = new Question("What is the largest planet in our solar system?", [
    new Answer("Mars", false),
    new Answer("Jupiter", true),
    new Answer("Saturn", false),
]);

const question12 = new Question("Who painted the Mona Lisa?", [
    new Answer("Vincent van Gogh", false),
    new Answer("Leonardo da Vinci", true),
    new Answer("Pablo Picasso", false),
]);


const questions = [question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12];
shuffleArray(questions);
const exam = new Exam(questions, 120); // 120 seconds time limit





// Function to handle clearing local storage when the page is about to be unloaded
function clearLocalStorageBeforeUnload() {
    localStorage.removeItem('selectedAnswers');
}

// Attach the clearLocalStorageBeforeUnload function to the beforeunload event
window.addEventListener('beforeunload', clearLocalStorageBeforeUnload);



// Function to display the first question initially
exam.displayCurrentQuestion();
setInterval(() => exam.updateTimer(), 1000);