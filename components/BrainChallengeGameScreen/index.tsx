import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Brain, Zap, Trophy, Shield, Code, Calculator, Globe, Star } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import { getChallengeById } from '../BrainTrainingScreen';

/* ─── Question types ────────────────────────────────────────────── */
interface Question {
    id: number;
    questionText: string;
    options: { label: string; value: string }[];
    correctAnswer: string;
    category: 'math' | 'logic' | 'problem-solving' | 'python' | 'web' | 'algo' | 'cyber';
    imageUrl?: string;
}

/* ─── Category specific question pools ─────────────────────────────────────── */

const PYTHON_QUESTIONS: Omit<Question, 'id'>[] = [
    { questionText: 'Which keyword is used to define a function in Python?', options: [{ label: 'A', value: 'func' }, { label: 'B', value: 'def' }, { label: 'C', value: 'function' }, { label: 'D', value: 'define' }], correctAnswer: 'def', category: 'python' },
    { questionText: 'What is the output of len([10, 20, 30, 40]) in Python?', options: [{ label: 'A', value: '3' }, { label: 'B', value: '4' }, { label: 'C', value: '5' }, { label: 'D', value: '40' }], correctAnswer: '4', category: 'python' },
    { questionText: 'Which data structure is immutable in Python?', options: [{ label: 'A', value: 'list' }, { label: 'B', value: 'dict' }, { label: 'C', value: 'tuple' }, { label: 'D', value: 'set' }], correctAnswer: 'tuple', category: 'python' },
    { questionText: 'How do you write a list comprehension to square numbers in [1, 2, 3]?', options: [{ label: 'A', value: '[x**2 for x in nums]' }, { label: 'B', value: 'map(x^2, nums)' }, { label: 'C', value: 'nums.square()' }, { label: 'D', value: 'for x in nums: x^2' }], correctAnswer: '[x**2 for x in nums]', category: 'python' },
    { questionText: 'What does dict.get(key, default) do if key is missing?', options: [{ label: 'A', value: 'Raises KeyError' }, { label: 'B', value: 'Returns default value' }, { label: 'C', value: 'Returns None always' }, { label: 'D', value: 'Deletes key' }], correctAnswer: 'Returns default value', category: 'python' },
];

const WEB_QUESTIONS: Omit<Question, 'id'>[] = [
    { questionText: 'Which HTML tag is used to create a hyperlink?', options: [{ label: 'A', value: '<link>' }, { label: 'B', value: '<a>' }, { label: 'C', value: '<href>' }, { label: 'D', value: '<url>' }], correctAnswer: '<a>', category: 'web' },
    { questionText: 'What does CSS stand for?', options: [{ label: 'A', value: 'Cascading Style Sheets' }, { label: 'B', value: 'Computer Style Syntax' }, { label: 'C', value: 'Creative Sheet Styles' }, { label: 'D', value: 'Central System Sheets' }], correctAnswer: 'Cascading Style Sheets', category: 'web' },
    { questionText: 'Which HTTP method is used to submit data to a server?', options: [{ label: 'A', value: 'GET' }, { label: 'B', value: 'POST' }, { label: 'C', value: 'FETCH' }, { label: 'D', value: 'PUSH' }], correctAnswer: 'POST', category: 'web' },
    { questionText: 'What does JSON stand for?', options: [{ label: 'A', value: 'JavaScript Object Notation' }, { label: 'B', value: 'Java System Offline Network' }, { label: 'C', value: 'JavaScript Online Nodes' }, { label: 'D', value: 'Joint Syntax Object Name' }], correctAnswer: 'JavaScript Object Notation', category: 'web' },
    { questionText: 'Which JavaScript array method adds an element to the end?', options: [{ label: 'A', value: '.push()' }, { label: 'B', value: '.append()' }, { label: 'C', value: '.add()' }, { label: 'D', value: '.insert()' }], correctAnswer: '.push()', category: 'web' },
];

