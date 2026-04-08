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
    title: 'JavaScript ⚡',
    description: 'The magic language that makes websites come to life! With JavaScript, you can make things click, move, and pop on your screen.',
    sections: [
      {
        title: '📦 Boxes (Variables)',
        content: `// Imagine 'let' as a magical box that holds a secret!
let myPet = 'Dragon'; 
// You can change what's in the box later
myPet = 'Unicorn';

// 'const' is a locked treasure chest. You can't change it!
const myAge = 10;`,
        isCode: true,
      },
      {
        title: '🪄 Spells (Functions)',
        content: `// A function is like a spell you create so you can use it again and again.
function saySuperHello(name) {
  return 'Super Hello, ' + name + '! 🚀';
}

// Now let's cast our spell!
saySuperHello('Hero');`,
        isCode: true,
      },
      {
        title: '🎒 Backpacks (Arrays & Loops)',
        content: `// An array is like a backpack full of fun items!
const backpack = ['apple', 'cookie', 'map'];
        
// Let's take out everything in our backpack one by one!
for (let i = 0; i < backpack.length; i++) {
  console.log(backpack[i]); 
}`,
        isCode: true,
      }
    ]
  },
  python: {
    title: 'Python 🐍',
    description: 'A super friendly snake that talks to your computer! Python is awesome because reading its code feels just like reading normal English.',
    sections: [
      {
        title: '🏷️ Nametags (Variables)',
        content: `# Give a name to anything you want!
hero_name = "Super Coder"
lives_left = 3
has_magic_shield = True`,
        isCode: true,
      },
      {
        title: '🤖 Recipes (Functions)',
        content: `# Teach the computer how to do a new trick!
def cheer_up(friend):
    return f"You are awesome, {friend}! ⭐"

# Let's test our trick!
print(cheer_up("Alex"))`,
        isCode: true,
      },
      {
        title: '🚂 Magic Train (Lists & Loops)',
        content: `# A list is like a train carrying all your favorite things!
toys = ["robot", "dinosaur", "spaceship"]
        
# Visit every train car one by one
for toy in toys:
    print(f"Playing with my {toy}!")`,
        isCode: true,
      }
    ]
  },
  block_coding: {
    title: 'Block Coding 🧩',
    description: 'Coding is just like playing with LEGO® bricks! Snap visual puzzle pieces together to make your characters run, jump, and play.',
    sections: [
      {
        title: '🎮 How to play',
        content: 'Pick a block from the toolbox and drag it into your workspace. When you connect blocks like [Move Forward] and [Turn Right], your character will follow those steps perfectly!',
        isCode: false,
      },
      {
        title: '🔁 The Repeat Magic',
        content: 'Want your character to spin around 10 times? Instead of using 10 turn blocks, just wrap one turn block inside a giant [Repeat 10 times] block! It saves time and is super fun to watch.',
        isCode: false,
      }
    ]
  },
  web_dev: {
    title: 'Web Design 🎨',
    description: 'Become the architect of the internet! Build your own colorful web pages from scratch.',
    sections: [
      {
        title: '🧱 Building Blocks (HTML)',
        content: `<!-- Think of HTML as the skeleton of your game or website! -->
<!DOCTYPE html>
<html>
  <body>
    <h1>Welcome to My Secret Base! 🏰</h1>
    <p>Only cool coders are allowed inside.</p>
  </body>
</html>`,
        isCode: true,
      },
      {
        title: '🖌️ Painting (CSS)',
        content: `/* CSS is like a paintbrush! Let's color our text and make it huge! */
h1 {
  color: purple;
  font-size: 40px;
  background-color: yellow;
}`,
        isCode: true,
      }
    ]
  },
  "c++": {
    title: 'C++ 🚀',
    description: 'A super-fast, powerful language used to build the biggest video games and spacecraft! It is speedy like a racecar.',
    sections: [
      {
        title: '👋 Waving Hello',
        content: `// Bringing in our magic toolbox so we can talk to the screen
#include <iostream>

// Every C++ adventure starts at the main() door!
int main() {
    std::cout << "Gamer Ready! 🎮" << std::endl;
    return 0;
}`,
        isCode: true,
      },
      {
        title: '🔢 Keeping Track (Variables)',
        content: `// In C++, we have to tell the computer EXACTLY what type of box we are making.
int player_health = 100; // Whole numbers
float speed = 5.5f; // Numbers with decimals
std::string hero_name = "Knight"; // Words`,
        isCode: true,
      }
    ]
  }
};

export const FALLBACK_DOC: LanguageDoc = {
  title: 'Coming Soon 🚧',
  description: 'Our top coding wizards are busy writing the super-secret magic scrolls for this language!',
  sections: [
    {
      title: 'Hold tight!',
      content: 'We need a little more time to gather our notes. Come back later to see what we built for you! 🛠️',
      isCode: false,
    }
  ]
};
