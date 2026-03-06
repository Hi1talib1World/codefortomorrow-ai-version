
import { LessonSection, Badge, ProgrammingPath, Module, Level } from './types';

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
    id: 'c_plus_plus', 
    titleKey: 'c_plus_plus', 
    descriptionKey: 'c_plus_plus_desc', 
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
    id: 'scala', 
    titleKey: 'scala', 
    descriptionKey: 'scala_desc', 
    icon: '🪜',
    color: 'bg-red-800',
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
          hintKey: 'py_hint_1',
          starterCode: '# Create a variable named "age" and set it to 10.\n# Then print the variable.\n', 
          solutionCode: 'age = 10\nprint(age)', 
          expectedOutput: '10' 
        },
        { 
          id: 2, level: 2, titleKey: 'python_loops', icon: 'brain', xp: 20, color: '#f1c40f', type: 'lesson', nodeType: 'standard', 
          challengeDescriptionKey: 'py_challenge_2', 
          hintKey: 'py_hint_2',
          starterCode: '# Use a for loop to print numbers from 1 to 3.\n', 
          solutionCode: 'for i in range(1, 4):\n    print(i)', 
          expectedOutput: '1\n2\n3' 
        },
        { id: 3, level: 3, titleKey: 'python_conditionals', icon: 'star', xp: 25, color: '#f1c40f', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: 'py_challenge_3', starterCode: '', solutionCode: '', expectedOutput: '' },
        { 
          id: 4, level: 4, titleKey: 'python_functions', icon: 'brain', xp: 30, color: '#f1c40f', type: 'lesson', nodeType: 'standard', 
          challengeDescriptionKey: 'py_challenge_4', 
          starterCode: '# Define a function named "greet" that prints "Hello!".\n# Then call the function.\n', 
          solutionCode: 'def greet():\n    print("Hello!")\n\ngreet()', 
          expectedOutput: 'Hello!' 
        },
        { id: 5, level: 5, titleKey: 'python_quiz_game', icon: 'trophy', xp: 50, color: '#f39c12', type: 'project', nodeType: 'trophy', challengeDescriptionKey: 'py_challenge_5', starterCode: '', solutionCode: '', expectedOutput: '' },
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
    }
  ],
  javascript: [
    {
      id: 'js_basics',
      titleKey: 'javascript',
      lessons: [
        { 
          id: 1, level: 1, titleKey: 'js_vars_alerts', icon: 'brain', xp: 15, color: '#f1e05a', type: 'lesson', nodeType: 'standard',
          challengeDescriptionKey: 'js_challenge_1',
          hintKey: 'js_hint_1',
          starterCode: `// Use console.log() to print "Hello, JavaScript!".\n\n`, 
          solutionCode: `console.log("Hello, JavaScript!");`, 
          expectedOutput: "Hello, JavaScript!"
        },
        { 
          id: 2, level: 2, titleKey: 'js_dom', icon: 'brain', xp: 20, color: '#f1e05a', type: 'lesson', nodeType: 'standard', 
          challengeDescriptionKey: 'js_challenge_2', 
          hintKey: 'js_hint_2',
          starterCode: '// Create a variable named "score" and set it to 100.\n// Then log it to the console.\n', 
          solutionCode: 'let score = 100;\nconsole.log(score);', 
          expectedOutput: "100" 
        },
        { id: 3, level: 3, titleKey: 'js_loops_conditionals', icon: 'star', xp: 25, color: '#f1e05a', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: 'js_challenge_3', starterCode: '', solutionCode: '', expectedOutput: '' },
        { 
          id: 4, level: 4, titleKey: 'js_functions_events', icon: 'brain', xp: 30, color: '#f1e05a', type: 'lesson', nodeType: 'standard', 
          challengeDescriptionKey: 'js_challenge_4', 
          starterCode: '// Write a function named "sayHi" that logs "Hi!" to the console.\n// Then call the function.\n', 
          solutionCode: 'function sayHi() {\n  console.log("Hi!");\n}\nsayHi();', 
          expectedOutput: "Hi!" 
        },
        { id: 5, level: 5, titleKey: 'js_interactive_story', icon: 'trophy', xp: 50, color: '#f39c12', type: 'project', nodeType: 'trophy', challengeDescriptionKey: 'js_challenge_5', starterCode: '', solutionCode: '', expectedOutput: '' },
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
    }
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
          hintKey: 'web_hint_1',
          starterCode: '// In this world, we use console.log to simulate HTML tags!\n// Log "<h1>Hello World</h1>" to the console.\n', 
          solutionCode: 'console.log("<h1>Hello World</h1>");', 
          expectedOutput: '<h1>Hello World</h1>' 
        },
        { 
          id: 2, level: 2, titleKey: 'web_images_links', icon: 'brain', xp: 20, color: '#e34f26', type: 'lesson', nodeType: 'standard', 
          challengeDescriptionKey: 'web_challenge_2', 
          hintKey: 'web_hint_2',
          starterCode: '// Log an <img> tag with src="magic.png".\n', 
          solutionCode: 'console.log(\'<img src="magic.png">\');', 
          expectedOutput: '<img src="magic.png">' 
        },
        { id: 3, level: 3, titleKey: 'web_css_intro', icon: 'star', xp: 25, color: '#1572b6', type: 'quiz', nodeType: 'quiz', challengeDescriptionKey: 'web_challenge_3', starterCode: '', solutionCode: '', expectedOutput: '' },
        { 
          id: 4, level: 4, titleKey: 'web_css_layout', icon: 'brain', xp: 30, color: '#1572b6', type: 'lesson', nodeType: 'standard', 
          challengeDescriptionKey: 'web_challenge_4', 
          starterCode: '// Log "display: flex" to simulate a CSS property.\n', 
          solutionCode: 'console.log("display: flex");', 
          expectedOutput: 'display: flex' 
        },
        { id: 5, level: 5, titleKey: 'web_animal_page', icon: 'trophy', xp: 50, color: '#333333', type: 'project', nodeType: 'trophy', challengeDescriptionKey: 'web_challenge_5', starterCode: '', solutionCode: '', expectedOutput: '' },
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
    }
  ],
  c_plus_plus: [
    {
      id: 'cpp_basics',
      titleKey: 'c_plus_plus',
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
    c_plus_plus: [
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
};
