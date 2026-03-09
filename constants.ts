
/**
 * constants.ts
 * ─────────────
 * All static curriculum data for the app.
 *
 * Structure:
 *  - PATHS                : The list of available programming paths (Python, JS, etc.).
 *  - LESSONS_BY_PATH      : Flat lesson sections per path (used for most paths).
 *  - MODULES_BY_PATH      : Structured modules/levels per path (used for Block Coding).
 *  - BADGES_BY_PATH       : Badges that can be earned per path.
 *
 * Lesson content conventions:
 *  - `starterCode`        : Pre-filled code shown to the student in the editor.
 *  - `solutionCode`       : The canonical solution (not shown to the student).
 *  - `expectedOutput`     : The exact string the student's code must print to pass.
 *  - `questions`          : If present, the lesson uses the QuizLessonScreen (no editor).
 *  - Translation keys     : All human-readable text is stored as keys (e.g. 'py_challenge_1')
 *                           and resolved at runtime via useLanguage().t().
 */
import { LessonSection, Badge, ProgrammingPath, Module, Level } from './types';

// ─── PATHS ───────────────────────────────────────────────────────────────────
// Defines which programming paths exist and whether they are available.
// Unavailable paths are shown on the path selection screen but cannot be started.
export const PATHS: ProgrammingPath[] = [
  {
    id: 'block_coding',
    titleKey: 'block_coding',
    descriptionKey: 'block_coding_desc',
    icon: '🧩',
    color: 'bg-brand-500',
    isAvailable: true
  },
  {
    id: 'python',
    titleKey: 'python',
    descriptionKey: 'python_desc',
    icon: '🐍',
    color: 'bg-yellow-500',
    isAvailable: true
  },
  {
    id: 'javascript',
    titleKey: 'javascript',
    descriptionKey: 'javascript_desc',
    icon: '📜',
    color: 'bg-red-500',
    isAvailable: true
  },
  {
    id: 'lua',
    titleKey: 'lua',
    descriptionKey: 'lua_desc',
    icon: '🎮',
    color: 'bg-brand-500',
    isAvailable: true
  },
  {
    id: 'web_dev',
    titleKey: 'web_dev',
    descriptionKey: 'web_dev_desc',
    icon: '🌐',
    color: 'bg-pink-500',
    isAvailable: true
  },
  {
    id: 'c++',
    titleKey: 'c++',
    descriptionKey: 'c++_desc',
    icon: '🐉',
    color: 'bg-gray-700',
    isAvailable: true
  },
  {
    id: 'c_sharp',
    titleKey: 'c_sharp',
    descriptionKey: 'c_sharp_desc',
    icon: '♯',
    color: 'bg-purple-600',
    isAvailable: true
  },
  {
    id: 'java',
    titleKey: 'java',
    descriptionKey: 'java_desc',
    icon: '☕',
    color: 'bg-orange-600',
    isAvailable: true
  },
  {
    id: 'kotlin',
    titleKey: 'kotlin',
    descriptionKey: 'kotlin_desc',
    icon: '🤖',
    color: 'bg-brand-700',
    isAvailable: true
  },
  {
    id: 'swift',
    titleKey: 'swift',
    descriptionKey: 'swift_desc',
    icon: '🐦',
    color: 'bg-red-600',
    isAvailable: true
  },
  {
    id: 'go',
    titleKey: 'go',
    descriptionKey: 'go_desc',
    icon: '🐹',
    color: 'bg-cyan-500',
    isAvailable: true
  },
  {
    id: 'rust',
    titleKey: 'rust',
    descriptionKey: 'rust_desc',
    icon: '🦀',
    color: 'bg-orange-800',
    isAvailable: true
  },
  {
    id: 'php',
    titleKey: 'php',
    descriptionKey: 'php_desc',
    icon: '🐘',
    color: 'bg-brand-400',
    isAvailable: true
  },
  {
    id: 'ruby',
    titleKey: 'ruby',
    descriptionKey: 'ruby_desc',
    icon: '💎',
    color: 'bg-red-700',
    isAvailable: true
  },
  {
    id: 'typescript',
    titleKey: 'typescript',
    descriptionKey: 'typescript_desc',
    icon: '🔷',
    color: 'bg-brand-600',
    isAvailable: true
  },
  {
    id: 'sql',
    titleKey: 'sql',
    descriptionKey: 'sql_desc',
    icon: '🗃️',
    color: 'bg-gray-500',
    isAvailable: true
  },
  {
    id: 'r',
    titleKey: 'r',
    descriptionKey: 'r_desc',
    icon: '📊',
    color: 'bg-brand-600',
    isAvailable: true
  },
  {
    id: 'dart',
    titleKey: 'dart',
    descriptionKey: 'dart_desc',
    icon: '🎯',
    color: 'bg-teal-500',
    isAvailable: true
  },
  {
    id: 'math',
    titleKey: 'math_games',
    descriptionKey: 'math_games_desc',
    icon: '🧮',
    color: 'bg-indigo-500',
    isAvailable: true
  },
];

export const MODULES_BY_PATH: { [key: string]: Module[] } = {
  block_coding: [
    {
      id: 'bc_mod_1',
      titleKey: 'bc_mod_1_title',
      descriptionKey: 'bc_mod_1_desc',
      color: 'bg-brand-500',
      levels: [
        {
          id: 'bc_lvl_1',
          titleKey: 'bc_lvl_1_title',
          isLocked: false,
          lessons: [
            {
              id: 1, level: 1, titleKey: 'sequences', icon: 'brain', xp: 15, color: '#3498db', type: 'lesson', nodeType: 'standard',
              challengeDescriptionKey: 'bc_challenge_1',
              explanationKey: 'bc_explain_1',
              hintKey: 'bc_hint_1',
              starterCode: '// Move forward 3 times!\n// Log "forward" 3 times.\n',
              solutionCode: 'console.log("forward");\nconsole.log("forward");\nconsole.log("forward");',
              expectedOutput: 'forward\nforward\nforward'
            },
            {
              id: 2, level: 2, titleKey: 'sequences', icon: 'brain', xp: 20, color: '#3498db', type: 'lesson', nodeType: 'standard',
              challengeDescriptionKey: 'bc_challenge_2',
              hintKey: 'bc_hint_2',
              starterCode: '// Turn left then move forward.\n',
              solutionCode: 'console.log("left");\nconsole.log("forward");',
              expectedOutput: 'left\nforward'
            },
            {
              id: 3, level: 3, titleKey: 'sequences', icon: 'brain', xp: 20, color: '#3498db', type: 'lesson', nodeType: 'standard',
              challengeDescriptionKey: 'bc_challenge_3',
              starterCode: '// Move forward, turn right, move forward.\n',
              solutionCode: 'console.log("forward");\nconsole.log("right");\nconsole.log("forward");',
              expectedOutput: 'forward\nright\nforward'
            },
            { id: 4, level: 4, titleKey: 'maze_game', icon: 'trophy', xp: 50, color: '#3498db', type: 'project', nodeType: 'trophy', challengeDescriptionKey: 'bc_challenge_4', starterCode: '', solutionCode: '', expectedOutput: '' },
          ]
        },
        {
          id: 'bc_lvl_2',
          titleKey: 'bc_lvl_2_title',
          isLocked: false,
          lessons: [
            { id: 5, level: 5, titleKey: 'loops', icon: 'star', xp: 15, color: '#2ecc71', type: 'lesson', nodeType: 'quiz', challengeDescriptionKey: 'bc_challenge_5', starterCode: '', solutionCode: '', expectedOutput: '' },
            {
              id: 6, level: 6, titleKey: 'loops', icon: 'brain', xp: 20, color: '#2ecc71', type: 'lesson', nodeType: 'standard',
              challengeDescriptionKey: 'bc_challenge_6',
              starterCode: '// Use a loop to log "jump" 5 times.\n',
              solutionCode: 'for(let i=0; i<5; i++) console.log("jump");',
              expectedOutput: 'jump\njump\njump\njump\njump'
            },
          ]
        }
      ]
    },
    {
      id: 'bc_mod_2',
      titleKey: 'bc_mod_2_title',
      descriptionKey: 'bc_mod_2_desc',
      color: 'bg-purple-500',
      levels: [
        {
          id: 'bc_lvl_3',
          titleKey: 'bc_lvl_3_title',
          isLocked: true,
          lessons: [
            {
              id: 7, level: 7, titleKey: 'events', icon: 'brain', xp: 20, color: '#e67e22', type: 'lesson', nodeType: 'standard',
              challengeDescriptionKey: 'bc_challenge_7',
              starterCode: '// Log "click" to simulate an event.\n',
              solutionCode: 'console.log("click");',
              expectedOutput: 'click'
            },
            { id: 8, level: 8, titleKey: 'events', icon: 'star', xp: 50, color: '#e67e22', type: 'project', nodeType: 'quiz', challengeDescriptionKey: 'bc_challenge_8', starterCode: '', solutionCode: '', expectedOutput: '' },
          ]
        }
      ]
    }
  ]
};

