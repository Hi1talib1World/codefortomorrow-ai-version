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
        title: '🔄 Repeat Machine (Loops)',
        content: `// A 'for' loop repeats code as many times as you need!
for (let count = 1; count <= 5; count++) {
  console.log('Spawning zombie 🧟 #' + count);
}`,
        isCode: true,
      },
      {
        title: '🗺️ Secret Agents (Objects)',
        content: `// An object is a collection of secrets with labels!
const hero = {
  name: 'Arthur',
  level: 5,
  sword: 'Excalibur'
};

// Access information using the dot!
console.log(hero.name + ' wields ' + hero.sword + '! ⚔️');`,
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
    title: 'Python Specification',
    description: 'A comprehensive, technical specification and reference guide for the Python programming language. Covers syntax, type systems, memory semantics, concurrency models, error-handling, and tooling.',
    sections: [
      {
        title: '1. Setup & Virtual Environments',
        content: `# Create a project-isolated virtual environment
python -m venv venv

# Activate environment on Linux/macOS
source venv/bin/activate

# Install dependencies and freeze versions
pip install requests
pip freeze > requirements.txt`,
        isCode: true,
      },
      {
        title: '2. Syntax & Indentation Scoping',
        content: `# Blocks are defined by four-space indentation (TabError on mixing)
def calculate_area(width: float, height: float) -> float:
    """
    Docstring: Calculates the area of a rectangle.
    """
    return width * height`,
        isCode: true,
      },
      {
        title: '3. Variables and Global/Nonlocal Scoping',
        content: `# Dynamic references can be reassigned to any type
counter = 0

def increment():
    global counter
    counter += 1

def outer():
    x = 1
    def inner():
        nonlocal x
        x += 1
    inner()
    return x`,
        isCode: true,
      },
      {
        title: '4. Built-in Data Types',
        content: `# Primitive Types: int, float, complex, bool, str, NoneType
# Collection Types: list (mutable), tuple (immutable), set (unique), dict (hash map)
x = [1, 2, 3]
is_list = isinstance(x, list)  # Verification
converted = int("123")  # Explicit cast`,
        isCode: true,
      },
      {
        title: '5. Arithmetic, Logical, & Identity Operators',
        content: `# Division: '/' (float), '//' (floor), '%' (modulo), '**' (power)
# Identity: 'is' (memory address check) vs '==' (value equality check)
a = [1, 2]
b = a
c = [1, 2]
print(a is b)  # True
print(a is c)  # False (different addresses)
print(a == c)  # True (values are equal)`,
        isCode: true,
      },
      {
        title: '6. Control Flow & Pattern Matching',
        content: `# Conditionals, loops (with else blocks), and match-case structures
def process_command(command):
    match command.split():
        case ["quit"]:
            return "Exiting..."
        case ["move", ("north"|"south") as dir]:
            return f"Moving {dir}"
        case _:
            return "Unknown"`,
        isCode: true,
      },
      {
        title: '7. Functions, Parameters, & Generators',
        content: `# '/'-Positional only, '*'-Keyword only parameters, generators
def configure(host, port, /, timeout=30, *, secure=True):
    pass

def fibonacci(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b`,
        isCode: true,
      },
      {
        title: '8. Object-Oriented Programming (OOP) & MRO',
        content: `# Multiple inheritance MRO, encapsulation via name mangling (double underscore)
class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"`,
        isCode: true,
      },
      {
        title: '9. Properties & Magic/Dunder Methods',
        content: `class Account:
    def __init__(self, balance):
        self.__balance = balance  # Private

    @property
    def balance(self):
        return self.__balance

    def __add__(self, other):
        return self.__balance + other.balance`,
        isCode: true,
      },
      {
        title: '10. Error Handling & Exception Chaining',
        content: `try:
    value = int("invalid")
except ValueError as err:
    # Exception chaining preserves context
    raise RuntimeError("Calculation failed") from err
finally:
    # Always runs cleanup code
    pass`,
        isCode: true,
      },
      {
        title: '11. Concurrency (GIL, Threads, Multiprocessing, Asyncio)',
        content: `import asyncio

async def fetch_item(item_id):
    await asyncio.sleep(1)  # Non-blocking I/O
    return f"Data_{item_id}"

async def main():
    results = await asyncio.gather(fetch_item(1), fetch_item(2))
    print(results)

asyncio.run(main())`,
        isCode: true,
      },
      {
        title: '12. File I/O & Context Managers',
        content: `import json

# Safe execution block (with statement) closes streams automatically
with open("config.json", "w") as file:
    json.dump({"timeout": 30}, file)

with open("config.json", "r") as file:
    config = json.load(file)`,
        isCode: true,
      },
      {
        title: '13. Memory Model & Garbage Collection',
        content: `# 1. Reference Counting: Objects are deleted immediately when count hits 0
# 2. Cyclic Garbage Collector: Detects referencing cycles across 3 generations
# 3. Mutability: Lists/dicts are modified in place, strings/tuples are immutable`,
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
        title: '🧪 Variables (Points & Lives)',
        content: 'Variables are like jars where you can store info that changes. You can make a variable called "Score", start it at 0, and tell the game to [Change Score by 1] every time you win!',
        isCode: false,
      },
      {
        title: '📢 Broadcast (Sprite Talk)',
        content: 'Spriting talk is done using Broadcast Messages! Send a message like "Game Over" when lives hit 0. When other elements hear "Game Over", they can hide or show the ending screen!',
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
        title: '📐 Flexbox (Layout Power)',
        content: `/* Flexbox aligns elements neatly inside a box! */
.container {
  display: flex;
  justify-content: space-between; /* Space out items */
  align-items: center; /* Center items vertically */
}`,
        isCode: true,
      },
      {
        title: '✨ Hover Animations',
        content: `/* Make things scale or change color smoothly when hovered! */
.button-pop {
  transition: transform 0.2s ease-in-out;
}
.button-pop:hover {
  transform: scale(1.1); /* Pop up 10% larger */
}`,
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
        title: '📦 Vectors (Stretchy Backpacks)',
        content: `#include <vector>
#include <string>

// A vector is a stretchy backpack that grows automatically!
std::vector<std::string> inventory;
inventory.push_back("Steel Shield 🛡️");
inventory.push_back("Health Potion 🧪");`,
        isCode: true,
      },
      {
        title: '🪄 Functions (Skills)',
        content: `// Teach the hero how to calculate double damage!
int dealDamage(int attackPower) {
    return attackPower * 2;
}`,
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
        title: '🏗️ Classes & Blueprints',
        content: `// A Class is a blueprint to create custom objects!
public class Hero {
    String name;
    int health = 100;
    
    public void takeDamage(int damage) {
        health -= damage;
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
        title: '🔁 Repeating Actions (Loops)',
        content: `// Loop 5 times to mine block elements!
for (int i = 1; i <= 5; i++) {
    System.out.println("Mining block block #" + i + " ⛏️");
}`,
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
        title: '🎭 Methods (Skills)',
        content: `// A method performs actions when called!
void HealPlayer(int amount) {
    health += amount;
    Console.WriteLine("Healed by " + amount + " points! ❤️");
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
        title: '🏗️ Unity Script Check',
        content: `using UnityEngine;

// Unity runs Update() every single frame!
public class MoveScript : MonoBehaviour {
    void Update() {
        float move = Input.GetAxis("Horizontal");
        transform.Translate(move * 5f * Time.deltaTime, 0, 0);
    }
}`,
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
        title: '🎯 Touching & Triggers',
        content: `-- Trigger code in Roblox when a block is touched!
local block = script.Parent

local function onTouch(part)
    local humanoid = part.Parent:FindFirstChildOfClass("Humanoid")
    if humanoid then
        humanoid.Health = humanoid.Health - 10 -- Take damage! 💥
    end
end
block.Touched:Connect(onTouch)`,
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
        title: '🔁 Loops & Ranges',
        content: `// Repeat a process over a specific range of numbers!
for score in 1...5 {
    print("Level \(score) cleared! 🏆")
}`,
        isCode: true,
      },
      {
        title: '🎨 SwiftUI (User Interfaces)',
        content: `import SwiftUI

// SwiftUI structures screens in simple, readable blocks!
struct WelcomeView: View {
    var body: some View {
        Text("Hello, Swift Coder!")
            .font(.largeTitle)
            .padding()
    }
}`,
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
        title: '🏗️ Classes & Header Constructors',
        content: `// Kotlin creates classes and properties directly in the header definition!
class Hero(val name: String, var level: Int) {
    fun train() {
        level++
        println("$name trained up to level $level!")
    }
}`,
        isCode: true,
      },
      {
        title: '🔁 Scan Collections (Loops)',
        content: `// Kotlin iterates lists with clean, simple variables
val spellList = listOf("Fire 🔥", "Ice ❄️", "Bolt ⚡")
for (spell in spellList) {
    println("Spell ready: $spell")
}`,
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
        title: '🎒 Arrays & Lists',
        content: `# Arrays are flexible lists that shrink and expand in Ruby!
loot = ["Emerald 🟢", "Gold 🟡", "Ruby 🔴"]
loot.push("Diamond 💎")
puts "First item: " + loot.first`,
        isCode: true,
      },
      {
        title: '🪄 Methods (Recipes)',
        content: `# Teach Ruby a function recipe with 'def' and 'end'
def double_xp(points)
  return points * 2
end
puts double_xp(50) # Prints 100`,
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
        title: '📨 Form Data Retrieval',
        content: `<?php
// Read user entries sent through a website form!
$userEmail = $_POST['email'];
echo "Signing up user: " . htmlspecialchars($userEmail);
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
        title: '🏗️ Classes & Blueprints',
        content: `<?php
class Mascot {
    public $name;
    public function __construct($name) {
        $this->name = $name;
    }
}
$hero = new Mascot("ElePHPant 🐘");
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
        title: '📦 Enums & Match Patterns',
        content: `// Enums contain standard choices
enum Direction { North, South, East, West }

fn move_hero(dir: Direction) {
    // Rust forces you to handle EVERY single choice!
    match dir {
        Direction::North => println!("Moving Up! ⬆️"),
        Direction::South => println!("Moving Down! ⬇️"),
        _ => println!("Moving Sideways! ↔️"),
    }
}`,
        isCode: true,
      },
      {
        title: '🦀 Structs & Impl Block',
        content: `// Define variables grouped together
struct Player {
    name: String,
    hp: u32,
}

impl Player {
    fn is_alive(&self) -> bool {
        self.hp > 0
    }
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
    title: 'Go Specification',
    description: 'A comprehensive, technical specification and reference guide for the Go programming language (Golang). Covers syntax, types, control flow, concurrency, and packages.',
    sections: [
      {
        title: '1. Lexical Elements & Syntax rules',
        content: `package main

// Semi-colons automatically inserted at line endings by the lexer
// 25 strictly reserved keywords (e.g. chan, defer, go, select)
// Operators: standard arithmetic and unique bit-clear '&^'`,
        isCode: true,
      },
      {
        title: '2. Variable & Constant Declarations',
        content: `package main

var packageVar string = "accessible to package"

const Pi = 3.14159

const (
    Read = 1 << iota  // 1
    Write             // 2
    Execute           // 4
)

func main() {
    localVar := "shorthand type-inferred variable"
}`,
        isCode: true,
      },
      {
        title: '3. Composite Types: Slices & Maps',
        content: `package main

func main() {
    // Slices are headers pointing to backing arrays: [ptr, len, cap]
    s := make([]int, 5, 10)
    s = append(s, 100)

    // Maps must be initialized using make before writes
    m := make(map[string]int)
    m["Alice"] = 90
    
    val, exists := m["Bob"]
}`,
        isCode: true,
      },
      {
        title: '4. Flow Control & Multi-branch switches',
        content: `package main

func main() {
    // Conditional with local variable initialization
    if val := evaluate(); val > 10 {
        // ...
    }

    // Switch case does not fall through automatically
    switch os := getOS(); os {
    case "linux":
        // ...
    case "windows":
        // ...
    }
}`,
        isCode: true,
      },
      {
        title: '5. Functions, Defer, & Recover',
        content: `package main

import "errors"

func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func safeExecute() {
    defer func() {
        if r := recover(); r != nil {
            // Panic caught and handled
        }
    }()
    panic("critical system error")
}`,
        isCode: true,
      },
      {
        title: '6. Structs, Pointers, & Methods',
        content: `package main

type User struct {
    ID   int    \`json:"id"\`
    Name string \`json:"name"\`
}

// Value receiver (reads copy of struct)
func (u User) Print() { }

// Pointer receiver (mutates original memory)
func (u *User) Rename(newName string) {
    u.Name = newName
}`,
        isCode: true,
      },
      {
        title: '7. Interfaces & Type Assertions',
        content: `package main

type Reader interface {
    Read() string
}

func checkType(val interface{}) {
    // Type assertion (comma-ok)
    str, ok := val.(string)
    
    // Type switch
    switch v := val.(type) {
    case int:
        // ...
    }
}`,
        isCode: true,
      },
      {
        title: '8. Concurrency (Goroutines & Channels)',
        content: `package main

func worker(ch chan string) {
    ch <- "task completed"
}

func main() {
    ch := make(chan string)
    go worker(ch) // Managed lightweight thread
    msg := <-ch
}`,
        isCode: true,
      },
      {
        title: '9. Error Handling Principles',
        content: `package main

import "errors"

type DbError struct {
    Query string
}

func (e *DbError) Error() string {
    return "Database failure on " + e.Query
}

func check(err error) {
    var dbErr *DbError
    if errors.As(err, &dbErr) {
        // Handle database specific error
    }
}`,
        isCode: true,
      },
      {
        title: '10. Command Line Tooling',
        content: `# Run tests under current package tree
go test ./...

# Build executable binary for current platform
go build -o myapp main.go

# Verify common programming issues
go vet ./...`,
        isCode: true,
      }
    ]
  },
  sql: {
    title: 'SQL 🗃️',
    description: 'The ultimate Data Detective! SQL is the special language used to talk to databases and quickly find or update the exact information you need.',
    sections: [
      {
        title: '🔍 Finding Clues (SELECT)',
        content: `-- Let's find all the players who have a score over 1000!
SELECT name, score 
FROM players 
WHERE score > 1000;`,
        isCode: true,
      },
      {
        title: '➕ Adding Data (INSERT)',
        content: `-- Let's add a brand new hero to the game database!
INSERT INTO players (name, character_class)
VALUES ('Alex', 'Mage');`,
        isCode: true,
      },
      {
        title: '🔄 Joining Tables (Relation Links)',
        content: `-- Join two tables together to match profiles with game stats!
SELECT players.name, stats.xp
FROM players
JOIN stats ON players.id = stats.player_id;`,
        isCode: true,
      },
      {
        title: '✏️ Updating Data (UPDATE)',
        content: `-- Let's add points to a hero after they clear a level!
UPDATE players
SET score = score + 50
WHERE name = 'Alex';`,
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
        title: '🏷️ Adding Labels (Types)',
        content: `// In TS, you tell the computer EXACTLY what type a box is.
let heroName: string = "Zelda";
let rupees: number = 50;
let isHero: boolean = true;`,
        isCode: true,
      },
      {
        title: '🤝 Blueprints (Interfaces)',
        content: `// Outline exactly what properties an object MUST contain!
interface Player {
    username: string;
    xp: number;
    hasShield: boolean;
}`,
        isCode: true,
      },
      {
        title: '🎒 Dynamic Helpers (Generics)',
        content: `// Generics let a function work with any type of variable!
function firstItem<T>(arr: T[]): T {
    return arr[0];
}`,
        isCode: true,
      },
      {
        title: '🛡️ Promises Made and Kept',
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
        title: '🏗️ Shorthand Classes',
        content: `class Avatar {
  String nickname;
  int rank;
  
  // Dart shorthand sets variables instantly!
  Avatar(this.nickname, this.rank);
}`,
        isCode: true,
      },
      {
        title: '📱 Flutter Screen Layout (Widgets)',
        content: `import 'package:flutter/material.dart';

// Flutter uses a hierarchy of widgets to build screens!
Widget buildWelcomeScreen() {
  return Center(
    child: Text('Hello from Flutter! 📱'),
  );
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
        title: '🧮 Binary Math (On/Off switches)',
        content: 'Computers do not count from 1 to 9. They only know Binary: 0 (Off) and 1 (On). Programmers use bitwise operations (AND, OR, XOR) to toggles flags, hide data, and write ultra-fast code!',
        isCode: false,
      },
      {
        title: '📐 Coordinates & Screen Space',
        content: 'Every 2D and 3D screen uses coordinate planes (X, Y, Z). To move sprites, check if elements touch (collision checking), or design custom shapes, you will need math coordinates!',
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