const ALGO_QUESTIONS: Omit<Question, 'id'>[] = [
    { questionText: 'What is the time complexity of Binary Search on a sorted array of size N?', options: [{ label: 'A', value: 'O(N)' }, { label: 'B', value: 'O(log N)' }, { label: 'C', value: 'O(N^2)' }, { label: 'D', value: 'O(1)' }], correctAnswer: 'O(log N)', category: 'algo' },
    { questionText: 'Which sorting algorithm uses divide and conquer with a pivot element?', options: [{ label: 'A', value: 'Bubble Sort' }, { label: 'B', value: 'Quick Sort' }, { label: 'C', value: 'Insertion Sort' }, { label: 'D', value: 'Selection Sort' }], correctAnswer: 'Quick Sort', category: 'algo' },
    { questionText: 'What data structure operates on a LIFO (Last In First Out) basis?', options: [{ label: 'A', value: 'Queue' }, { label: 'B', value: 'Stack' }, { label: 'C', value: 'Array' }, { label: 'D', value: 'Tree' }], correctAnswer: 'Stack', category: 'algo' },
    { questionText: 'What is a base case in a recursive function?', options: [{ label: 'A', value: 'The starting value' }, { label: 'B', value: 'The condition that stops recursion' }, { label: 'C', value: 'The maximum loop count' }, { label: 'D', value: 'The parameter type' }], correctAnswer: 'The condition that stops recursion', category: 'algo' },
    { questionText: 'Which data structure is best for Breadth-First Search (BFS)?', options: [{ label: 'A', value: 'Stack' }, { label: 'B', value: 'Queue' }, { label: 'C', value: 'Heap' }, { label: 'D', value: 'Graph' }], correctAnswer: 'Queue', category: 'algo' },
];

const CYBER_QUESTIONS: Omit<Question, 'id'>[] = [
    { questionText: 'Which cryptographic algorithm is a one-way hashing function?', options: [{ label: 'A', value: 'AES' }, { label: 'B', value: 'SHA-256' }, { label: 'C', value: 'RSA' }, { label: 'D', value: 'Base64' }], correctAnswer: 'SHA-256', category: 'cyber' },
    { questionText: 'What default port does HTTPS use?', options: [{ label: 'A', value: '80' }, { label: 'B', value: '443' }, { label: 'C', value: '22' }, { label: 'D', value: '8080' }], correctAnswer: '443', category: 'cyber' },
    { questionText: 'What vulnerability occurs when untrusted user input is injected into a database query?', options: [{ label: 'A', value: 'XSS' }, { label: 'B', value: 'SQL Injection' }, { label: 'C', value: 'Buffer Overflow' }, { label: 'D', value: 'CSRF' }], correctAnswer: 'SQL Injection', category: 'cyber' },
    { questionText: 'What does Base64 encoding do?', options: [{ label: 'A', value: 'Encrypts with a key' }, { label: 'B', value: 'Encodes binary data into ASCII text' }, { label: 'C', value: 'Compresses file size' }, { label: 'D', value: 'Hashes passwords' }], correctAnswer: 'Encodes binary data into ASCII text', category: 'cyber' },
    { questionText: 'Which protocol secures web traffic with TLS encryption?', options: [{ label: 'A', value: 'HTTP' }, { label: 'B', value: 'HTTPS' }, { label: 'C', value: 'FTP' }, { label: 'D', value: 'UDP' }], correctAnswer: 'HTTPS', category: 'cyber' },
];

const MATH_QUESTIONS: Omit<Question, 'id'>[] = [
    { questionText: 'What is 12 × 12?', options: [{ label: 'A', value: '144' }, { label: 'B', value: '124' }, { label: 'C', value: '24' }, { label: 'D', value: '122' }], correctAnswer: '144', category: 'math' },
    { questionText: 'What is 20% of 150?', options: [{ label: 'A', value: '20' }, { label: 'B', value: '25' }, { label: 'C', value: '30' }, { label: 'D', value: '35' }], correctAnswer: '30', category: 'math' },
    { questionText: 'What is the square root of 225?', options: [{ label: 'A', value: '15' }, { label: 'B', value: '25' }, { label: 'C', value: '35' }, { label: 'D', value: '45' }], correctAnswer: '15', category: 'math' },
    { questionText: 'Convert 0.75 to a fraction.', options: [{ label: 'A', value: '1/2' }, { label: 'B', value: '2/3' }, { label: 'C', value: '3/4' }, { label: 'D', value: '4/5' }], correctAnswer: '3/4', category: 'math' },
    { questionText: 'If 4x = 32, what is x?', options: [{ label: 'A', value: '6' }, { label: 'B', value: '7' }, { label: 'C', value: '8' }, { label: 'D', value: '9' }], correctAnswer: '8', category: 'math' },
];

