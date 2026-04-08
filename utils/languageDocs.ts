import { ProgrammingPath } from '../types';

export interface DocSection {
  title: string;
  content: string;
  isCode?: boolean;
}

export interface LanguageDoc {
  title: string;
  description: string;
  sections: DocSection[];
}

export const LANGUAGE_DOCS: Partial<Record<ProgrammingPath['id'], LanguageDoc>> = {
  javascript: {
    title: 'JavaScript',
    description: 'A lightweight, interpreted, or just-in-time compiled programming language with first-class functions.',
    sections: [
      {
        title: 'Variables',
        content: `let name = 'Alice'; // Can be reassigned
const age = 25; // Cannot be reassigned
var oldWay = true; // Avoid using var`,
        isCode: true,
      },
      {
        title: 'Functions',
        content: `function greet(name) {
  return 'Hello, ' + name;
}

const arrowGreet = (name) => {
  return \`Hello \${name}\`;
};`,
        isCode: true,
      },
      {
        title: 'Arrays & Loops',
        content: `const fruits = ['apple', 'banana', 'cherry'];
        
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

fruits.forEach(fruit => console.log(fruit));`,
        isCode: true,
      }
    ]
  },
  python: {
    title: 'Python',
    description: 'A high-level, interpreted, general-purpose programming language known for readability.',
    sections: [
      {
        title: 'Variables',
        content: `name = "Alice"
age = 25
is_student = True`,
        isCode: true,
      },
      {
        title: 'Functions',
        content: `def greet(name):
    return f"Hello, {name}"

# Calling the function
print(greet("Alice"))`,
        isCode: true,
      },
      {
        title: 'Lists & Loops',
        content: `fruits = ["apple", "banana", "cherry"]
        
for fruit in fruits:
    print(fruit)`,
        isCode: true,
      }
    ]
  },
  block_coding: {
    title: 'Block Coding',
    description: 'Visual programming language, a great way for beginners to learn the logic behind code.',
    sections: [
      {
        title: 'How it works',
        content: 'Snap together visual blocks to form a program. For example, use a [Move Forward] block to move a character.',
        isCode: false,
      },
      {
        title: 'Loops',
        content: 'Use a [Repeat X times] block and put other action blocks inside it to run them multiple times.',
        isCode: false,
      }
    ]
  },
  web_dev: {
    title: 'Web Development',
    description: 'Building interactive websites using HTML, CSS, and JavaScript.',
    sections: [
      {
        title: 'HTML Structure',
        content: `<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>`,
        isCode: true,
      },
      {
        title: 'CSS Styling',
        content: `h1 {
  color: blue;
  font-size: 24px;
}`,
        isCode: true,
      }
    ]
  },
  "c++": {
    title: 'C++',
    description: 'A general-purpose programming language created as an extension of the C programming language.',
    sections: [
      {
        title: 'Hello World',
        content: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
        isCode: true,
      },
      {
        title: 'Variables',
        content: `int age = 21;
float height = 1.75f;
std::string name = "John";`,
        isCode: true,
      }
    ]
  }
};

export const FALLBACK_DOC: LanguageDoc = {
  title: 'Coming Soon',
  description: 'Detailed documentation and cheat sheets for this language are currently being prepared.',
  sections: [
    {
      title: 'Hold tight!',
      content: 'We are working hard to bring you comprehensive documentation for this path. Check back soon.',
      isCode: false,
    }
  ]
};