export const LESSONS_BY_PATH: { [key: string]: LessonSection[] } = {
  block_coding: [
    {
      id: 'bc_intro',
      titleKey: 'sequences',
      lessons: [
        {
          id: 1, level: 1, titleKey: 'sequences', icon: 'brain', xp: 15, color: '#3498db', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'bc_challenge_1',
          explanationKey: 'bc_explain_1',
          hintKey: 'bc_hint_1',
          estimatedMinutes: 5,
          difficulty: 'Beginner',
          tags: ['Basics', 'Logic'],
          objectivesKey: 'bc_obj_1',
          proTipKey: 'bc_tip_1',
          starterCode: '// Move forward 3 times!\n// Log "forward" 3 times.\n',
          solutionCode: 'console.log("forward");\nconsole.log("forward");\nconsole.log("forward");',
          expectedOutput: 'forward\nforward\nforward'
        },
        {
          id: 2, level: 2, titleKey: 'sequences', icon: 'brain', xp: 20, color: '#3498db', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'bc_challenge_2',
          hintKey: 'bc_hint_2',
          starterCode: '// Turn left then move forward.\n',
          solutionCode: 'console.log("left");\nconsole.log("forward");',
          expectedOutput: 'left\nforward'
        },
        {
          id: 3, level: 3, titleKey: 'sequences', icon: 'brain', xp: 20, color: '#3498db', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'bc_challenge_3',
          starterCode: '// Move forward, turn right, move forward.\n',
          solutionCode: 'console.log("forward");\nconsole.log("right");\nconsole.log("forward");',
          expectedOutput: 'forward\nright\nforward'
        },
        { id: 4, level: 4, titleKey: 'maze_game', icon: 'trophy', xp: 50, color: '#3498db', type: 'project', nodeType: 'trophy', challengeDescriptionKey: 'bc_challenge_4', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    },
    {
      id: 'bc_loops',
      titleKey: 'loops',
      lessons: [
        { id: 5, level: 5, titleKey: 'loops', icon: 'star', xp: 15, color: '#2ecc71', type: 'lesson', nodeType: 'quiz', challengeDescriptionKey: 'bc_challenge_5', starterCode: '', solutionCode: '', expectedOutput: '' },
        {
          id: 6, level: 6, titleKey: 'loops', icon: 'brain', xp: 20, color: '#2ecc71', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'bc_challenge_6',
          starterCode: '// Use a loop to log "jump" 5 times.\n',
          solutionCode: 'for(let i=0; i<5; i++) console.log("jump");',
          expectedOutput: 'jump\njump\njump\njump\njump'
        },
        {
          id: 7, level: 7, titleKey: 'events', icon: 'brain', xp: 20, color: '#e67e22', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'bc_challenge_7',
          starterCode: '// Log "click" to simulate an event.\n',
          solutionCode: 'console.log("click");',
          expectedOutput: 'click'
        },
        { id: 8, level: 8, titleKey: 'events', icon: 'star', xp: 50, color: '#e67e22', type: 'project', nodeType: 'quiz', challengeDescriptionKey: 'bc_challenge_8', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    },
    {
      id: 'bc_logic',
      titleKey: 'logic',
      lessons: [
        {
          id: 9, level: 9, titleKey: 'conditionals', icon: 'brain', xp: 20, color: '#9b59b6', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'bc_challenge_9',
          starterCode: '// If 10 is greater than 5, log "yes".\n',
          solutionCode: 'if(10 > 5) console.log("yes");',
          expectedOutput: 'yes'
        },
        {
          id: 10, level: 10, titleKey: 'variables', icon: 'brain', xp: 25, color: '#9b59b6', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'bc_challenge_10',
          starterCode: '// Create a variable x = 5 and log it.\n',
          solutionCode: 'let x = 5; console.log(x);',
          expectedOutput: '5'
        },
        { id: 11, level: 11, titleKey: 'logic_master', icon: 'trophy', xp: 60, color: '#8e44ad', type: 'project', nodeType: 'trophy', challengeDescriptionKey: 'bc_challenge_11', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  python: [
    {
      id: 'py_intro',
      titleKey: 'python_vars_numbers',
      lessons: [
        {
          id: 1, level: 1, titleKey: 'python_vars_numbers', icon: 'brain', xp: 15, color: '#f1c40f', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_1',
          explanationKey: 'py_explain_1',
          hintKey: 'py_hint_1',
          estimatedMinutes: 10,
          difficulty: 'Beginner',
          tags: ['Variables', 'DataTypes'],
          objectivesKey: 'py_obj_1',
          proTipKey: 'py_tip_1',
          starterCode: '# Create a variable named "age" and set it to 10.\n# Then print the variable.\n',
          solutionCode: 'age = 10\nprint(age)',
          expectedOutput: '10',
          questions: [
            {
              questionKey: 'py_q1_q1',
              optionKeys: ['py_q1_o1a', 'py_q1_o1b', 'py_q1_o1c', 'py_q1_o1d'],
              correctIndex: 0,
              feedbackKey: 'py_q1_f1'
            },
            {
              questionKey: 'py_q1_q2',
              optionKeys: ['py_q1_o2a', 'py_q1_o2b', 'py_q1_o2c', 'py_q1_o2d'],
              correctIndex: 2,
              feedbackKey: 'py_q1_f2'
            },
            {
              questionKey: 'py_q1_q3',
              optionKeys: ['py_q1_o3a', 'py_q1_o3b', 'py_q1_o3c', 'py_q1_o3d'],
              correctIndex: 1,
              feedbackKey: 'py_q1_f3'
            },
          ]
        },
        {
          id: 2, level: 2, titleKey: 'python_loops', icon: 'brain', xp: 20, color: '#f1c40f', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_2',
          explanationKey: 'py_explain_2',
          hintKey: 'py_hint_2',
          estimatedMinutes: 12,
          difficulty: 'Beginner',
          tags: ['Loops', 'Iteration'],
          objectivesKey: 'py_obj_2',
          proTipKey: 'py_tip_2',
          starterCode: '# Write a "for" loop to print numbers from 1 to 3\n# Use range(1, 4)\n\n',
          solutionCode: 'for i in range(1, 4):\n    print(i)',
          expectedOutput: '1\n2\n3'
        },
        {
          id: 3, level: 3, titleKey: 'python_conditionals', icon: 'star', xp: 25, color: '#f1c40f', type: 'quiz', nodeType: 'quiz',
          challengeDescriptionKey: 'py_challenge_3',
          explanationKey: 'py_explain_3',
          hintKey: 'py_hint_3',
          estimatedMinutes: 10,
          difficulty: 'Beginner',
          tags: ['IfElse', 'Logic'],
          objectivesKey: 'py_obj_3',
          proTipKey: 'py_tip_3',
          starterCode: '# Set age = 18\n# If age >= 18, print "Adult", else print "Minor"\n\n',
          solutionCode: 'age = 18\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")',
          expectedOutput: 'Adult'
        },
        {
          id: 4, level: 4, titleKey: 'python_functions', icon: 'brain', xp: 30, color: '#f1c40f', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_4',
          explanationKey: 'py_explain_4',
          hintKey: 'py_hint_4',
          estimatedMinutes: 15,
          difficulty: 'Intermediate',
          tags: ['Functions', 'Def'],
          objectivesKey: 'py_obj_4',
          proTipKey: 'py_tip_4',
          starterCode: '# Define a function greet() that prints "Hello"\n# Then call it!\n\n',
          solutionCode: 'def greet():\n    print("Hello")\ngreet()',
          expectedOutput: 'Hello'
        },
        {
          id: 5, level: 5, titleKey: 'python_lists', icon: 'trophy', xp: 50, color: '#f39c12', type: 'project', nodeType: 'trophy',
          challengeDescriptionKey: 'py_challenge_5',
          explanationKey: 'py_explain_5',
          hintKey: 'py_hint_5',
          estimatedMinutes: 20,
          difficulty: 'Intermediate',
          tags: ['Lists', 'Arrays'],
          objectivesKey: 'py_obj_5',
          proTipKey: 'py_tip_5',
          starterCode: '# Create a list named fruits with "apple" and "banana"\n# Print the first item in the list\n\n',
          solutionCode: 'fruits = ["apple", "banana"]\nprint(fruits[0])',
          expectedOutput: 'apple'
        },
      ],
    },
    {
      id: 'py_data_structures',
      titleKey: 'python_data_structures',
      lessons: [
        {
          id: 6, level: 6, titleKey: 'python_lists', icon: 'brain', xp: 20, color: '#f1c40f', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_6',
          starterCode: '# Create a list named "fruits" with "apple" and "banana".\n# Print the list.\n',
          solutionCode: 'fruits = ["apple", "banana"]\nprint(fruits)',
          expectedOutput: "['apple', 'banana']"
        },
        {
          id: 7, level: 7, titleKey: 'python_dicts', icon: 'brain', xp: 25, color: '#f1c40f', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_7',
          starterCode: '# Create a dictionary named "user" with key "name" and value "Alice".\n# Print the dictionary.\n',
          solutionCode: 'user = {"name": "Alice"}\nprint(user)',
          expectedOutput: "{'name': 'Alice'}"
        },
        { id: 8, level: 8, titleKey: 'python_tuples', icon: 'star', xp: 30, color: '#f1c40f', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: 'py_challenge_8', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    },
    {
      // ── Python Chapter 3: Code Like a Pro ────────────────────────────────
      id: 'py_pro',
      titleKey: 'py_ch3_title',
      lessons: [
        {
          id: 9, level: 9, titleKey: 'python_oop', icon: 'brain', xp: 30, color: '#e67e22', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_9',
          explanationKey: 'py_explain_9',
          estimatedMinutes: 15,
          difficulty: 'Intermediate',
          tags: ['OOP', 'Classes'],
          objectivesKey: 'py_obj_9',
          proTipKey: 'py_tip_9',
          hintKey: 'py_hint_9',
          starterCode: '# Define a class Dog with a name attribute.\n# Create an instance and print its name.\n',
          solutionCode: 'class Dog:\n  def __init__(self, name):\n    self.name = name\ndog = Dog("Rex")\nprint(dog.name)',
          expectedOutput: 'Rex'
        },
        {
          id: 10, level: 10, titleKey: 'python_string_methods', icon: 'brain', xp: 25, color: '#e67e22', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_10',
          estimatedMinutes: 10,
          difficulty: 'Beginner',
          tags: ['Strings', 'Methods'],
          hintKey: 'py_hint_10',
          starterCode: '# Convert "hello world" to uppercase and print it.\n',
          solutionCode: 'print("hello world".upper())',
          expectedOutput: 'HELLO WORLD'
        },
        {
          id: 11, level: 11, titleKey: 'python_error_handling', icon: 'star', xp: 35, color: '#e67e22', type: 'quiz', nodeType: 'quiz',
          challengeDescriptionKey: 'py_challenge_11',
          estimatedMinutes: 12,
          difficulty: 'Intermediate',
          tags: ['Errors', 'Try/Except'],
          hintKey: 'py_hint_11',
          starterCode: '# Use try/except to catch a ZeroDivisionError.\nresult = 10 / 0\n',
          solutionCode: 'try:\n  result = 10 / 0\nexcept ZeroDivisionError:\n  print("Cannot divide by zero!")',
          expectedOutput: 'Cannot divide by zero!'
        },
        {
          id: 12, level: 12, titleKey: 'python_list_comprehensions', icon: 'brain', xp: 35, color: '#e67e22', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_12',
          estimatedMinutes: 12,
          difficulty: 'Intermediate',
          tags: ['Lists', 'Comprehension'],
          hintKey: 'py_hint_12',
          starterCode: '# Use a list comprehension to create a list of squares from 1 to 5.\n',
          solutionCode: 'squares = [x**2 for x in range(1, 6)]\nprint(squares)',
          expectedOutput: '[1, 4, 9, 16, 25]'
        },
        {
          id: 13, level: 13, titleKey: 'python_recursion', icon: 'brain', xp: 40, color: '#e67e22', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_13',
          estimatedMinutes: 15,
          difficulty: 'Intermediate',
          tags: ['Recursion', 'Functions'],
          hintKey: 'py_hint_13',
          starterCode: '# Write a recursive function to print numbers 1 to 3.\n',
          solutionCode: 'def count(n):\n  if n > 3:\n    return\n  print(n)\n  count(n + 1)\ncount(1)',
          expectedOutput: '1\n2\n3'
        },
        {
          id: 14, level: 14, titleKey: 'python_modules', icon: 'brain', xp: 30, color: '#e67e22', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_14',
          estimatedMinutes: 10,
          difficulty: 'Intermediate',
          tags: ['Modules', 'Import'],
          hintKey: 'py_hint_14',
          starterCode: '# Import math and print the square root of 16.\n',
          solutionCode: 'import math\nprint(math.sqrt(16))',
          expectedOutput: '4.0'
        },
        {
          id: 15, level: 15, titleKey: 'python_final_project', icon: 'trophy', xp: 100, color: '#c0392b', type: 'project', nodeType: 'trophy',
          challengeDescriptionKey: 'py_challenge_15',
          estimatedMinutes: 25,
          difficulty: 'Advanced',
          tags: ['Project', 'Python'],
          hintKey: 'py_hint_15',
          starterCode: '# Final challenge: Build a simple number guessing game.\n# Pick a secret number, compare it with a guess.\nsecret = 7\nguess = 7\n',
          solutionCode: 'secret = 7\nguess = 7\nif guess == secret:\n  print("You guessed it!")',
          expectedOutput: 'You guessed it!'
        },
      ],
    },
    {
      // ── Python Chapter 4: Advanced Python ─────────────────────────────────
      id: 'py_advanced',
      titleKey: 'py_ch4_title',
      lessons: [
        {
          id: 16, level: 16, titleKey: 'python_generators', icon: 'brain', xp: 40, color: '#8e44ad', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_16', estimatedMinutes: 15,
          difficulty: 'Advanced', tags: ['Generators', 'yield'],
          hintKey: 'py_hint_16',
          starterCode: '# Write a generator that yields 1, 2, 3.\n# Use next() to get the first value and print it.\n',
          solutionCode: 'def gen():\n  yield 1\n  yield 2\n  yield 3\ng = gen()\nprint(next(g))',
          expectedOutput: '1'
        },
        {
          id: 17, level: 17, titleKey: 'python_decorators', icon: 'brain', xp: 45, color: '#8e44ad', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_17', estimatedMinutes: 15,
          difficulty: 'Advanced', tags: ['Decorators', 'Functions'],
          hintKey: 'py_hint_17',
          starterCode: '# Create a decorator that prints "Before" before any function runs.\n',
          solutionCode: 'def before(fn):\n  def wrapper(*a):\n    print("Before")\n    fn(*a)\n  return wrapper\n\n@before\ndef greet():\n  print("Hi!")\ngreet()',
          expectedOutput: 'Before\nHi!'
        },
        {
          id: 18, level: 18, titleKey: 'python_file_io', icon: 'star', xp: 35, color: '#8e44ad', type: 'quiz', nodeType: 'quiz',
          challengeDescriptionKey: 'py_challenge_18', estimatedMinutes: 12,
          difficulty: 'Advanced', tags: ['Files', 'I/O'],
          hintKey: 'py_hint_18',
          starterCode: '# Simulate file writing: build the string "Hello File!" and print it.\n',
          solutionCode: 'content = "Hello File!"\nprint(content)',
          expectedOutput: 'Hello File!'
        },
        {
          id: 19, level: 19, titleKey: 'python_regex', icon: 'brain', xp: 45, color: '#8e44ad', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_19', estimatedMinutes: 15,
          difficulty: 'Advanced', tags: ['Regex', 'Patterns'],
          hintKey: 'py_hint_19',
          starterCode: '# Use re.search() to find the word "Python" in a string.\nimport re\n',
          solutionCode: 'import re\nm = re.search("Python", "I love Python!")\nprint(m.group())',
          expectedOutput: 'Python'
        },
        {
          id: 20, level: 20, titleKey: 'python_testing', icon: 'brain', xp: 40, color: '#8e44ad', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'py_challenge_20', estimatedMinutes: 12,
          difficulty: 'Advanced', tags: ['Testing', 'assert'],
          hintKey: 'py_hint_20',
          starterCode: '# Use an assert statement to verify that 2 + 2 equals 4.\n# Then print "Tests passed!".\n',
          solutionCode: 'assert 2 + 2 == 4\nprint("Tests passed!")',
          expectedOutput: 'Tests passed!'
        },
        {
          id: 21, level: 21, titleKey: 'python_master_project', icon: 'trophy', xp: 150, color: '#6c0032', type: 'project', nodeType: 'trophy',
          challengeDescriptionKey: 'py_challenge_21', estimatedMinutes: 40,
          difficulty: 'Expert', tags: ['Project', 'Python', 'Expert'],
          hintKey: 'py_hint_21',
          starterCode: '# Master Project: Word frequency counter.\n# Count how many times each word appears in a sentence.\nsentence = "the cat sat on the mat the cat"\n',
          solutionCode: 'sentence = "the cat sat on the mat the cat"\nwords = sentence.split()\ncounts = {}\nfor w in words:\n  counts[w] = counts.get(w, 0) + 1\nprint(counts["the"])',
          expectedOutput: '3'
        },
      ],
    },
  ],
  javascript: [
    {
      id: 'js_basics',
      titleKey: 'javascript',
      lessons: [
        {
          id: 1, level: 1, titleKey: 'js_vars_alerts', icon: 'brain', xp: 15, color: '#f1e05a', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_1',
          explanationKey: 'js_explain_1',
          hintKey: 'js_hint_1',
          estimatedMinutes: 8,
          difficulty: 'Beginner',
          tags: ['Console', 'Output'],
          objectivesKey: 'js_obj_1',
          proTipKey: 'js_tip_1',
          starterCode: `// Use console.log() to print "Hello, JavaScript!".\n\n`,
          solutionCode: `console.log("Hello, JavaScript!");`,
          expectedOutput: "Hello, JavaScript!",
          questions: [
            {
              questionKey: 'js_q1_q1',
              optionKeys: ['js_q1_o1a', 'js_q1_o1b', 'js_q1_o1c', 'js_q1_o1d'],
              correctIndex: 1,
              feedbackKey: 'js_q1_f1'
            },
            {
              questionKey: 'js_q1_q2',
              optionKeys: ['js_q1_o2a', 'js_q1_o2b', 'js_q1_o2c', 'js_q1_o2d'],
              correctIndex: 0,
              feedbackKey: 'js_q1_f2'
            },
            {
              questionKey: 'js_q1_q3',
              optionKeys: ['js_q1_o3a', 'js_q1_o3b', 'js_q1_o3c', 'js_q1_o3d'],
              correctIndex: 3,
              feedbackKey: 'js_q1_f3'
            },
          ]
        },
        {
          id: 2, level: 2, titleKey: 'js_dom', icon: 'brain', xp: 20, color: '#f1e05a', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_2',
          explanationKey: 'js_explain_2',
          hintKey: 'js_hint_2',
          estimatedMinutes: 10,
          difficulty: 'Beginner',
          tags: ['Variables', 'Types'],
          objectivesKey: 'js_obj_2',
          proTipKey: 'js_tip_2',
          starterCode: '// Create a variable named "score" using "let" and set it to 100.\n// Then log it to the console.\n\n',
          solutionCode: 'let score = 100;\nconsole.log(score);',
          expectedOutput: "100"
        },
        {
          id: 3, level: 3, titleKey: 'js_loops_conditionals', icon: 'star', xp: 25, color: '#f1e05a', type: 'quiz', nodeType: 'quiz',
          challengeDescriptionKey: 'js_challenge_3',
          explanationKey: 'js_explain_3',
          hintKey: 'js_hint_3',
          estimatedMinutes: 12,
          difficulty: 'Beginner',
          tags: ['IfElse', 'Logic'],
          objectivesKey: 'js_obj_3',
          proTipKey: 'js_tip_3',
          starterCode: '// Set let raining = true;\n// If it is raining, log "Take umbrella", else "Go walk"\n\n',
          solutionCode: 'let raining = true;\nif (raining) {\n  console.log("Take umbrella");\n} else {\n  console.log("Go walk");\n}',
          expectedOutput: 'Take umbrella'
        },
        {
          id: 4, level: 4, titleKey: 'js_functions_events', icon: 'brain', xp: 30, color: '#f1e05a', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_4',
          explanationKey: 'js_explain_4',
          hintKey: 'js_hint_4',
          estimatedMinutes: 15,
          difficulty: 'Intermediate',
          tags: ['Functions'],
          objectivesKey: 'js_obj_4',
          proTipKey: 'js_tip_4',
          starterCode: '// Write a function named "sayHi" that logs "Hi!"\n// Then call it.\n\n',
          solutionCode: 'function sayHi() {\n  console.log("Hi!");\n}\nsayHi();',
          expectedOutput: "Hi!"
        },
        {
          id: 5, level: 5, titleKey: 'js_interactive_story', icon: 'trophy', xp: 50, color: '#f39c12', type: 'project', nodeType: 'trophy',
          challengeDescriptionKey: 'js_challenge_5',
          explanationKey: 'js_explain_5',
          hintKey: 'js_hint_5',
          estimatedMinutes: 20,
          difficulty: 'Intermediate',
          tags: ['Arrays', 'Data'],
          objectivesKey: 'js_obj_5',
          proTipKey: 'js_tip_5',
          starterCode: '// Create an array named "colors" with "red" and "blue"\n// Log the first color.\n\n',
          solutionCode: 'let colors = ["red", "blue"];\nconsole.log(colors[0]);',
          expectedOutput: 'red'
        },
      ],
    },
    {
      id: 'js_async',
      titleKey: 'js_async_title',
      lessons: [
        {
          id: 6, level: 6, titleKey: 'js_promises', icon: 'brain', xp: 25, color: '#f1e05a', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_6',
          starterCode: '// Create a resolved promise with the value "Done!".\n// Log the value using .then().\n',
          solutionCode: 'Promise.resolve("Done!").then(val => console.log(val));',
          expectedOutput: 'Done!'
        },
        {
          id: 7, level: 7, titleKey: 'js_async_await', icon: 'brain', xp: 30, color: '#f1e05a', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_7',
          starterCode: '// Write an async function that returns "Async!".\n// Call it and log the result.\n',
          solutionCode: 'async function test() { return "Async!"; }\ntest().then(val => console.log(val));',
          expectedOutput: 'Async!'
        },
        { id: 8, level: 8, titleKey: 'js_fetch_api', icon: 'star', xp: 35, color: '#f1e05a', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: 'js_challenge_8', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    },
    {
      // ── JavaScript Chapter 3: DOM, APIs & Beyond ──────────────────────────
      id: 'js_pro',
      titleKey: 'js_ch3_title',
      lessons: [
        {
          id: 9, level: 9, titleKey: 'js_array_methods', icon: 'brain', xp: 30, color: '#f39c12', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_9',
          estimatedMinutes: 12,
          difficulty: 'Intermediate',
          tags: ['Arrays', 'map', 'filter'],
          hintKey: 'js_hint_9',
          starterCode: '// Use .map() to double each number in [1, 2, 3].\n// Then log the result.\n',
          solutionCode: 'const result = [1,2,3].map(n => n * 2);\nconsole.log(result);',
          expectedOutput: '[2, 4, 6]'
        },
        {
          id: 10, level: 10, titleKey: 'js_objects', icon: 'brain', xp: 30, color: '#f39c12', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_10',
          estimatedMinutes: 10,
          difficulty: 'Intermediate',
          tags: ['Objects', 'OOP'],
          hintKey: 'js_hint_10',
          starterCode: '// Create an object car with brand "Toyota".\n// Log car.brand.\n',
          solutionCode: 'const car = { brand: "Toyota" };\nconsole.log(car.brand);',
          expectedOutput: 'Toyota'
        },
        {
          id: 11, level: 11, titleKey: 'js_closures', icon: 'star', xp: 40, color: '#f39c12', type: 'quiz', nodeType: 'quiz',
          challengeDescriptionKey: 'js_challenge_11',
          estimatedMinutes: 15,
          difficulty: 'Intermediate',
          tags: ['Closures', 'Scope'],
          hintKey: 'js_hint_11',
          starterCode: '// Write a counter function that increments on each call.\n',
          solutionCode: 'function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst c = makeCounter();\nconsole.log(c()); // 1\nconsole.log(c()); // 2',
          expectedOutput: '1\n2'
        },
        {
          id: 12, level: 12, titleKey: 'js_classes', icon: 'brain', xp: 40, color: '#f39c12', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_12',
          estimatedMinutes: 15,
          difficulty: 'Intermediate',
          tags: ['Classes', 'OOP'],
          hintKey: 'js_hint_12',
          starterCode: '// Create a class Animal with a speak() method that logs "Grr!".\n// Instantiate it and call speak().\n',
          solutionCode: 'class Animal {\n  speak() { console.log("Grr!"); }\n}\nnew Animal().speak();',
          expectedOutput: 'Grr!'
        },
        {
          id: 13, level: 13, titleKey: 'js_error_handling', icon: 'brain', xp: 35, color: '#f39c12', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_13',
          estimatedMinutes: 12,
          difficulty: 'Intermediate',
          tags: ['Errors', 'try/catch'],
          hintKey: 'js_hint_13',
          starterCode: '// Use try/catch to catch an error when calling an undefined function.\n',
          solutionCode: 'try {\n  undefinedFn();\n} catch (e) {\n  console.log("Error caught!");\n}',
          expectedOutput: 'Error caught!'
        },
        {
          id: 14, level: 14, titleKey: 'js_string_methods', icon: 'brain', xp: 30, color: '#f39c12', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_14',
          estimatedMinutes: 10,
          difficulty: 'Intermediate',
          tags: ['Strings', 'Methods'],
          hintKey: 'js_hint_14',
          starterCode: '// Turn "hello world" into uppercase and log it.\n',
          solutionCode: 'console.log("hello world".toUpperCase());',
          expectedOutput: 'HELLO WORLD'
        },
        {
          id: 15, level: 15, titleKey: 'js_final_project', icon: 'trophy', xp: 100, color: '#e67e22', type: 'project', nodeType: 'trophy',
          challengeDescriptionKey: 'js_challenge_15',
          estimatedMinutes: 30,
          difficulty: 'Advanced',
          tags: ['Project', 'JavaScript'],
          hintKey: 'js_hint_15',
          starterCode: '// Final challenge: Score calculator!\n// Given an array of scores, log the highest score.\nconst scores = [72, 95, 88, 61, 100];\n',
          solutionCode: 'const scores = [72, 95, 88, 61, 100];\nconsole.log(Math.max(...scores));',
          expectedOutput: '100'
        },
      ],
    },
    {
      // ── JavaScript Chapter 4: Advanced JS ─────────────────────────────────
      id: 'js_advanced',
      titleKey: 'js_ch4_title',
      lessons: [
        {
          id: 16, level: 16, titleKey: 'js_destructuring', icon: 'brain', xp: 35, color: '#9b59b6', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_16', estimatedMinutes: 10,
          difficulty: 'Advanced', tags: ['Destructuring', 'ES6'],
          hintKey: 'js_hint_16',
          starterCode: '// Destructure name and age from the object below.\n// Then log the name.\nconst person = { name: "Ali", age: 20 };\n',
          solutionCode: 'const person = { name: "Ali", age: 20 };\nconst { name } = person;\nconsole.log(name);',
          expectedOutput: 'Ali'
        },
        {
          id: 17, level: 17, titleKey: 'js_spread_rest', icon: 'brain', xp: 35, color: '#9b59b6', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_17', estimatedMinutes: 10,
          difficulty: 'Advanced', tags: ['Spread', 'Rest', 'ES6'],
          hintKey: 'js_hint_17',
          starterCode: '// Merge two arrays using spread syntax.\n// Then log the merged array length.\nconst a = [1, 2];\nconst b = [3, 4];\n',
          solutionCode: 'const a = [1, 2];\nconst b = [3, 4];\nconst merged = [...a, ...b];\nconsole.log(merged.length);',
          expectedOutput: '4'
        },
        {
          id: 18, level: 18, titleKey: 'js_generators', icon: 'star', xp: 45, color: '#9b59b6', type: 'quiz', nodeType: 'quiz',
          challengeDescriptionKey: 'js_challenge_18', estimatedMinutes: 15,
          difficulty: 'Advanced', tags: ['Generators', 'yield'],
          hintKey: 'js_hint_18',
          starterCode: '// Create a generator that yields "A" then "B".\n// Log the first yielded value.\n',
          solutionCode: 'function* letters() { yield "A"; yield "B"; }\nconst gen = letters();\nconsole.log(gen.next().value);',
          expectedOutput: 'A'
        },
        {
          id: 19, level: 19, titleKey: 'js_regex', icon: 'brain', xp: 45, color: '#9b59b6', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_19', estimatedMinutes: 15,
          difficulty: 'Advanced', tags: ['Regex', 'Patterns'],
          hintKey: 'js_hint_19',
          starterCode: '// Use a regex to test if "hello world" contains "world".\n// Log true or false.\n',
          solutionCode: 'console.log(/world/.test("hello world"));',
          expectedOutput: 'true'
        },
        {
          id: 20, level: 20, titleKey: 'js_prototype', icon: 'brain', xp: 50, color: '#9b59b6', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_20', estimatedMinutes: 15,
          difficulty: 'Expert', tags: ['Prototype', 'OOP'],
          hintKey: 'js_hint_20',
          starterCode: '// Add a greet() method to the prototype of a Person constructor.\nfunction Person(name) { this.name = name; }\n',
          solutionCode: 'function Person(name) { this.name = name; }\nPerson.prototype.greet = function() { console.log("Hi, " + this.name); };\nnew Person("Sara").greet();',
          expectedOutput: 'Hi, Sara'
        },
        {
          id: 21, level: 21, titleKey: 'js_master_project', icon: 'trophy', xp: 150, color: '#a04000', type: 'project', nodeType: 'trophy',
          challengeDescriptionKey: 'js_challenge_21', estimatedMinutes: 40,
          difficulty: 'Expert', tags: ['Project', 'JavaScript', 'Expert'],
          hintKey: 'js_hint_21',
          starterCode: '// Master Project: Find the most frequent word in a sentence.\nconst text = "code is great and code is fun";\n',
          solutionCode: 'const text = "code is great and code is fun";\nconst freq = {};\ntext.split(" ").forEach(w => freq[w] = (freq[w]||0)+1);\nconst top = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0][0];\nconsole.log(top);',
          expectedOutput: 'code'
        },
      ],
    },
  ],
  lua: [
    {
      id: 'lua_basics',
      titleKey: 'lua_intro',
      lessons: [
        { id: 1, level: 1, titleKey: 'lua_intro', icon: 'brain', xp: 15, color: '#000080', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: 'print("Hello Lua")', solutionCode: 'print("Hello Lua")', expectedOutput: 'Hello Lua' },
        { id: 2, level: 2, titleKey: 'lua_logic', icon: 'brain', xp: 20, color: '#000080', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 3, level: 3, titleKey: 'lua_functions', icon: 'star', xp: 25, color: '#000080', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'lua_tables', icon: 'brain', xp: 30, color: '#000080', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 5, level: 5, titleKey: 'lua_text_adventure', icon: 'trophy', xp: 50, color: '#000080', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  web_dev: [
    {
      id: 'web_basics',
      titleKey: 'web_dev',
      lessons: [
        {
          id: 1, level: 1, titleKey: 'web_html_basics', icon: 'brain', xp: 15, color: '#e34f26', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_1',
          explanationKey: 'web_explain_1',
          hintKey: 'web_hint_1',
          estimatedMinutes: 8,
          difficulty: 'Beginner',
          tags: ['HTML', 'Tags'],
          objectivesKey: 'web_obj_1',
          proTipKey: 'web_tip_1',
          starterCode: '// In this world, we use console.log to simulate HTML tags!\n// Log "<h1>Hello World</h1>" to the console.\n\n',
          solutionCode: 'console.log("<h1>Hello World</h1>");',
          expectedOutput: '<h1>Hello World</h1>'
        },
        {
          id: 2, level: 2, titleKey: 'web_images_links', icon: 'brain', xp: 20, color: '#e34f26', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_2',
          explanationKey: 'web_explain_2',
          hintKey: 'web_hint_2',
          estimatedMinutes: 10,
          difficulty: 'Beginner',
          tags: ['HTML', 'Images'],
          objectivesKey: 'web_obj_2',
          proTipKey: 'web_tip_2',
          starterCode: '// Log an <img> tag with src="magic.png".\n\n',
          solutionCode: 'console.log(\'<img src="magic.png">\');',
          expectedOutput: '<img src="magic.png">'
        },
        {
          id: 3, level: 3, titleKey: 'web_css_intro', icon: 'star', xp: 25, color: '#1572b6', type: 'quiz', nodeType: 'quiz',
          challengeDescriptionKey: 'web_challenge_3',
          explanationKey: 'web_explain_3',
          hintKey: 'web_hint_3',
          estimatedMinutes: 10,
          difficulty: 'Beginner',
          tags: ['CSS', 'Style'],
          objectivesKey: 'web_obj_3',
          proTipKey: 'web_tip_3',
          starterCode: '// We are styling a button! Log "color: blue;"\n\n',
          solutionCode: 'console.log("color: blue;");',
          expectedOutput: 'color: blue;'
        },
        {
          id: 4, level: 4, titleKey: 'web_css_layout', icon: 'brain', xp: 30, color: '#1572b6', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_4',
          explanationKey: 'web_explain_4',
          hintKey: 'web_hint_4',
          estimatedMinutes: 12,
          difficulty: 'Intermediate',
          tags: ['CSS', 'Flexbox'],
          objectivesKey: 'web_obj_4',
          proTipKey: 'web_tip_4',
          starterCode: '// Log "display: flex" to simulate a CSS layout property.\n\n',
          solutionCode: 'console.log("display: flex");',
          expectedOutput: 'display: flex'
        },
        {
          id: 5, level: 5, titleKey: 'web_animal_page', icon: 'trophy', xp: 50, color: '#333333', type: 'project', nodeType: 'trophy',
          challengeDescriptionKey: 'web_challenge_5',
          explanationKey: 'web_explain_5',
          hintKey: 'web_hint_5',
          estimatedMinutes: 20,
          difficulty: 'Intermediate',
          tags: ['HTML', 'Project'],
          objectivesKey: 'web_obj_5',
          proTipKey: 'web_tip_5',
          starterCode: '// Create a full div!\n// Log "<div>Animal Page</div>"\n\n',
          solutionCode: 'console.log("<div>Animal Page</div>");',
          expectedOutput: '<div>Animal Page</div>'
        },
      ],
    },
    {
      id: 'web_advanced',
      titleKey: 'web_advanced_title',
      lessons: [
        {
          id: 6, level: 6, titleKey: 'web_flexbox', icon: 'brain', xp: 25, color: '#1572b6', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_6',
          starterCode: '// Log "justify-content: center".\n',
          solutionCode: 'console.log("justify-content: center");',
          expectedOutput: 'justify-content: center'
        },
        {
          id: 7, level: 7, titleKey: 'web_grid', icon: 'brain', xp: 30, color: '#1572b6', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_7',
          starterCode: '// Log "grid-template-columns: 1fr 1fr".\n',
          solutionCode: 'console.log("grid-template-columns: 1fr 1fr");',
          expectedOutput: 'grid-template-columns: 1fr 1fr'
        },
        { id: 8, level: 8, titleKey: 'web_responsive_design', icon: 'star', xp: 35, color: '#1572b6', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: 'web_challenge_8', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    },
    {
      // ── Web Dev Chapter 3: Interactive & Responsive Web ──────────────────
      id: 'web_pro',
      titleKey: 'web_ch3_title',
      lessons: [
        {
          id: 9, level: 9, titleKey: 'web_forms', icon: 'brain', xp: 30, color: '#e74c3c', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_9',
          estimatedMinutes: 12,
          difficulty: 'Intermediate',
          tags: ['HTML', 'Forms'],
          hintKey: 'web_hint_9',
          starterCode: '// Log an HTML form input tag.\n// Log: "<input type=\'text\' placeholder=\'Name\'>"\n',
          solutionCode: "console.log(\"<input type='text' placeholder='Name'>\");",
          expectedOutput: "<input type='text' placeholder='Name'>"
        },
        {
          id: 10, level: 10, titleKey: 'web_css_variables', icon: 'brain', xp: 30, color: '#e74c3c', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_10',
          estimatedMinutes: 10,
          difficulty: 'Intermediate',
          tags: ['CSS', 'Variables'],
          hintKey: 'web_hint_10',
          starterCode: '// CSS Custom Variables! Log "--primary-color: #3498db;"\n',
          solutionCode: 'console.log("--primary-color: #3498db;");',
          expectedOutput: '--primary-color: #3498db;'
        },
        {
          id: 11, level: 11, titleKey: 'web_animations', icon: 'star', xp: 40, color: '#e74c3c', type: 'quiz', nodeType: 'quiz',
          challengeDescriptionKey: 'web_challenge_11',
          estimatedMinutes: 15,
          difficulty: 'Intermediate',
          tags: ['CSS', 'Animation'],
          hintKey: 'web_hint_11',
          starterCode: '// Log a CSS transition rule: "transition: all 0.3s ease;"\n',
          solutionCode: 'console.log("transition: all 0.3s ease;");',
          expectedOutput: 'transition: all 0.3s ease;'
        },
        {
          id: 12, level: 12, titleKey: 'web_semantic_html', icon: 'brain', xp: 30, color: '#e74c3c', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_12',
          estimatedMinutes: 10,
          difficulty: 'Intermediate',
          tags: ['HTML', 'Semantics'],
          hintKey: 'web_hint_12',
          starterCode: '// Log a semantic nav element: "<nav>Menu</nav>"\n',
          solutionCode: 'console.log("<nav>Menu</nav>");',
          expectedOutput: '<nav>Menu</nav>'
        },
        {
          id: 13, level: 13, titleKey: 'web_media_queries', icon: 'brain', xp: 40, color: '#e74c3c', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_13',
          estimatedMinutes: 15,
          difficulty: 'Intermediate',
          tags: ['CSS', 'Responsive'],
          hintKey: 'web_hint_13',
          starterCode: '// Log a media query rule: "@media (max-width: 600px)"\n',
          solutionCode: 'console.log("@media (max-width: 600px)");',
          expectedOutput: '@media (max-width: 600px)'
        },
        {
          id: 14, level: 14, titleKey: 'web_pseudo_selectors', icon: 'brain', xp: 35, color: '#e74c3c', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_14',
          estimatedMinutes: 12,
          difficulty: 'Intermediate',
          tags: ['CSS', 'Selectors'],
          hintKey: 'web_hint_14',
          starterCode: '// Log a CSS hover pseudo-selector: "button:hover { ... }"\n',
          solutionCode: 'console.log("button:hover { color: white; }");',
          expectedOutput: 'button:hover { color: white; }'
        },
        {
          id: 15, level: 15, titleKey: 'web_final_project', icon: 'trophy', xp: 100, color: '#8e44ad', type: 'project', nodeType: 'trophy',
          challengeDescriptionKey: 'web_challenge_15',
          estimatedMinutes: 30,
          difficulty: 'Advanced',
          tags: ['Project', 'HTML', 'CSS'],
          hintKey: 'web_hint_15',
          starterCode: '// Final challenge: Complete a webpage structure!\n// Log the full HTML skeleton: "<html><head></head><body></body></html>"\n',
          solutionCode: 'console.log("<html><head></head><body></body></html>");',
          expectedOutput: '<html><head></head><body></body></html>'
        },
      ],
    },
    {
      // ── Web Dev Chapter 4: Modern & Accessible Web ────────────────────────
      id: 'web_modern',
      titleKey: 'web_ch4_title',
      lessons: [
        {
          id: 16, level: 16, titleKey: 'web_css_grid_advanced', icon: 'brain', xp: 35, color: '#c0392b', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_16', estimatedMinutes: 15,
          difficulty: 'Advanced', tags: ['CSS', 'Grid', 'Layout'],
          hintKey: 'web_hint_16',
          starterCode: '// Log a CSS grid area definition: "grid-template-areas: \'header header\' \'sidebar main\'"\n',
          solutionCode: "console.log(\"grid-template-areas: 'header header' 'sidebar main'\");",
          expectedOutput: "grid-template-areas: 'header header' 'sidebar main'"
        },
        {
          id: 17, level: 17, titleKey: 'web_js_events', icon: 'brain', xp: 35, color: '#c0392b', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_17', estimatedMinutes: 15,
          difficulty: 'Advanced', tags: ['JavaScript', 'Events', 'DOM'],
          hintKey: 'web_hint_17',
          starterCode: '// Simulate an event: log "Button clicked!"\nconsole.log("Button clicked!");\n',
          solutionCode: 'console.log("Button clicked!");',
          expectedOutput: 'Button clicked!'
        },
        {
          id: 18, level: 18, titleKey: 'web_accessibility', icon: 'star', xp: 30, color: '#c0392b', type: 'quiz', nodeType: 'quiz',
          challengeDescriptionKey: 'web_challenge_18', estimatedMinutes: 12,
          difficulty: 'Advanced', tags: ['a11y', 'ARIA'],
          hintKey: 'web_hint_18',
          starterCode: '// Log an accessible image tag with an alt attribute.\n',
          solutionCode: 'console.log(\"<img src=\'photo.png\' alt=\'A sunset\'>\");',
          expectedOutput: "<img src='photo.png' alt='A sunset'>"
        },
        {
          id: 19, level: 19, titleKey: 'web_local_storage', icon: 'brain', xp: 40, color: '#c0392b', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_19', estimatedMinutes: 12,
          difficulty: 'Advanced', tags: ['Browser', 'Storage'],
          hintKey: 'web_hint_19',
          starterCode: '// Log the JS code to save a value to localStorage.\n',
          solutionCode: 'console.log("localStorage.setItem(\'theme\', \'dark\')");',
          expectedOutput: "localStorage.setItem('theme', 'dark')"
        },
        {
          id: 20, level: 20, titleKey: 'web_performance', icon: 'brain', xp: 45, color: '#c0392b', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'web_challenge_20', estimatedMinutes: 15,
          difficulty: 'Expert', tags: ['Performance', 'Optimization'],
          hintKey: 'web_hint_20',
          starterCode: '// Log a performance tip: "Use lazy loading for images: loading=\'lazy\'"\n',
          solutionCode: 'console.log("Use lazy loading for images: loading=\'lazy\'");',
          expectedOutput: "Use lazy loading for images: loading='lazy'"
        },
        {
          id: 21, level: 21, titleKey: 'web_master_project', icon: 'trophy', xp: 150, color: '#4a235a', type: 'project', nodeType: 'trophy',
          challengeDescriptionKey: 'web_challenge_21', estimatedMinutes: 40,
          difficulty: 'Expert', tags: ['Project', 'HTML', 'CSS', 'Expert'],
          hintKey: 'web_hint_21',
          starterCode: '// Master Project: Full page structure!\n// Log the HTML for a complete responsive page header.\n',
          solutionCode: 'console.log("<header class=\'responsive-header\'><nav>Menu</nav></header>");',
          expectedOutput: "<header class='responsive-header'><nav>Menu</nav></header>"
        },
      ],
    },
  ],
  'c++': [
    {
      id: 'cpp_basics',
      titleKey: 'c++',
      lessons: [
        {
          id: 1, level: 1, titleKey: 'introduction', icon: '🐉', xp: 15, color: '#00599c', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'cpp_challenge_1',
          starterCode: '// Print "Hello C++!" using std::cout.\n#include <iostream>\n\nint main() {\n  \n  return 0;\n}',
          solutionCode: '#include <iostream>\n\nint main() {\n  std::cout << "Hello C++!";\n  return 0;\n}',
          expectedOutput: "Hello C++!"
        },
        {
          id: 2, level: 2, titleKey: 'cpp_pointers', icon: 'brain', xp: 25, color: '#00599c', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'cpp_challenge_2',
          starterCode: '// Create an int pointer p pointing to x.\nint x = 10;\n',
          solutionCode: 'int x = 10; int* p = &x; console.log(*p);',
          expectedOutput: '10'
        },
        { id: 3, level: 3, titleKey: 'cpp_classes', icon: 'star', xp: 30, color: '#00599c', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: 'cpp_challenge_3', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'cpp_stl', icon: 'brain', xp: 35, color: '#00599c', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: 'cpp_challenge_4', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 5, level: 5, titleKey: 'cpp_calculator', icon: 'trophy', xp: 60, color: '#004482', type: 'project', nodeType: 'trophy', challengeDescriptionKey: 'cpp_challenge_5', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    },
    {
      id: 'cpp_advanced',
      titleKey: 'cpp_advanced_title',
      lessons: [
        { id: 6, level: 6, titleKey: 'cpp_templates', icon: 'brain', xp: 30, color: '#00599c', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 7, level: 7, titleKey: 'cpp_memory', icon: 'brain', xp: 35, color: '#00599c', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 8, level: 8, titleKey: 'cpp_quiz_adv', icon: 'star', xp: 40, color: '#00599c', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  c_sharp: [
    {
      id: 'csharp_basics',
      titleKey: 'c_sharp',
      lessons: [
        { id: 1, level: 1, titleKey: 'csharp_dotnet', icon: 'brain', xp: 15, color: '#9b4993', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 2, level: 2, titleKey: 'csharp_linq', icon: 'brain', xp: 25, color: '#9b4993', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 3, level: 3, titleKey: 'csharp_async', icon: 'star', xp: 30, color: '#9b4993', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'csharp_todo_app', icon: 'trophy', xp: 50, color: '#68217a', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  java: [
    {
      id: 'java_basics',
      titleKey: 'java',
      lessons: [
        {
          id: 1, level: 1, titleKey: 'java_jvm', icon: 'brain', xp: 15, color: '#ea2d2e', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'java_challenge_1',
          starterCode: '// Print "Hello Java" using System.out.println.\n',
          solutionCode: 'System.out.println("Hello Java");',
          expectedOutput: 'Hello Java'
        },
        {
          id: 2, level: 2, titleKey: 'java_oop', icon: 'brain', xp: 25, color: '#ea2d2e', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'java_challenge_2',
          starterCode: '// Create a class Person with a name.\n',
          solutionCode: 'class Person { String name = "Bob"; } Person p = new Person(); System.out.println(p.name);',
          expectedOutput: 'Bob'
        },
        { id: 3, level: 3, titleKey: 'java_collections', icon: 'star', xp: 30, color: '#ea2d2e', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: 'java_challenge_3', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'java_bank_account', icon: 'trophy', xp: 50, color: '#5382a1', type: 'project', nodeType: 'trophy', challengeDescriptionKey: 'java_challenge_4', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    },
    {
      id: 'java_advanced',
      titleKey: 'java_advanced_title',
      lessons: [
        { id: 5, level: 5, titleKey: 'java_streams', icon: 'brain', xp: 30, color: '#ea2d2e', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 6, level: 6, titleKey: 'java_lambdas', icon: 'brain', xp: 35, color: '#ea2d2e', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 7, level: 7, titleKey: 'java_multithreading', icon: 'star', xp: 40, color: '#ea2d2e', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  kotlin: [
    {
      id: 'kotlin_basics',
      titleKey: 'kotlin',
      lessons: [
        { id: 1, level: 1, titleKey: 'kotlin_null_safety', icon: 'brain', xp: 15, color: '#7f52ff', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 2, level: 2, titleKey: 'kotlin_coroutines', icon: 'brain', xp: 25, color: '#7f52ff', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 3, level: 3, titleKey: 'kotlin_data_classes', icon: 'star', xp: 30, color: '#7f52ff', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'kotlin_button_clicker', icon: 'trophy', xp: 50, color: '#4d2ba4', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  swift: [
    {
      id: 'swift_basics',
      titleKey: 'swift',
      lessons: [
        { id: 1, level: 1, titleKey: 'swift_optionals', icon: 'brain', xp: 15, color: '#f05138', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 2, level: 2, titleKey: 'swift_swiftui', icon: 'brain', xp: 25, color: '#f05138', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 3, level: 3, titleKey: 'swift_closures', icon: 'star', xp: 30, color: '#f05138', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'swift_tip_calculator', icon: 'trophy', xp: 50, color: '#cc3f2b', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  go: [
    {
      id: 'go_basics',
      titleKey: 'go',
      lessons: [
        { id: 1, level: 1, titleKey: 'go_goroutines', icon: 'brain', xp: 20, color: '#00add8', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 2, level: 2, titleKey: 'go_channels', icon: 'brain', xp: 25, color: '#00add8', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 3, level: 3, titleKey: 'go_structs', icon: 'star', xp: 30, color: '#00add8', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'go_web_scraper', icon: 'trophy', xp: 60, color: '#007d9c', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  rust: [
    {
      id: 'rust_basics',
      titleKey: 'rust',
      lessons: [
        { id: 1, level: 1, titleKey: 'rust_ownership', icon: 'brain', xp: 25, color: '#000000', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 2, level: 2, titleKey: 'rust_enums', icon: 'brain', xp: 25, color: '#000000', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 3, level: 3, titleKey: 'rust_lifetimes', icon: 'star', xp: 35, color: '#000000', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'rust_word_counter', icon: 'trophy', xp: 70, color: '#dea584', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  php: [
    {
      id: 'php_basics',
      titleKey: 'php',
      lessons: [
        { id: 1, level: 1, titleKey: 'php_server_basics', icon: 'brain', xp: 15, color: '#777bb4', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 2, level: 2, titleKey: 'php_arrays', icon: 'brain', xp: 20, color: '#777bb4', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 3, level: 3, titleKey: 'php_forms', icon: 'star', xp: 25, color: '#777bb4', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'php_contact_form', icon: 'trophy', xp: 50, color: '#4f5b93', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  ruby: [
    {
      id: 'ruby_basics',
      titleKey: 'ruby',
      lessons: [
        { id: 1, level: 1, titleKey: 'ruby_blocks', icon: 'brain', xp: 20, color: '#701516', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 2, level: 2, titleKey: 'ruby_gems', icon: 'brain', xp: 25, color: '#701516', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 3, level: 3, titleKey: 'ruby_metaprogramming', icon: 'star', xp: 35, color: '#701516', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'ruby_blog_generator', icon: 'trophy', xp: 60, color: '#cc342d', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  typescript: [
    {
      id: 'ts_basics',
      titleKey: 'typescript',
      lessons: [
        {
          id: 1, level: 1, titleKey: 'ts_types', icon: 'brain', xp: 20, color: '#3178c6', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'ts_challenge_1',
          starterCode: '// Define a variable "name" as a string.\n',
          solutionCode: 'let name: string = "Alice"; console.log(name);',
          expectedOutput: 'Alice'
        },
        {
          id: 2, level: 2, titleKey: 'ts_interfaces', icon: 'brain', xp: 25, color: '#3178c6', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'ts_challenge_2',
          starterCode: '// Create an interface User with a name property.\n',
          solutionCode: 'interface User { name: string; } let u: User = { name: "Bob" }; console.log(u.name);',
          expectedOutput: 'Bob'
        },
        { id: 3, level: 3, titleKey: 'ts_generics', icon: 'star', xp: 35, color: '#3178c6', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: 'ts_challenge_3', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'ts_todo_list', icon: 'trophy', xp: 60, color: '#235a97', type: 'project', nodeType: 'trophy', challengeDescriptionKey: 'ts_challenge_4', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  sql: [
    {
      id: 'sql_basics',
      titleKey: 'sql',
      lessons: [
        {
          id: 1, level: 1, titleKey: 'sql_select', icon: 'brain', xp: 15, color: '#336791', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'sql_challenge_1',
          starterCode: '-- Select everything from users table.\n',
          solutionCode: 'SELECT * FROM users;',
          expectedOutput: 'All Users'
        },
        {
          id: 2, level: 2, titleKey: 'sql_where', icon: 'brain', xp: 20, color: '#336791', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'sql_challenge_2',
          starterCode: '-- Select users where age > 18.\n',
          solutionCode: 'SELECT * FROM users WHERE age > 18;',
          expectedOutput: 'Adult Users'
        },
        { id: 3, level: 3, titleKey: 'sql_joins', icon: 'star', xp: 30, color: '#336791', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: 'sql_challenge_3', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'sql_query_db', icon: 'trophy', xp: 50, color: '#2f5e85', type: 'project', nodeType: 'trophy', challengeDescriptionKey: 'sql_challenge_4', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    },
    {
      id: 'sql_advanced',
      titleKey: 'sql_advanced_title',
      lessons: [
        { id: 5, level: 5, titleKey: 'sql_subqueries', icon: 'brain', xp: 25, color: '#336791', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 6, level: 6, titleKey: 'sql_transactions', icon: 'brain', xp: 30, color: '#336791', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 7, level: 7, titleKey: 'sql_indexing', icon: 'star', xp: 35, color: '#336791', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  r: [
    {
      id: 'r_basics',
      titleKey: 'r',
      lessons: [
        { id: 1, level: 1, titleKey: 'r_data_frames', icon: 'brain', xp: 20, color: '#276dc3', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 2, level: 2, titleKey: 'r_vectors', icon: 'brain', xp: 25, color: '#276dc3', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 3, level: 3, titleKey: 'r_plotting', icon: 'star', xp: 35, color: '#276dc3', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'r_analyze_data', icon: 'trophy', xp: 60, color: '#1a59a1', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  dart: [
    {
      id: 'dart_basics',
      titleKey: 'dart',
      lessons: [
        { id: 1, level: 1, titleKey: 'dart_futures', icon: 'brain', xp: 20, color: '#00d2b8', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 2, level: 2, titleKey: 'dart_widgets', icon: 'brain', xp: 25, color: '#00d2b8', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 3, level: 3, titleKey: 'dart_state', icon: 'star', xp: 35, color: '#00d2b8', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'dart_counter_app', icon: 'trophy', xp: 60, color: '#00a38d', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  scala: [
    {
      id: 'scala_basics',
      titleKey: 'scala',
      lessons: [
        { id: 1, level: 1, titleKey: 'scala_fp', icon: 'brain', xp: 25, color: '#de3423', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 2, level: 2, titleKey: 'scala_case_classes', icon: 'brain', xp: 30, color: '#de3423', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 3, level: 3, titleKey: 'scala_futures', icon: 'star', xp: 40, color: '#de3423', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
        { id: 4, level: 4, titleKey: 'scala_data_transformer', icon: 'trophy', xp: 75, color: '#b22415', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    }
  ],
  math: [
    {
      id: 'math_basics',
      titleKey: 'math_games',
      lessons: [
        {
          id: 1, level: 1, titleKey: 'math_addition', icon: 'brain', xp: 15, color: '#6366f1', type: 'lesson', nodeType: 'quiz',
          challengeDescriptionKey: 'math_challenge_1', starterCode: '', solutionCode: '', expectedOutput: ''
        },
        {
          id: 2, level: 2, titleKey: 'math_subtraction', icon: 'brain', xp: 20, color: '#6366f1', type: 'lesson', nodeType: 'quiz',
          challengeDescriptionKey: 'math_challenge_2', starterCode: '', solutionCode: '', expectedOutput: ''
        },
        {
          id: 3, level: 3, titleKey: 'math_puzzle', icon: 'star', xp: 30, color: '#6366f1', type: 'quiz', nodeType: 'quiz',
          challengeDescriptionKey: 'math_challenge_3', starterCode: '', solutionCode: '', expectedOutput: ''
        },
        {
          id: 4, level: 4, titleKey: 'math_boss', icon: 'trophy', xp: 50, color: '#4f46e5', type: 'project', nodeType: 'trophy',
          challengeDescriptionKey: 'math_challenge_4', starterCode: '', solutionCode: '', expectedOutput: ''
        },
      ],
    }
  ],
};

export const BADGES_BY_PATH: { [key: string]: Badge[] } = {
  block_coding: [
    { id: 'bc_badge1', lessonId: 1, icon: '🔗', titleKey: 'sequences_badge' },
    { id: 'bc_badge2', lessonId: 2, icon: '🔄', titleKey: 'loop_master_badge' },
    { id: 'bc_badge3', lessonId: 3, icon: '⚡️', titleKey: 'event_expert_badge' },
    { id: 'bc_badge4', lessonId: 4, icon: '🏆', titleKey: 'maze_master_badge' },
  ],
  python: [
    { id: 'py_badge1', lessonId: 1, icon: '🔢', titleKey: 'number_ninja_badge' },
    { id: 'py_badge2', lessonId: 2, icon: '🔄', titleKey: 'python_looper_badge' },
    { id: 'py_badge3', lessonId: 4, icon: '⚙️', titleKey: 'function_fanatic_badge' },
    { id: 'py_badge4', lessonId: 5, icon: '🏆', titleKey: 'quiz_whiz_badge' },
  ],
  javascript: [
    { id: 'js_badge1', lessonId: 1, icon: '🔔', titleKey: 'alerter_badge' },
    { id: 'js_badge2', lessonId: 2, icon: '📄', titleKey: 'dom_dynamo_badge' },
    { id: 'js_badge3', lessonId: 4, icon: '🖱️', titleKey: 'event_handler_badge' },
    { id: 'js_badge4', lessonId: 5, icon: '🏆', titleKey: 'story_spinner_badge' },
  ],
  lua: [
    { id: 'lua_badge1', lessonId: 1, icon: '👋', titleKey: 'lua_printer_badge' },
    { id: 'lua_badge2', lessonId: 2, icon: '🧠', titleKey: 'lua_logic_badge' },
    { id: 'lua_badge3', lessonId: 3, icon: '🛠️', titleKey: 'lua_function_badge' },
    { id: 'lua_badge4', lessonId: 5, icon: '🏆', titleKey: 'lua_adventure_badge' },
  ],
  web_dev: [
    { id: 'web_badge1', lessonId: 1, icon: '<h1>', titleKey: 'web_tagger_badge' },
    { id: 'web_badge2', lessonId: 2, icon: '🔗', titleKey: 'web_linker_badge' },
    { id: 'web_badge3', lessonId: 3, icon: '🎨', titleKey: 'web_styler_badge' },
    { id: 'web_badge4', lessonId: 5, icon: '🏆', titleKey: 'web_builder_badge' },
  ],
  'c++': [
    { id: 'cpp_badge1', lessonId: 1, icon: '👉', titleKey: 'cpp_badge_pointer' },
    { id: 'cpp_badge2', lessonId: 2, icon: '🏛️', titleKey: 'cpp_badge_oop' },
    { id: 'cpp_badge3', lessonId: 3, icon: '📚', titleKey: 'cpp_badge_stl' },
    { id: 'cpp_badge4', lessonId: 4, icon: '🏆', titleKey: 'cpp_badge_calculator' },
  ],
  c_sharp: [
    { id: 'csharp_badge1', lessonId: 1, icon: '🌐', titleKey: 'csharp_badge_dotnet' },
    { id: 'csharp_badge2', lessonId: 2, icon: '🔍', titleKey: 'csharp_badge_linq' },
    { id: 'csharp_badge3', lessonId: 3, icon: '⏳', titleKey: 'csharp_badge_async' },
    { id: 'csharp_badge4', lessonId: 4, icon: '🏆', titleKey: 'csharp_badge_taskmaster' },
  ],
  java: [
    { id: 'java_badge1', lessonId: 1, icon: '⚙️', titleKey: 'java_badge_jvm' },
    { id: 'java_badge2', lessonId: 2, icon: '🤝', titleKey: 'java_badge_oop' },
    { id: 'java_badge3', lessonId: 3, icon: '🗂️', titleKey: 'java_badge_collections' },
    { id: 'java_badge4', lessonId: 4, icon: '🏆', titleKey: 'java_badge_banker' },
  ],
  kotlin: [
    { id: 'kotlin_badge1', lessonId: 1, icon: '🛡️', titleKey: 'kotlin_badge_null' },
    { id: 'kotlin_badge2', lessonId: 2, icon: '🏃', titleKey: 'kotlin_badge_coroutines' },
    { id: 'kotlin_badge3', lessonId: 3, icon: '📦', titleKey: 'kotlin_badge_data' },
    { id: 'kotlin_badge4', lessonId: 4, icon: '🏆', titleKey: 'kotlin_badge_apprentice' },
  ],
  swift: [
    { id: 'swift_badge1', lessonId: 1, icon: '❓', titleKey: 'swift_badge_optionals' },
    { id: 'swift_badge2', lessonId: 2, icon: '🎨', titleKey: 'swift_badge_swiftui' },
    { id: 'swift_badge3', lessonId: 3, icon: '➡️', titleKey: 'swift_badge_closures' },
    { id: 'swift_badge4', lessonId: 4, icon: '🏆', titleKey: 'swift_badge_tiptop' },
  ],
  go: [
    { id: 'go_badge1', lessonId: 1, icon: '👯', titleKey: 'go_badge_gogetter' },
    { id: 'go_badge2', lessonId: 2, icon: '📡', titleKey: 'go_badge_channel' },
    { id: 'go_badge3', lessonId: 3, icon: '🧱', titleKey: 'go_badge_struct' },
    { id: 'go_badge4', lessonId: 4, icon: '🏆', titleKey: 'go_badge_weaver' },
  ],
  rust: [
    { id: 'rust_badge1', lessonId: 1, icon: '🤝', titleKey: 'rust_badge_ownership' },
    { id: 'rust_badge2', lessonId: 2, icon: '📜', titleKey: 'rust_badge_pattern' },
    { id: 'rust_badge3', lessonId: 3, icon: '⏳', titleKey: 'rust_badge_lifetime' },
    { id: 'rust_badge4', lessonId: 4, icon: '🏆', titleKey: 'rust_badge_cli' },
  ],
  php: [
    { id: 'php_badge1', lessonId: 1, icon: '🌐', titleKey: 'php_badge_server' },
    { id: 'php_badge2', lessonId: 2, icon: '📚', titleKey: 'php_badge_array' },
    { id: 'php_badge3', lessonId: 3, icon: '📝', titleKey: 'php_badge_form' },
    { id: 'php_badge4', lessonId: 4, icon: '🏆', titleKey: 'php_badge_contact' },
  ],
  ruby: [
    { id: 'ruby_badge1', lessonId: 1, icon: '🧱', titleKey: 'ruby_badge_block' },
    { id: 'ruby_badge2', lessonId: 2, icon: '💎', titleKey: 'ruby_badge_gem' },
    { id: 'ruby_badge3', lessonId: 3, icon: '✨', titleKey: 'ruby_badge_meta' },
    { id: 'ruby_badge4', lessonId: 4, icon: '🏆', titleKey: 'ruby_badge_blogger' },
  ],
  typescript: [
    { id: 'ts_badge1', lessonId: 1, icon: '📝', titleKey: 'ts_badge_type' },
    { id: 'ts_badge2', lessonId: 2, icon: '📜', titleKey: 'ts_badge_interface' },
    { id: 'ts_badge3', lessonId: 3, icon: '📦', titleKey: 'ts_badge_generic' },
    { id: 'ts_badge4', lessonId: 4, icon: '🏆', titleKey: 'ts_badge_scripter' },
  ],
  sql: [
    { id: 'sql_badge1', lessonId: 1, icon: '⭐', titleKey: 'sql_badge_select' },
    { id: 'sql_badge2', lessonId: 2, icon: '🎯', titleKey: 'sql_badge_where' },
    { id: 'sql_badge3', lessonId: 3, icon: '🔗', titleKey: 'sql_badge_join' },
    { id: 'sql_badge4', lessonId: 4, icon: '🏆', titleKey: 'sql_badge_query' },
  ],
  r: [
    { id: 'r_badge1', lessonId: 1, icon: '📋', titleKey: 'r_badge_dataframe' },
    { id: 'r_badge2', lessonId: 2, icon: '➡️', titleKey: 'r_badge_vector' },
    { id: 'r_badge3', lessonId: 3, icon: '📈', titleKey: 'r_badge_plot' },
    { id: 'r_badge4', lessonId: 4, icon: '🏆', titleKey: 'r_badge_analyst' },
  ],
  dart: [
    { id: 'dart_badge1', lessonId: 1, icon: '⏳', titleKey: 'dart_badge_future' },
    { id: 'dart_badge2', lessonId: 2, icon: '📱', titleKey: 'dart_badge_widget' },
    { id: 'dart_badge3', lessonId: 3, icon: '🔄', titleKey: 'dart_badge_state' },
    { id: 'dart_badge4', lessonId: 4, icon: '🏆', titleKey: 'dart_badge_flutter' },
  ],
  scala: [
    { id: 'scala_badge1', lessonId: 1, icon: 'λ', titleKey: 'scala_badge_fp' },
    { id: 'scala_badge2', lessonId: 2, icon: '📦', titleKey: 'scala_badge_case' },
    { id: 'scala_badge3', lessonId: 3, icon: '🚀', titleKey: 'scala_badge_future' },
    { id: 'scala_badge4', lessonId: 4, icon: '🏆', titleKey: 'scala_badge_transformer' },
  ],
  math: [
    { id: 'math_badge1', lessonId: 1, icon: '➕', titleKey: 'math_badge_adder' },
    { id: 'math_badge2', lessonId: 2, icon: '➖', titleKey: 'math_badge_sub' },
    { id: 'math_badge3', lessonId: 3, icon: '🧩', titleKey: 'math_badge_puzzle' },
    { id: 'math_badge4', lessonId: 4, icon: '🏆', titleKey: 'math_badge_calc' },
  ],
};
