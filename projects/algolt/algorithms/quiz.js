// quiz.js - Reusable Quiz System for Algorithm Visualizers

class AlgorithmQuiz {
    constructor(containerId, quizData) {
      this.container = document.getElementById(containerId);
      this.quizData = quizData;
      this.currentQuestion = 0;
      this.score = 0;
      this.init();
    }
  
    init() {
      if (!this.container || !this.quizData || this.quizData.length === 0) {
        console.error('Quiz initialization failed: Invalid container or quiz data');
        return;
      }
      this.renderQuestion();
    }
  
    renderQuestion() {
      const q = this.quizData[this.currentQuestion];
      this.container.innerHTML = `
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-gray-500">Question ${this.currentQuestion + 1} of ${this.quizData.length}</span>
            <div class="flex space-x-1">
              ${this.quizData.map((_, index) => `
                <div class="w-2 h-2 rounded-full ${index <= this.currentQuestion ? 'bg-blue-600' : 'bg-gray-300'}"></div>
              `).join('')}
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">${q.question}</h3>
          <div class="space-y-3">
            ${q.options.map(opt => `
              <label class="quiz-option flex items-center cursor-pointer">
                <input type="radio" name="quiz-${this.currentQuestion}" value="${opt}" class="mr-3 text-blue-600"> 
                <span class="text-gray-700">${opt}</span>
              </label>
            `).join('')}
          </div>
          <button id="submitQuiz" class="btn btn-primary px-6 py-3 mt-6">Submit Answer</button>
        </div>
      `;
  
      const submitBtn = document.getElementById('submitQuiz');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => this.handleAnswer());
      }
    }
  
    handleAnswer() {
      const selected = document.querySelector(`input[name="quiz-${this.currentQuestion}"]:checked`);
      if (!selected) {
        alert("Please select an answer first.");
        return;
      }
      
      const chosen = selected.value;
      const correct = this.quizData[this.currentQuestion].answer;
      const explanation = this.quizData[this.currentQuestion].explanation;
  
      const feedback = document.createElement("div");
      feedback.className = "mt-4 p-4 rounded-lg border";
  
      if (chosen === correct) {
        feedback.innerHTML = `
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-green-800">Correct!</h4>
              <p class="text-sm text-green-700 mt-1">${explanation}</p>
            </div>
          </div>
        `;
        feedback.classList.add("bg-green-50", "border-green-200");
        this.score++;
      } else {
        feedback.innerHTML = `
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-red-800">Incorrect</h4>
              <p class="text-sm text-red-700 mt-1">The correct answer is: <strong>${correct}</strong></p>
              <p class="text-sm text-red-700 mt-1">${explanation}</p>
            </div>
          </div>
        `;
        feedback.classList.add("bg-red-50", "border-red-200");
      }
  
      this.container.appendChild(feedback);
      
      // Remove submit button and disable radio buttons
      const submitBtn = document.getElementById("submitQuiz");
      if (submitBtn) submitBtn.remove();
      
      document.querySelectorAll(`input[name="quiz-${this.currentQuestion}"]`).forEach(el => el.disabled = true);
  
      // Add next button
      const nextBtn = document.createElement("button");
      nextBtn.textContent = this.currentQuestion === this.quizData.length - 1 ? "View Results" : "Next Question";
      nextBtn.className = "btn btn-primary px-6 py-3 mt-4";
      nextBtn.addEventListener('click', () => this.nextQuestion());
      this.container.appendChild(nextBtn);
    }
  
    nextQuestion() {
      this.currentQuestion++;
      if (this.currentQuestion < this.quizData.length) {
        this.renderQuestion();
      } else {
        this.showFinalResult();
      }
    }
  
    showFinalResult() {
      const percentage = Math.round((this.score / this.quizData.length) * 100);
      let resultColor, resultIcon, resultMessage;
      
      if (percentage >= 80) {
        resultColor = "text-green-600";
        resultIcon = `<svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
        resultMessage = "Excellent work! You have a strong understanding of this algorithm.";
      } else if (percentage >= 60) {
        resultColor = "text-yellow-600";
        resultIcon = `<svg class="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>`;
        resultMessage = "Good job! Review the concepts and try again to improve your score.";
      } else {
        resultColor = "text-red-600";
        resultIcon = `<svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
        resultMessage = "Keep learning! Review the algorithm explanation and try the quiz again.";
      }
  
      this.container.innerHTML = `
        <div class="text-center py-8">
          <div class="flex justify-center mb-4">
            ${resultIcon}
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
          <div class="text-4xl font-bold ${resultColor} mb-4">${this.score}/${this.quizData.length}</div>
          <div class="text-lg ${resultColor} font-semibold mb-3">${percentage}%</div>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">${resultMessage}</p>
          <button onclick="location.reload()" class="btn btn-secondary px-6 py-3">
            Try Again
          </button>
        </div>
      `;
    }
  
    static create(containerId, quizData) {
      return new AlgorithmQuiz(containerId, quizData);
    }
  }
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlgorithmQuiz;
  }