const LOGIC_QUESTIONS: Omit<Question, 'id'>[] = [
    { questionText: 'All roses are flowers. Some flowers fade quickly. Which statement is true?', options: [{ label: 'A', value: 'All roses fade quickly' }, { label: 'B', value: 'Some roses fade' }, { label: 'C', value: 'All roses are flowers' }, { label: 'D', value: 'No roses fade' }], correctAnswer: 'All roses are flowers', category: 'logic' },
    { questionText: 'If A > B, B > C, and C > D, which is the smallest?', options: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'C', value: 'C' }, { label: 'D', value: 'D' }], correctAnswer: 'D', category: 'logic' },
    { questionText: 'In a race you pass the person in 2nd place. What place are you in now?', options: [{ label: 'A', value: '1st' }, { label: 'B', value: '2nd' }, { label: 'C', value: '3rd' }, { label: 'D', value: 'Last' }], correctAnswer: '2nd', category: 'logic' },
    { questionText: 'If it takes 5 machines 5 minutes to make 5 widgets, how long for 100 machines to make 100 widgets?', options: [{ label: 'A', value: '100 min' }, { label: 'B', value: '5 min' }, { label: 'C', value: '20 min' }, { label: 'D', value: '1 min' }], correctAnswer: '5 min', category: 'logic' },
