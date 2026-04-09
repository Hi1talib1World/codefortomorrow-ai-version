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
        title: '🎒 Backpacks (Arrays)',
        content: `// An array is like a backpack full of fun items!
const backpack = ['apple', 'cookie', 'map'];
        
// The first item is always at spot 0!
console.log(backpack[0]); // Prints 'apple'`,
        isCode: true,
      },
      {
        title: '🔀 Crossroads (If/Else)',
        content: `// Use 'if' to make your program smart!
let energy = 100;

if (energy > 50) {
  console.log('You can keep running! 🏃‍♂️');
} else {
  console.log('Time to eat a cookie and rest! 🍪');
}`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'JavaScript was created in just 10 days by a programmer named Brendan Eich! Today, it runs almost every interactive website in the world.',
        isCode: false,
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
      },
      {
        title: '🤔 Thinking Caps (Conditionals)',
        content: `# Python is great at making decisions.
weather = "rainy"

if weather == "sunny":
    print("Let's play outside! ☀️")
elif weather == "rainy":
    print("Let's code inside! 🌧️")
else:
    print("Wait and see!")`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'Python isn’t named after the snake! It was actually named after a funny British comedy show called "Monty Python’s Flying Circus".',
        isCode: false,
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
      },
      {
        title: '👁️ If/Then Secrets',
        content: 'You can teach your game to make decisions! Use an [If / Then] block: "IF the hero touches a coin, THEN add 1 to the score!"',
        isCode: false,
      },
      {
        title: '🎭 Events (When to Start)',
        content: 'Every amazing game needs a starting signal! Use blocks like [When Green Flag is Clicked] or [When Space Key is Pressed] to tell your characters exactly when to spring into action.',
        isCode: false,
      },
      {
        title: '💡 Did you know?',
        content: 'Block coding was invented to help kids skip the hard typing part and jump straight into the fun of inventing logic! The most famous block engine is MIT’s Scratch.',
        isCode: false,
      }
    ]
  },
  web_dev: {
    title: 'Web Design 🎨',
    description: 'Become the architect of the internet! Build your own colorful web pages from scratch using HTML and CSS.',
    sections: [
      {
        title: '🧱 Building Blocks (HTML)',
        content: `<!-- Think of HTML as the skeleton of your base! -->
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
        content: `/* CSS is like a paintbrush! Let's color our text! */
h1 {
  color: purple;
  font-size: 40px;
  background-color: yellow;
  border-radius: 10px; /* Makes curvy edges! */
}`,
        isCode: true,
      },
      {
        title: '🎇 Buttons that Work',
        content: `<!-- HTML buttons can be clicked, but they need JS to do magic! -->
<button onclick="alert('BOOM! 💥')">
  Do Not Press
</button>`,
        isCode: true,
      },
      {
        title: '🖼️ Putting Posters on Walls',
        content: `<!-- The img tag is how we put pictures on the internet! -->
<img src="cute-dog.jpg" alt="A tiny happy puppy" width="300" />
<!-- The 'alt' text helps people who can't see the picture understand what it is! -->`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'The first web page ever created went live in 1991. It was super boring, had zero pictures, and only had black text with blue links!',
        isCode: false,
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
        title: '🔢 Strict Boxes (Variables)',
        content: `// In C++, we have to tell the computer EXACTLY what type of box we are making.
int playerHealth = 100; // Whole numbers only!
float playerSpeed = 5.5f; // Numbers with decimals
std::string heroName = "Knight"; // Words and letters`,
        isCode: true,
      },
      {
        title: '⚔️ Loops of Power',
        content: `// A "while" loop keeps spinning as long as the rule is true!
while (playerHealth > 0) {
    std::cout << "Keep fighting!" << std::endl;
    playerHealth = playerHealth - 10;
}`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'C++ is the engine behind some of the most famous games in the world, including Fortnite and the Unreal Engine! It’s used when you want absolute maximum speed.',
        isCode: false,
      }
    ]
  },
  java: {
    title: 'Java ☕',
    description: 'Ever played Minecraft? That was originally built with Java! It’s a very organized language that builds sturdy, safe programs.',
    sections: [
      {
        title: '🏛️ The Main Stage',
        content: `// Everything in Java lives inside a "Class" (a blueprint).
public class Game {
    // This is where the magic starts!
    public static void main(String[] args) {
        System.out.println("Welcome to my blocky world! 🧊");
    }
}`,
        isCode: true,
      },
      {
        title: '🎒 Inventories (Arrays)',
        content: `// Let's create an inventory of standard blocks!
String[] inventory = {"Dirt", "Wood", "Diamond"};

// Grabbing the very first item (they always start counting at 0!)
System.out.println("Holding: " + inventory[0]);`,
        isCode: true,
      },
      {
        title: '📝 The Scanner (Talking to the game)',
        content: `import java.util.Scanner;

// We use a Scanner to read what the player types on their keyboard!
Scanner gameInput = new Scanner(System.in);
System.out.println("Enter your secret code: ");`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'Java runs on over 3 billion devices worldwide! It was originally designed to program interactive television sets before the internet became huge.',
        isCode: false,
      }
    ]
  },
  c_sharp: {
    title: 'C# (C-Sharp) 🎸',
    description: 'Looking to make 3D and 2D games? C# is the star of Unity, the most famous game engine in the world! It sounds sharp and it acts smart.',
    sections: [
      {
        title: '🕹️ Greeting the Player',
        content: `using System;

class Adventure {
    static void Main() {
        Console.WriteLine("Player 1 has joined the game! 🛡️");
    }
}`,
        isCode: true,
      },
      {
        title: '🏃 Player Movement',
        content: `// A simple trick to check player speed in C#
int speed = 10;

if (speed > 5) {
    Console.WriteLine("You are running super fast! 💨");
}`,
        isCode: true,
      },
      {
        title: '📦 Lists (Stretchy Backpacks)',
        content: `using System.Collections.Generic;

// Unlike normal Arrays, Lists can stretch to fit as many items as you want!
List<string> treasures = new List<string>();
treasures.Add("Gold Ring");
treasures.Add("Magic Boots");`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'The name C# was inspired by musical notes! In music, a sharp symbol (#) means that a note should be played higher in pitch.',
        isCode: false,
      }
    ]
  },
  lua: {
    title: 'Lua 🌙',
    description: 'Love playing Roblox? Lua is the lightweight, lightning-fast language used to script all the epic Roblox games!',
    sections: [
      {
        title: '📜 Easy Reading',
        content: `-- Lua uses double dashes to hide secrets (comments)!
local hero = "Robloxian"
local score = 100

-- "print" throws the words onto the screen
print("Hello, " .. hero .. "! Your score is " .. score)`,
        isCode: true,
      },
      {
        title: '🔂 Infinite Fun',
        content: `-- Need to spawn 5 zombies? Easy!
for i = 1, 5 do
    print("Spawned zombie number " .. i .. " 🧟")
end`,
        isCode: true,
      },
      {
        title: '🗄️ Tables (The Magic Bag)',
        content: `-- Lua doesn't have regular arrays or objects, it does everything with Tables!
local playerStats = {
    health = 100,
    power = "Invisibility",
    speed = 50
}
print(playerStats.power)`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'Lua actually means "Moon" in Portuguese because it was invented at a university in Brazil! It was designed to fit inside other big programs easily.',
        isCode: false,
      }
    ]
  },
  swift: {
    title: 'Swift 🦅',
    description: 'If you want to build awesome apps for iPhones, iPads, or Macs, Swift is your best friend. It was made by Apple to be fast and very safe!',
    sections: [
      {
        title: '📱 App Basics',
        content: `// Swift loves emojis! You can even use them as variable names (sometimes!)
let greeting = "Welcome to my App! 📱"
var batteryLevel = 100

print(greeting)`,
        isCode: true,
      },
      {
        title: '⚡ Constant vs Changing',
        content: `// 'let' makes a constant. It CANNOT change.
let birthday = "May 5th"

// 'var' makes a variable. You can change this anytime!
var favoriteColor = "Blue"
favoriteColor = "Green" // Perfectly fine!`,
        isCode: true,
      },
      {
        title: '🛡️ Optional Safeties',
        content: `// Swift uses Question Marks (?) for things that might be missing!
var secretCode: Int? = 404
// The computer knows we have to check if this is real before we use it!`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'Swift originally had a logo that looked like a bird diving from the sky! Apple created it to replace their much older, clunkier language called Objective-C.',
        isCode: false,
      }
    ]
  },
  kotlin: {
    title: 'Kotlin 🎒',
    description: 'The cool new language for building Android Apps! It does everything Java can do but uses fewer words, so you can code faster.',
    sections: [
      {
        title: '🤖 Android Hello',
        content: `// Kotlin has a very clean look with no crazy semi-colons!
fun main() {
    val message = "Hello, Android World! 🤖"
    println(message)
}`,
        isCode: true,
      },
      {
        title: '☔ Null Safety (Raincoats)',
        content: `// Kotlin protects you from "null" errors (empty boxes).
// If a box MIGHT be empty, you mark it with a question mark!
var umbrella: String? = null // It's raining but we have no umbrella!`,
        isCode: true,
      },
      {
        title: '🧙‍♂️ String Magic',
        content: `val score = 99
// You can pop variables right inside text using the dollar sign!
println("Wow, you just scored $score points!")`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'Kotlin was named after Kotlin Island, near St. Petersburg in Russia! It was chosen because the creators liked how Java was named after an island in Indonesia.',
        isCode: false,
      }
    ]
  },
  ruby: {
    title: 'Ruby 💎',
    description: 'Ruby is designed to make programmers happy! It is elegant, reads beautifully, and is often used to build huge websites.',
    sections: [
      {
        title: '✨ Sparkling Syntax',
        content: `# Look how easy this is to read!
name = "Sparkle"

if name == "Sparkle"
  puts "You found the shiny gem! 💎"
end`,
        isCode: true,
      },
      {
        title: '🔁 Doing things many times',
        content: `# Rather than a complicated loop, Ruby uses ".times"!
5.times do
  puts "Jump! 🦘"
end`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'The creator of Ruby (Yukihiro Matsumoto) blended his favorite parts of several older languages to try to create something that felt "natural" rather than robotic.',
        isCode: false,
      }
    ]
  },
  php: {
    title: 'PHP 🐘',
    description: 'The brain behind millions of websites! PHP works behind the scenes on a server to build web pages before sending them to your screen.',
    sections: [
      {
        title: '🌐 Server Magic',
        content: `<?php
// PHP code hides between these special tags!
$playerName = "Wizard";
echo "Welcome to the server, " . $playerName . "! 🧙‍♂️";
?>`,
        isCode: true,
      },
      {
        title: '📦 Arrays in PHP',
        content: `<?php
// Creating a list of epic loot
$loot = ["Gold Coin", "Health Potion", "Map"];
echo "You found a " . $loot[1] . "!"; // Prints 'Health Potion'
?>`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'PHP’s giant elephant mascot is named "ElePHPant". PHP powers WordPress, which runs over 40% of all websites on the entire internet!',
        isCode: false,
      }
    ]
  },
  rust: {
    title: 'Rust 🦀',
    description: 'A super tough crab! Rust is famous for being incredibly fast AND incredibly safe. It never lets your programs crash unexpectedly.',
    sections: [
      {
        title: '🛡️ Safe Hello',
        content: `// The exclamation mark (!) means this is a special Rust 'macro'
fn main() {
    println!("Hello, fearless coder! 🦀");
}`,
        isCode: true,
      },
      {
        title: '🔒 Borrowing Rules',
        content: `// In Rust, the computer keeps strict track of who "owns" a magical item.
let sword = String::from("Excalibur");
// You can't just throw it around freely. Once you give ownership to someone else, it's gone!`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'Rust is known as the "Most Loved" programming language on Stack Overflow because developers appreciate how it stops scary bugs before the app even runs!',
        isCode: false,
      }
    ]
  },
  go: {
    title: 'Go 🐹',
    description: 'Created by Google! Go (or Golang) is famous for being able to do many tasks at the exact same time without slowing down.',
    sections: [
      {
        title: '🚀 Launch Time',
        content: `package main
import "fmt"

func main() {
    fmt.Println("Ready for liftoff! 🚀")
}`,
        isCode: true,
      },
      {
        title: '🧵 Multitasking (Goroutines)',
        content: `// Go uses "goroutines" to do things all at once!
// Just put "go" in front of a command, and it runs in the background.
// go runRobotPath()
// go playMusic()`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'Go was designed by Google to fix the problem of giant programs taking way too long to build. Today, it powers heavy-duty stuff like massive online game servers!',
        isCode: false,
      }
    ]
  },
  sql: {
    title: 'SQL 🗃️',
    description: 'The ultimate Data Detective! SQL is the special language used to talk to databases and quickly find or update the exact information you need.',
    sections: [
      {
        title: '🔍 Finding Clues',
        content: `-- Let's find all the players who have a score over 1000!
SELECT name, score 
FROM players 
WHERE score > 1000;`,
        isCode: true,
      },
      {
        title: '➕ Adding Data',
        content: `-- Let's add a brand new hero to the game database!
INSERT INTO players (name, character_class)
VALUES ('Alex', 'Mage');`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'Almost every single app, website, and bank in the world uses SQL to keep track of user info, money, and high scores!',
        isCode: false,
      }
    ]
  },
  typescript: {
    title: 'TypeScript 🛡️',
    description: 'Imagine JavaScript, but wearing a protective helmet! TypeScript adds strict rules to JS to prevent bugs and mistakes before they happen.',
    sections: [
      {
        title: '🏷️ Adding Labels',
        content: `// In TS, you tell the computer EXACTLY what type a box is.
let heroName: string = "Zelda";
let rupees: number = 50;
let isHero: boolean = true;`,
        isCode: true,
      },
      {
        title: '🤝 Promises Made and Kept',
        content: `// A function that guarantees it will ONLY return a number!
function calculateDamage(attack: number, defense: number): number {
    return attack - defense;
}`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'TypeScript was created by Microsoft! Because building large, complex websites in pure JavaScript is very tricky without strict rules.',
        isCode: false,
      }
    ]
  },
  r: {
    title: 'R 📊',
    description: 'The master of charts and statistics! R is used by scientists around the world to look at large amounts of data and draw beautiful graphs.',
    sections: [
      {
        title: '📦 Magic Boxes (Variables)',
        content: `# In R, we use a little arrow (<-) to put things into boxes!
playerName <- "Explorer"
applesFound <- 5

# Let's peek inside the box!
print(playerName)`,
        isCode: true,
      },
      {
        title: '🧮 Doing Math',
        content: `# R is great at super-fast math!
apples <- 10
bananas <- 5

# Adding them up!
totalFruit <- apples + bananas
print(totalFruit)`,
        isCode: true,
      },
      {
        title: '🗄️ Data Tables (Data Frames)',
        content: `# R is amazing at organizing things into neat tables!
gameData <- data.frame(
  player = c("Alex", "Sam"),
  score = c(150, 200)
)
print(gameData)`,
        isCode: true,
      },
      {
        title: '🤔 Making Choices',
        content: `# Use 'if' to teach your R program how to make decisions!
score <- 100

if (score >= 100) {
  print("You won a Gold Medal! 🥇")
} else {
  print("Keep trying! 🌟")
}`,
        isCode: true,
      },
      {
        title: '📈 Plotting',
        content: `# R makes it incredibly easy to draw a chart!
scores <- c(10, 25, 40, 80)
plot(scores, main="Player Progress", col="blue")`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'R was created by two statisticians named Ross Ihaka and Robert Gentleman. They named it "R" after their first names!',
        isCode: false,
      }
    ]
  },
  dart: {
    title: 'Dart 🎯',
    description: 'The core language of Flutter! With Dart, you can write the code once, and it will build an app that runs perfectly on iPhones, Androids, and computers.',
    sections: [
      {
        title: '🎯 Hitting the Bullseye',
        content: `// Every Dart program begins running at main!
void main() {
  String goal = "Make an awesome App!";
  print("Goal: \${goal} 🎯");
}`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'Dart was made by Google specifically to build fast, beautiful phone screens without the stuttering limits of older programming tools.',
        isCode: false,
      }
    ]
  },
  scala: {
    title: 'Scala 🏔️',
    description: 'A scalable language that runs on Java technology but adds lots of cool mathematical ideas to make your code shorter and stronger.',
    sections: [
      {
        title: '🧗 Climbing High',
        content: `object Game {
  def main(args: Array[String]): Unit = {
    println("Welcome to the mountains! 🏔️")
  }
}`,
        isCode: true,
      },
      {
        title: '💡 Did you know?',
        content: 'Scala stands for "Scalable Language". It’s used by giant companies like Twitter (X) and Netflix to manage vast amounts of data!',
        isCode: false,
      }
    ]
  },
  math: {
    title: 'Math Games ✖️',
    description: 'Level up your brain power! Use coding logic combined with mathematics to solve epic puzzles and outsmart your opponents.',
    sections: [
      {
        title: '🧠 Brain Power',
        content: 'Mathematics is the secret backbone of all programming! By learning to solve math problems quickly, you are teaching your brain to be an amazing bug-hunter and code-developer.',
        isCode: false,
      },
      {
        title: '📐 Angles and Geometry',
        content: 'Want your game characters to bounce correctly off walls, trace cool magic spells, or calculate distances? You need math for that!',
        isCode: false,
      },
      {
        title: '💡 Did you know?',
        content: 'The very first "computer programmers" were actually mathematicians who mapped out complex calculations by hand long before the electronic screen was invented!',
        isCode: false,
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
