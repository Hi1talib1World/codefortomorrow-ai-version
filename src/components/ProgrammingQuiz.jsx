import React, { useState } from "react";

const ProgrammingQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const questions = [
    {
      question: "Which keyword is used to define a class in Java?",
      options: ["class", "Class", "Object", "new"],
      correctAnswer: 0,
      explanation: "In Java, the 'class' keyword is used to declare a class."
    },
    {
      question: "What does the 'echo' command do in PHP?",
      options: ["Outputs one or more strings", "Creates a new variable", "Defines a function", "Includes a file"],
      correctAnswer: 0,
      explanation: "The 'echo' construct in PHP is used to output strings to the browser."
    },
    {
      question: "What is the primary purpose of a 'for' loop in Python?",
      options: ["To iterate over a sequence (like a list or string)", "To make a decision based on a condition", "To define a function", "To handle exceptions"],
      correctAnswer: 0,
      explanation: "A 'for' loop in Python is used to iterate through items in any sequence, such as a list or a string, in the order that they appear."
    },
    {
      question: "In Java, what is the difference between '==' and '.equals()' for String objects?",
      options: ["'==' checks for reference equality, '.equals()' checks for content equality", "'==' checks for content equality, '.equals()' checks for reference equality", "They are interchangeable for Strings", "Only '==' can be used for Strings"],
      correctAnswer: 0,
      explanation: "'==' compares memory addresses (references) for objects, while '.equals()' compares the actual content of the String objects."
    },
    {
      question: "Which of the following is NOT a valid way to start a comment in PHP?",
      options: ["// Comment", "# Comment", "/* Multi-line Comment */", "<!-- HTML Comment -->"],
      correctAnswer: 3,
      explanation: "While '<!-- HTML Comment -->' works in HTML, it's not a standard PHP comment syntax. PHP uses //, #, and /* ... */ for comments."
    },
    {
      question: "What does the 'yield' keyword do in Python?",
      options: ["It pauses a function's execution and returns a value, allowing it to resume later", "It raises an exception", "It terminates the program", "It defines a generator function"],
      correctAnswer: 0,
      explanation: "'yield' is used in Python generator functions. It returns a value and suspends the function's state, so it can be resumed later."
    },
    {
      question: "What is an abstract class in Java?",
      options: ["A class that cannot be instantiated and may contain abstract methods", "A class with only private members", "A class that can only be extended by one other class", "A class that is automatically garbage collected"],
      correctAnswer: 0,
      explanation: "An abstract class in Java cannot be instantiated. It can have abstract methods (methods without implementation) and concrete methods."
    },
    {
      question: "In PHP, what is the purpose of the 'require_once' statement?",
      options: ["To include a file only if it hasn't been included before", "To include a file and stop execution if it fails", "To include a file multiple times", "To include a file that contains only functions"],
      correctAnswer: 0,
      explanation: "'require_once' includes and evaluates the specified file. If the file has already been included, it will not be included again."
    },
    {
      question: "What is the Big O notation for accessing an element in a Python list by its index?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
      correctAnswer: 0,
      explanation: "Accessing an element in a Python list by index is a constant time operation, hence O(1)."
    },
    {
      question: "Which of the following is a common use case for Java's 'final' keyword?",
      options: ["To prevent a variable's value from being changed, a method from being overridden, or a class from being extended", "To mark a method as thread-safe", "To indicate that a method returns no value", "To declare a variable that can only be accessed within its class"],
      correctAnswer: 0,
      explanation: "The 'final' keyword in Java can be applied to variables (making them constants), methods (preventing overriding), and classes (preventing inheritance)."
    }
  ];

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    setSelectedAnswers([...selectedAnswers, isCorrect]);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
    }, 1000); // Delay to show feedback if implemented
  };

  const handleNextQuestion = () => {
    // This is now handled within handleAnswerClick with setTimeout
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswers([]);
  };

  return (
    <div className="quiz-container">
      {showResults ? (
        <div className="results-screen">
          <h2>Quiz Complete!</h2>
          <p>Your final score: {score} out of {questions.length}</p>
          {questions.map((q, index) => (
            <div key={index} className="explanation-item">
              <h3>Q{index + 1}: {q.question}</h3>
              <p>Your answer: {selectedAnswers[index] === q.correctAnswer ? 'Correct' : 'Incorrect'}</p>
              <p><strong>Explanation:</strong> {q.explanation}</p>
            </div>
          ))}
          <button onClick={resetQuiz}>Play Again</button>
        </div>
      ) : (
        <div className="question-screen">
          <h2>Question {currentQuestion + 1}</h2>
          <p>{questions[currentQuestion].question}</p>
          <div className="options-grid">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index === questions[currentQuestion].correctAnswer)}
                disabled={selectedAnswers.length > currentQuestion} // Disable after an answer is selected for this question
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgrammingQuiz;