const KIDS_QUESTIONS: Omit<Question, 'id'>[] = [
    { questionText: '🤖 Robo needs to cross the grid. Which order of commands reaches the star?', options: [{ label: 'A', value: 'Forward -> Turn Right -> Forward' }, { label: 'B', value: 'Turn Right -> Stop' }, { label: 'C', value: 'Turn Left -> Turn Left' }, { label: 'D', value: 'Backwards -> Backward' }], correctAnswer: 'Forward -> Turn Right -> Forward', category: 'kids' },
    { questionText: '🐒 To eat 5 bananas with a loop, how many times does the monkey repeat "Eat Banana"?', options: [{ label: 'A', value: '1 time' }, { label: 'B', value: '5 times' }, { label: 'C', value: '10 times' }, { label: 'D', value: '0 times' }], correctAnswer: '5 times', category: 'kids' },
    { questionText: '🐱 In Scratch, which color block starts your code when clicked?', options: [{ label: 'A', value: 'Green Flag (Events)' }, { label: 'B', value: 'Red Stop Sign' }, { label: 'C', value: 'Purple Sound' }, { label: 'D', value: 'Yellow Paint' }], correctAnswer: 'Green Flag (Events)', category: 'kids' },
    { questionText: '🍕 If IF it is raining = TRUE, what should the robot wear?', options: [{ label: 'A', value: 'Raincoat & Umbrella' }, { label: 'B', value: 'Sunglasses' }, { label: 'C', value: 'Swimsuit' }, { label: 'D', value: 'Skates' }], correctAnswer: 'Raincoat & Umbrella', category: 'kids' },
    { questionText: '🎨 What comes next in the color sequence: 🔴 🔵 🔴 🔵 🔴 ___?', options: [{ label: 'A', value: '🔵 Blue' }, { label: 'B', value: '🟢 Green' }, { label: 'C', value: '🔴 Red' }, { label: 'D', value: '🟡 Yellow' }], correctAnswer: '🔵 Blue', category: 'kids' },
    { questionText: '🚀 What is a countdown loop from 3 to 1?', options: [{ label: 'A', value: '3, 2, 1, Blastoff!' }, { label: 'B', value: '1, 1, 1' }, { label: 'C', value: '0, 5, 10' }, { label: 'D', value: 'Stop, Go' }], correctAnswer: '3, 2, 1, Blastoff!', category: 'kids' },
    { questionText: '🐝 If a bee moves 2 steps East and 3 steps North, where does it land?', options: [{ label: 'A', value: 'At the Flower (2, 3)' }, { label: 'B', value: 'At the Hive (0, 0)' }, { label: 'C', value: 'Under water' }, { label: 'D', value: 'On a mountain' }], correctAnswer: 'At the Flower (2, 3)', category: 'kids' },
    { questionText: '🧙 IF wizard has 10 mana -> Cast Fireball, ELSE -> Cast Spark. Wizard has 12 mana. What spell is cast?', options: [{ label: 'A', value: 'Fireball' }, { label: 'B', value: 'Spark' }, { label: 'C', value: 'Sleep' }, { label: 'D', value: 'Ice' }], correctAnswer: 'Fireball', category: 'kids' },
    { questionText: '🎮 Which score is the HIGHEST in this list: [150, 420, 990, 310]?', options: [{ label: 'A', value: '990' }, { label: 'B', value: '420' }, { label: 'C', value: '150' }, { label: 'D', value: '310' }], correctAnswer: '990', category: 'kids' },
    { questionText: '📦 How does a sorting machine arrange blocks from smallest to largest?', options: [{ label: 'A', value: '1cm, 3cm, 5cm, 10cm' }, { label: 'B', value: '10cm, 5cm, 1cm' }, { label: 'C', value: 'Random mix' }, { label: 'D', value: '5cm, 1cm, 10cm' }], correctAnswer: '1cm, 3cm, 5cm, 10cm', category: 'kids' },
    { questionText: '🔑 What is the secret word for emoji code: 🍎 = A, 🐝 = B, 🐱 = C? Code: 🍎 🐝 🐱', options: [{ label: 'A', value: 'ABC' }, { label: 'B', value: 'CAB' }, { label: 'C', value: 'BAC' }, { label: 'D', value: 'CBA' }], correctAnswer: 'ABC', category: 'kids' },
    { questionText: '🚦 If Traffic Light = RED, what should the self-driving car algorithm do?', options: [{ label: 'A', value: 'STOP' }, { label: 'B', value: 'Speed up' }, { label: 'C', value: 'Honk horn' }, { label: 'D', value: 'Turn off' }], correctAnswer: 'STOP', category: 'kids' },
    { questionText: '🎂 To light 7 candles on a birthday cake, how many times does the candle-lighter loop run?', options: [{ label: 'A', value: '7 times' }, { label: 'B', value: '2 times' }, { label: 'C', value: '100 times' }, { label: 'D', value: '1 time' }], correctAnswer: '7 times', category: 'kids' },
    { questionText: '🍎 Which rule filters ONLY RED fruits from: [Red Apple, Green Pear, Red Cherry, Yellow Banana]?', options: [{ label: 'A', value: 'Keep if Color == Red' }, { label: 'B', value: 'Keep all fruits' }, { label: 'C', value: 'Keep if Size == Big' }, { label: 'D', value: 'Throw away everything' }], correctAnswer: 'Keep if Color == Red', category: 'kids' },
    { questionText: '🐸 A frog jumps 2 lily pads every hop. After 4 hops, how many lily pads ahead is the frog?', options: [{ label: 'A', value: '8 lily pads' }, { label: 'B', value: '4 lily pads' }, { label: 'C', value: '2 lily pads' }, { label: 'D', value: '6 lily pads' }], correctAnswer: '8 lily pads', category: 'kids' },
    { questionText: '🚂 A train track switches left IF track == clear. Track is CLEAR. Which way does train go?', options: [{ label: 'A', value: 'Left' }, { label: 'B', value: 'Right' }, { label: 'C', value: 'Backwards' }, { label: 'D', value: 'Stays still' }], correctAnswer: 'Left', category: 'kids' },
    { questionText: '🦕 T-Rex has 2 arms, Stegosaurus has 4 legs. Which animal has arm_count == 2?', options: [{ label: 'A', value: 'T-Rex' }, { label: 'B', value: 'Stegosaurus' }, { label: 'C', value: 'Fish' }, { label: 'D', value: 'Pterodactyl' }], correctAnswer: 'T-Rex', category: 'kids' },
    { questionText: '🏰 The drawbridge opens IF key_count >= 3. You have 4 keys. Does the drawbridge open?', options: [{ label: 'A', value: 'Yes (TRUE)' }, { label: 'B', value: 'No (FALSE)' }, { label: 'C', value: 'Only on Tuesdays' }, { label: 'D', value: 'Key breaks' }], correctAnswer: 'Yes (TRUE)', category: 'kids' },
    { questionText: '🛸 Alien says "Zog" for Hello and "Blip" for Bye. What does "Zog Blip" mean?', options: [{ label: 'A', value: 'Hello Bye' }, { label: 'B', value: 'Good morning' }, { label: 'C', value: 'Thank you' }, { label: 'D', value: 'Yes No' }], correctAnswer: 'Hello Bye', category: 'kids' },
    { questionText: '🤖 A robot cleaner checks: IF floor == dirty THEN sweep(). Floor is dirty. What does robot do?', options: [{ label: 'A', value: 'Calls sweep()' }, { label: 'B', value: 'Goes to sleep' }, { label: 'C', value: 'Plays music' }, { label: 'D', value: 'Does nothing' }], correctAnswer: 'Calls sweep()', category: 'kids' },
    { questionText: '🧩 Which shape fits into a square hole?', options: [{ label: 'A', value: 'Square block' }, { label: 'B', value: 'Round ball' }, { label: 'C', value: 'Star' }, { label: 'D', value: 'Triangle' }], correctAnswer: 'Square block', category: 'kids' },
    { questionText: '🔍 Clue 1: Animal has feathers. Clue 2: Animal says Quack. What animal is it?', options: [{ label: 'A', value: 'Duck' }, { label: 'B', value: 'Cat' }, { label: 'C', value: 'Elephant' }, { label: 'D', value: 'Dog' }], correctAnswer: 'Duck', category: 'kids' },
    { questionText: '🏰 Coordinates (X=3, Y=5). What is the value of X?', options: [{ label: 'A', value: '3' }, { label: 'B', value: '5' }, { label: 'C', value: '8' }, { label: 'D', value: '0' }], correctAnswer: '3', category: 'kids' },
    { questionText: '🎨 Combining RED light + GREEN light + BLUE light in pixels creates which color?', options: [{ label: 'A', value: 'White light' }, { label: 'B', value: 'Black' }, { label: 'C', value: 'Brown' }, { label: 'D', value: 'Purple' }], correctAnswer: 'White light', category: 'kids' },
    { questionText: '🏆 You solved 5 out of 5 coding puzzles! What is your accuracy percentage?', options: [{ label: 'A', value: '100%' }, { label: 'B', value: '50%' }, { label: 'C', value: '10%' }, { label: 'D', value: '0%' }], correctAnswer: '100%', category: 'kids' },
];

/* ─── Seeded shuffle for consistent challenge order ──────────────── */
function seededShuffle<T>(arr: T[], seed: number): T[] {
    const copy = [...arr];
    let s = seed;
    for (let i = copy.length - 1; i > 0; i--) {
        s = (s * 16807 + 0) % 2147483647;
        const j = s % (i + 1);
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function generateQuestions(challengeId: number, category?: string): Question[] {
    let pool: Omit<Question, 'id'>[];
    switch (category) {
        case 'kids':
            pool = KIDS_QUESTIONS;
            break;
        case 'python':
            pool = PYTHON_QUESTIONS;
            break;
        case 'web':
            pool = WEB_QUESTIONS;
            break;
        case 'algo':
            pool = ALGO_QUESTIONS;
            break;
        case 'cyber':
            pool = CYBER_QUESTIONS;
            break;
        case 'math':
            pool = MATH_QUESTIONS;
            break;
        case 'logic':
        default:
            pool = LOGIC_QUESTIONS;
            break;
    }

    const shuffled = seededShuffle(pool, challengeId * 7919);
    return shuffled.map((q, idx) => ({ ...q, id: idx + 1 }));
}

/* ─── Category badge colors ─────────────────────────────────────── */
const categoryStyleMap: Record<string, { bg: string; text: string; emoji: string; key: string }> = {
    'kids': { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', emoji: '🎈', key: 'Kids' },
    'math': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', emoji: '🔢', key: 'Math' },
    'logic': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', emoji: '🧠', key: 'Logic' },
    'python': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', emoji: '🐍', key: 'Python' },
    'web': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', emoji: '🌐', key: 'Web Dev' },
    'algo': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', emoji: '⚡', key: 'Algorithms' },
    'cyber': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', emoji: '🛡️', key: 'Cybersecurity' },
};

/* ─── Component ─────────────────────────────────────────────────── */
export default function BrainChallengeGameScreen() {
    const navigate = useNavigate();
    const { challengeId } = useParams<{ challengeId: string }>();
    const cId = Number(challengeId) || 1;
    const { t, language } = useLanguage();

    const currentChallenge = getChallengeById(cId);

    const languageNames: Record<string, string> = { en: 'English', fr: 'French', ar: 'Arabic' };
    const promptLang = languageNames[language] || 'English';

    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResultsModal, setShowResultsModal] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchQuestions = async () => {
            setIsLoading(true);
            try {
                const prompt = `Generate 5 quiz questions specifically for the Computer Science topic: "${currentChallenge.title}" (${currentChallenge.categoryLabel}).
The questions MUST directly test knowledge of "${currentChallenge.title}".
The questions, answers, and options MUST be written in ${promptLang}.
Format as a valid JSON array matching this structure:
[
  {
    "questionText": "Question about ${currentChallenge.title}",
    "options": [
      { "label": "A", "value": "Option 1" },
      { "label": "B", "value": "Option 2" },
      { "label": "C", "value": "Option 3" },
      { "label": "D", "value": "Option 4" }
    ],
    "correctAnswer": "Option 1",
    "category": "${currentChallenge.category}"
  }
]`;
                const generated = await api.generateQuizFromAI(prompt);
                
                if (!isMounted) return;

                const mappedQuestions = generated.map((q: any, i: number) => {
                    let formattedOptions = [];
                    if (q.options && q.options[0] && typeof q.options[0] === 'object' && q.options[0].label) {
                        formattedOptions = q.options;
                    } else if (Array.isArray(q.options)) {
                        formattedOptions = q.options.map((o: string, idx: number) => ({ label: ['A','B','C','D'][idx] || 'A', value: String(o) }));
                    }

                    return {
                        id: i + 1,
                        questionText: q.questionText || q.question || `Question on ${currentChallenge.title}`,
                        options: formattedOptions,
                        correctAnswer: String(q.correctAnswer || q.answer || ""),
                        category: (currentChallenge.category as any) || 'logic',
                        imageUrl: q.imagePrompt ? `https://image.pollinations.ai/prompt/${encodeURIComponent(q.imagePrompt + ' colorful 3d kids illustration, cute, bright colors')}` : undefined
                    };
                });

                if (mappedQuestions.length > 0) {
                    setQuestions(mappedQuestions);
                } else {
                    setQuestions(generateQuestions(cId, currentChallenge.category));
                }
            } catch (err) {
                console.error("AI generation failed or timed out:", err);
                if (isMounted) setQuestions(generateQuestions(cId, currentChallenge.category));
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchQuestions();
        return () => { isMounted = false; };
    }, [cId, currentChallenge.title, currentChallenge.category]);

    const selectAnswer = useCallback(
        (questionId: number, value: string) => {
            setAnswers((prev) => ({ ...prev, [questionId]: value }));
        },
        []
    );

    const goTo = (idx: number) => {
        if (idx >= 0 && idx < questions.length) setCurrentIndex(idx);
    };

    const handleFinishQuiz = () => {
        try {
            const stored = localStorage.getItem('completedBrainChallenges');
            const completed = stored ? JSON.parse(stored) : [];
            if (!completed.includes(cId)) {
                localStorage.setItem('completedBrainChallenges', JSON.stringify([...completed, cId]));
            }
        } catch (e) {}
        setShowResultsModal(true);
    };

    if (isLoading || questions.length === 0) {
        return (
            <div className="h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 transition-colors duration-300">
                <div className="w-24 h-24 border-4 border-[#e8f0fe] border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('consulting_ai' as any) || 'Consulting AI...'}</h2>
            </div>
        );
    }

    const current = questions[currentIndex];
    const totalQuestions = questions.length;
    const cat = categoryStyleMap[current.category] || categoryStyleMap['logic'];

    const correctCount = questions.reduce((acc, q) => {
        const userAns = answers[q.id];
        return userAns === q.correctAnswer ? acc + 1 : acc;
    }, 0);
    const pctScore = Math.round((correctCount / totalQuestions) * 100);
    const starRating = pctScore >= 80 ? 3 : pctScore >= 60 ? 2 : pctScore >= 40 ? 1 : 0;

    return (
        <div className="h-screen flex bg-white dark:bg-slate-900 font-sans overflow-hidden relative">
            <aside className="w-44 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col overflow-hidden">
                <h2 className="px-4 py-4 text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    {t('brain_training_questions')}
                </h2>
                <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin">
                    {questions.map((q, idx) => {
                        const isActive = idx === currentIndex;
                        const isAnswered = Boolean(answers[q.id]);
                        return (
                            <button
                                key={q.id}
                                onClick={() => goTo(idx)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : isAnswered
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                            >
                                <span>Question {idx + 1}</span>
                                {isAnswered && (
                                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-emerald-500'}`} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-900">
                    <button
                        onClick={() => navigate('/brain-training')}
                        className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors text-sm font-bold flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                            {currentChallenge.title}
                        </h1>
                        <p className="text-[11px] font-bold text-slate-400">
                            Challenge #{cId} • {currentChallenge.difficulty}
                        </p>
                    </div>
                    <div className="w-16" />
                </div>

                <div className="flex-1 overflow-y-auto px-6 md:px-16 lg:px-28 py-8 flex flex-col items-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${cat.bg} ${cat.text} text-xs font-black uppercase tracking-wider mb-6`}>
                        {cat.emoji} {currentChallenge.categoryLabel}
                    </div>

                    <div className="w-full max-w-3xl mb-10">
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center min-h-[180px] shadow-inner border border-slate-200 dark:border-slate-700">
                            {current.imageUrl && (
                                <div className="w-full max-w-sm aspect-video mb-6 rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-700">
                                    <img src={current.imageUrl} alt="Challenge visual" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <p className="text-xl md:text-3xl font-black text-slate-800 dark:text-white text-center tracking-tight leading-snug">
                                {current.questionText}
                            </p>
                        </div>
                    </div>

                    <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {current.options.map((opt) => {
                            const isSelected = answers[current.id] === opt.value;
                            return (
                                <button
                                    key={opt.label}
                                    onClick={() => selectAnswer(current.id, opt.value)}
                                    className={`relative rounded-2xl p-5 text-center transition-all border-2 cursor-pointer ${
                                        isSelected
                                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/20 scale-[1.02]'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm'
                                    }`}
                                >
                                    <span className={`absolute top-3 left-4 text-xs font-bold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {opt.label}
                                    </span>
                                    <span className={`text-base md:text-lg font-bold block mt-2 break-words leading-tight ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {opt.value}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="px-6 md:px-16 lg:px-28 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        <div className="flex gap-3">
                            <button
                                onClick={() => goTo(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Previous</span>
                            </button>
                        </div>

                        {currentIndex === totalQuestions - 1 ? (
                            <button
                                onClick={handleFinishQuiz}
                                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer animate-pulse"
                            >
                                <span>Finish Quiz & View Results</span>
                                <Trophy className="w-4 h-4 text-amber-300" />
                            </button>
                        ) : (
                            <button
                                onClick={() => goTo(currentIndex + 1)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
                            >
                                <span>Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="max-w-3xl mx-auto mt-3">
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">
                            Question {currentIndex + 1} of {totalQuestions}
                        </p>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* RESULTS MODAL OVERLAY */}
            {showResultsModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-200">
                        <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-inner">
                            <Trophy className="w-10 h-10 text-amber-400" />
                        </div>

                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                                Challenge Completed! 🎉
                            </span>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                {currentChallenge.title}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                                Great job practicing Computer Science fundamentals!
                            </p>
                        </div>

                        {/* Star Rating Display */}
                        <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3].map((starIndex) => (
                                <Star
                                    key={starIndex}
                                    className={`w-8 h-8 ${
                                        starIndex <= starRating
                                            ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                                            : 'text-slate-300 dark:text-slate-700'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Score Breakdown Box */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-around">
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Score</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{correctCount} / {totalQuestions}</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Accuracy</p>
                                <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{pctScore}%</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">XP Earned</p>
                                <p className="text-xl font-black text-amber-500 mt-0.5">+{currentChallenge.xpReward} XP</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2.5 pt-2">
                            <button
                                onClick={() => {
                                    setShowResultsModal(false);
                                    setCurrentIndex(0);
                                    setAnswers({});
                                    navigate(`/brain-training/${cId + 1}`);
                                }}
                                className="w-full py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                <span>Next Challenge</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => {
                                    setShowResultsModal(false);
                                    setCurrentIndex(0);
                                    setAnswers({});
                                }}
                                className="w-full py-2.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
                            >
                                Try Again 🔁
                            </button>

                            <button
                                onClick={() => navigate('/brain-training')}
                                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            >
                                Back to All Challenges 📋
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
