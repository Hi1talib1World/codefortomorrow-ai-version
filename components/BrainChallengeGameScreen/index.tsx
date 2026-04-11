import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

/* ─── Question types ────────────────────────────────────────────── */
interface Question {
    id: number;
    questionText: string;
    options: { label: string; value: string }[];
    correctAnswer: string;
    category: 'math' | 'logic' | 'problem-solving';
    imageUrl?: string;
}

/* ─── Master question pools ─────────────────────────────────────── */

const MATH_QUESTIONS: Omit<Question, 'id'>[] = [
    // Sequences & Patterns
    { questionText: 'What comes next? 2, 6, 18, 54, …', options: [{ label: 'A', value: '108' }, { label: 'B', value: '162' }, { label: 'C', value: '72' }, { label: 'D', value: '128' }], correctAnswer: '162', category: 'math' },
    { questionText: 'What comes next? 1, 1, 2, 3, 5, 8, …', options: [{ label: 'A', value: '11' }, { label: 'B', value: '13' }, { label: 'C', value: '10' }, { label: 'D', value: '15' }], correctAnswer: '13', category: 'math' },
    { questionText: 'What comes next? 3, 9, 27, 81, …', options: [{ label: 'A', value: '162' }, { label: 'B', value: '243' }, { label: 'C', value: '189' }, { label: 'D', value: '324' }], correctAnswer: '243', category: 'math' },
    { questionText: 'Find the missing number: 4, 9, 16, ?, 36', options: [{ label: 'A', value: '20' }, { label: 'B', value: '25' }, { label: 'C', value: '24' }, { label: 'D', value: '28' }], correctAnswer: '25', category: 'math' },
    { questionText: 'What comes next? 1, 4, 9, 16, 25, …', options: [{ label: 'A', value: '30' }, { label: 'B', value: '36' }, { label: 'C', value: '49' }, { label: 'D', value: '32' }], correctAnswer: '36', category: 'math' },
    // Arithmetic puzzles
    { questionText: 'If 5 × ? = 135, what is ?', options: [{ label: 'A', value: '25' }, { label: 'B', value: '27' }, { label: 'C', value: '29' }, { label: 'D', value: '23' }], correctAnswer: '27', category: 'math' },
    { questionText: '(12 × 12) − (11 × 13) = ?', options: [{ label: 'A', value: '0' }, { label: 'B', value: '1' }, { label: 'C', value: '2' }, { label: 'D', value: '−1' }], correctAnswer: '1', category: 'math' },
    { questionText: 'What is 999 + 999 + 999 + 3?', options: [{ label: 'A', value: '2997' }, { label: 'B', value: '3000' }, { label: 'C', value: '2999' }, { label: 'D', value: '3001' }], correctAnswer: '3000', category: 'math' },
    { questionText: 'If half of a number is 68, what is one-quarter of it?', options: [{ label: 'A', value: '34' }, { label: 'B', value: '136' }, { label: 'C', value: '17' }, { label: 'D', value: '68' }], correctAnswer: '34', category: 'math' },
    { questionText: 'A number doubled and increased by 7 gives 47. What is the number?', options: [{ label: 'A', value: '18' }, { label: 'B', value: '20' }, { label: 'C', value: '22' }, { label: 'D', value: '27' }], correctAnswer: '20', category: 'math' },
    // Fractions / Percentages
    { questionText: 'What is 25% of 25% of 400?', options: [{ label: 'A', value: '25' }, { label: 'B', value: '100' }, { label: 'C', value: '50' }, { label: 'D', value: '75' }], correctAnswer: '25', category: 'math' },
    { questionText: 'If 3/5 of a number equals 45, what is the number?', options: [{ label: 'A', value: '75' }, { label: 'B', value: '27' }, { label: 'C', value: '135' }, { label: 'D', value: '60' }], correctAnswer: '75', category: 'math' },
    { questionText: '0.1 + 0.2 + 0.3 + … + 0.9 = ?', options: [{ label: 'A', value: '3.5' }, { label: 'B', value: '4.5' }, { label: 'C', value: '5.0' }, { label: 'D', value: '4.0' }], correctAnswer: '4.5', category: 'math' },
    { questionText: 'Two-thirds of three-quarters of 240 is?', options: [{ label: 'A', value: '120' }, { label: 'B', value: '160' }, { label: 'C', value: '100' }, { label: 'D', value: '180' }], correctAnswer: '120', category: 'math' },
    { questionText: 'If a shirt is $80 after a 20% discount, what was the original price?', options: [{ label: 'A', value: '$96' }, { label: 'B', value: '$100' }, { label: 'C', value: '$90' }, { label: 'D', value: '$110' }], correctAnswer: '$100', category: 'math' },
    // Number properties
    { questionText: 'How many prime numbers are between 1 and 20?', options: [{ label: 'A', value: '6' }, { label: 'B', value: '7' }, { label: 'C', value: '8' }, { label: 'D', value: '9' }], correctAnswer: '8', category: 'math' },
    { questionText: 'What is the sum of the first 10 positive odd numbers?', options: [{ label: 'A', value: '50' }, { label: 'B', value: '100' }, { label: 'C', value: '75' }, { label: 'D', value: '90' }], correctAnswer: '100', category: 'math' },
    { questionText: 'The product of two consecutive numbers is 132. What are they?', options: [{ label: 'A', value: '10 & 11' }, { label: 'B', value: '11 & 12' }, { label: 'C', value: '12 & 13' }, { label: 'D', value: '13 & 14' }], correctAnswer: '11 & 12', category: 'math' },
    { questionText: 'What is the smallest number divisible by 1, 2, 3, 4, 5, and 6?', options: [{ label: 'A', value: '30' }, { label: 'B', value: '60' }, { label: 'C', value: '120' }, { label: 'D', value: '180' }], correctAnswer: '60', category: 'math' },
    { questionText: 'If you write all numbers from 1 to 100, how many times does the digit 9 appear?', options: [{ label: 'A', value: '10' }, { label: 'B', value: '19' }, { label: 'C', value: '20' }, { label: 'D', value: '21' }], correctAnswer: '20', category: 'math' },
    // Geometry & Algebra basics
    { questionText: 'If a square has an area of 64, what is its perimeter?', options: [{ label: 'A', value: '24' }, { label: 'B', value: '32' }, { label: 'C', value: '16' }, { label: 'D', value: '64' }], correctAnswer: '32', category: 'math' },
    { questionText: 'How many degrees are in a triangle?', options: [{ label: 'A', value: '90°' }, { label: 'B', value: '180°' }, { label: 'C', value: '360°' }, { label: 'D', value: '270°' }], correctAnswer: '180°', category: 'math' },
    { questionText: 'If x + 5 = 12, what is x?', options: [{ label: 'A', value: '5' }, { label: 'B', value: '6' }, { label: 'C', value: '7' }, { label: 'D', value: '8' }], correctAnswer: '7', category: 'math' },
    { questionText: 'What is 7 squared?', options: [{ label: 'A', value: '14' }, { label: 'B', value: '42' }, { label: 'C', value: '49' }, { label: 'D', value: '56' }], correctAnswer: '49', category: 'math' },
    { questionText: 'What is the square root of 144?', options: [{ label: 'A', value: '10' }, { label: 'B', value: '11' }, { label: 'C', value: '12' }, { label: 'D', value: '14' }], correctAnswer: '12', category: 'math' },
    { questionText: 'A triangle with all sides equal is called…', options: [{ label: 'A', value: 'Isosceles' }, { label: 'B', value: 'Scalene' }, { label: 'C', value: 'Equilateral' }, { label: 'D', value: 'Right dihedral' }], correctAnswer: 'Equilateral', category: 'math' },
    { questionText: 'If 3x = 21, what is x?', options: [{ label: 'A', value: '7' }, { label: 'B', value: '8' }, { label: 'C', value: '6' }, { label: 'D', value: '9' }], correctAnswer: '7', category: 'math' },
    { questionText: 'What is 15% of 200?', options: [{ label: 'A', value: '15' }, { label: 'B', value: '30' }, { label: 'C', value: '45' }, { label: 'D', value: '20' }], correctAnswer: '30', category: 'math' },
    { questionText: 'The perimeter of a rectangle is 20 and length is 6. What is width?', options: [{ label: 'A', value: '4' }, { label: 'B', value: '8' }, { label: 'C', value: '14' }, { label: 'D', value: '2' }], correctAnswer: '4', category: 'math' },
    { questionText: 'How many sides does a hexagon have?', options: [{ label: 'A', value: '5' }, { label: 'B', value: '6' }, { label: 'C', value: '7' }, { label: 'D', value: '8' }], correctAnswer: '6', category: 'math' },
    // Advanced expansion
    { questionText: 'What is 12 x 12?', options: [{ label: 'A', value: '144' }, { label: 'B', value: '124' }, { label: 'C', value: '24' }, { label: 'D', value: '122' }], correctAnswer: '144', category: 'math' },
    { questionText: 'What is 100 / 4 - 5?', options: [{ label: 'A', value: '15' }, { label: 'B', value: '20' }, { label: 'C', value: '25' }, { label: 'D', value: '30' }], correctAnswer: '20', category: 'math' },
    { questionText: 'What number follows: 1, 3, 6, 10, ...?', options: [{ label: 'A', value: '13' }, { label: 'B', value: '14' }, { label: 'C', value: '15' }, { label: 'D', value: '16' }], correctAnswer: '15', category: 'math' },
    { questionText: 'How many millimeters are in one centimeter?', options: [{ label: 'A', value: '10' }, { label: 'B', value: '100' }, { label: 'C', value: '1000' }, { label: 'D', value: '1' }], correctAnswer: '10', category: 'math' },
    { questionText: 'Calculate 2 to the power of 3 (2³).', options: [{ label: 'A', value: '6' }, { label: 'B', value: '8' }, { label: 'C', value: '9' }, { label: 'D', value: '12' }], correctAnswer: '8', category: 'math' },
    // Super expansion Math
    { questionText: 'What is 20% of 150?', options: [{ label: 'A', value: '20' }, { label: 'B', value: '25' }, { label: 'C', value: '30' }, { label: 'D', value: '35' }], correctAnswer: '30', category: 'math' },
    { questionText: 'What is the next number: 2, 5, 10, 17, 26, ...?', options: [{ label: 'A', value: '37' }, { label: 'B', value: '35' }, { label: 'C', value: '39' }, { label: 'D', value: '41' }], correctAnswer: '37', category: 'math' },
    { questionText: 'Calculate 5 factorial (5!)', options: [{ label: 'A', value: '60' }, { label: 'B', value: '100' }, { label: 'C', value: '120' }, { label: 'D', value: '150' }], correctAnswer: '120', category: 'math' },
    { questionText: 'If a triangle has a base of 10 and height of 5, what is its area?', options: [{ label: 'A', value: '15' }, { label: 'B', value: '25' }, { label: 'C', value: '50' }, { label: 'D', value: '100' }], correctAnswer: '25', category: 'math' },
    { questionText: 'What is the square root of 225?', options: [{ label: 'A', value: '15' }, { label: 'B', value: '25' }, { label: 'C', value: '35' }, { label: 'D', value: '45' }], correctAnswer: '15', category: 'math' },
    { questionText: 'Convert 0.75 to a fraction.', options: [{ label: 'A', value: '1/2' }, { label: 'B', value: '2/3' }, { label: 'C', value: '3/4' }, { label: 'D', value: '4/5' }], correctAnswer: '3/4', category: 'math' },
    { questionText: 'What is 9 x 12?', options: [{ label: 'A', value: '96' }, { label: 'B', value: '108' }, { label: 'C', value: '112' }, { label: 'D', value: '120' }], correctAnswer: '108', category: 'math' },
    { questionText: 'If 4x = 32, what is x?', options: [{ label: 'A', value: '6' }, { label: 'B', value: '7' }, { label: 'C', value: '8' }, { label: 'D', value: '9' }], correctAnswer: '8', category: 'math' },
    { questionText: 'What is the sum of angles in a square?', options: [{ label: 'A', value: '180°' }, { label: 'B', value: '270°' }, { label: 'C', value: '360°' }, { label: 'D', value: '540°' }], correctAnswer: '360°', category: 'math' },
    { questionText: 'What is 1000 / 8?', options: [{ label: 'A', value: '100' }, { label: 'B', value: '115' }, { label: 'C', value: '125' }, { label: 'D', value: '150' }], correctAnswer: '125', category: 'math' },
];

const LOGIC_QUESTIONS: Omit<Question, 'id'>[] = [
    { questionText: 'All roses are flowers. Some flowers fade quickly. Which statement is definitely true?', options: [{ label: 'A', value: 'All roses fade quickly' }, { label: 'B', value: 'Some roses fade quickly' }, { label: 'C', value: 'All roses are flowers' }, { label: 'D', value: 'No roses fade quickly' }], correctAnswer: 'All roses are flowers', category: 'logic' },
    { questionText: 'If A > B, B > C, and C > D, which is the smallest?', options: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'C', value: 'C' }, { label: 'D', value: 'D' }], correctAnswer: 'D', category: 'logic' },
    { questionText: 'A is the brother of B. B is the sister of C. How is A related to C?', options: [{ label: 'A', value: 'Father' }, { label: 'B', value: 'Brother' }, { label: 'C', value: 'Uncle' }, { label: 'D', value: 'Cannot be determined' }], correctAnswer: 'Brother', category: 'logic' },
    { questionText: 'If APPLE is coded as 50, what is GRAPE coded as? (A=1, B=2 …)', options: [{ label: 'A', value: '46' }, { label: 'B', value: '47' }, { label: 'C', value: '50' }, { label: 'D', value: '43' }], correctAnswer: '47', category: 'logic' },
    { questionText: 'Which number does not belong: 8, 27, 64, 100, 125?', options: [{ label: 'A', value: '8' }, { label: 'B', value: '27' }, { label: 'C', value: '100' }, { label: 'D', value: '125' }], correctAnswer: '100', category: 'logic' },
    { questionText: 'If the day before yesterday was Thursday, what day is tomorrow?', options: [{ label: 'A', value: 'Saturday' }, { label: 'B', value: 'Sunday' }, { label: 'C', value: 'Monday' }, { label: 'D', value: 'Friday' }], correctAnswer: 'Sunday', category: 'logic' },
    { questionText: 'I am an odd number. Take away a letter and I become even. What am I?', options: [{ label: 'A', value: 'Five' }, { label: 'B', value: 'Seven' }, { label: 'C', value: 'Three' }, { label: 'D', value: 'Nine' }], correctAnswer: 'Seven', category: 'logic' },
    { questionText: 'A clock shows 3:15. What is the angle between the hour and minute hands?', options: [{ label: 'A', value: '0°' }, { label: 'B', value: '7.5°' }, { label: 'C', value: '15°' }, { label: 'D', value: '22.5°' }], correctAnswer: '7.5°', category: 'logic' },
    { questionText: 'If you rearrange "CIFAIPC", you get the name of a(n)…', options: [{ label: 'A', value: 'Ocean' }, { label: 'B', value: 'Country' }, { label: 'C', value: 'City' }, { label: 'D', value: 'Animal' }], correctAnswer: 'Ocean', category: 'logic' },
    { questionText: 'In a race you pass the person in 2nd place. What place are you in now?', options: [{ label: 'A', value: '1st' }, { label: 'B', value: '2nd' }, { label: 'C', value: '3rd' }, { label: 'D', value: 'Last' }], correctAnswer: '2nd', category: 'logic' },
    { questionText: 'How many triangles are in a pentagon with all its diagonals drawn?', options: [{ label: 'A', value: '10' }, { label: 'B', value: '35' }, { label: 'C', value: '20' }, { label: 'D', value: '15' }], correctAnswer: '35', category: 'logic' },
    { questionText: 'Which letter comes next: O, T, T, F, F, S, S, …?', options: [{ label: 'A', value: 'N' }, { label: 'B', value: 'E' }, { label: 'C', value: 'T' }, { label: 'D', value: 'U' }], correctAnswer: 'E', category: 'logic' },
    { questionText: 'A farmer has 17 sheep. All but 9 die. How many are left?', options: [{ label: 'A', value: '8' }, { label: 'B', value: '9' }, { label: 'C', value: '17' }, { label: 'D', value: '0' }], correctAnswer: '9', category: 'logic' },
    { questionText: 'Two fathers and two sons sit down for lunch. They eat exactly 3 burgers. How?', options: [{ label: 'A', value: 'They share' }, { label: 'B', value: 'One is grandfather' }, { label: 'C', value: 'One left early' }, { label: 'D', value: 'Trick question' }], correctAnswer: 'One is grandfather', category: 'logic' },
    { questionText: 'Which is heavier: a pound of feathers or a pound of steel?', options: [{ label: 'A', value: 'Feathers' }, { label: 'B', value: 'Steel' }, { label: 'C', value: 'Same weight' }, { label: 'D', value: 'Depends on volume' }], correctAnswer: 'Same weight', category: 'logic' },
    { questionText: 'If there are 3 apples and you take 2, how many do you have?', options: [{ label: 'A', value: '1' }, { label: 'B', value: '2' }, { label: 'C', value: '3' }, { label: 'D', value: '0' }], correctAnswer: '2', category: 'logic' },
    { questionText: 'What has keys but can\'t open locks?', options: [{ label: 'A', value: 'A map' }, { label: 'B', value: 'A piano' }, { label: 'C', value: 'A phone' }, { label: 'D', value: 'A safe' }], correctAnswer: 'A piano', category: 'logic' },
    { questionText: 'A man builds a house with all 4 sides facing south. A bear walks by. What color is the bear?', options: [{ label: 'A', value: 'Brown' }, { label: 'B', value: 'Black' }, { label: 'C', value: 'White' }, { label: 'D', value: 'Gray' }], correctAnswer: 'White', category: 'logic' },
    { questionText: 'Forward I am heavy, backward I am not. What am I?', options: [{ label: 'A', value: 'Scale' }, { label: 'B', value: 'Ton' }, { label: 'C', value: 'Lead' }, { label: 'D', value: 'Stone' }], correctAnswer: 'Ton', category: 'logic' },
    { questionText: 'If it takes 5 machines 5 minutes to make 5 widgets, how long for 100 machines to make 100 widgets?', options: [{ label: 'A', value: '100 min' }, { label: 'B', value: '5 min' }, { label: 'C', value: '20 min' }, { label: 'D', value: '1 min' }], correctAnswer: '5 min', category: 'logic' },
    // Additional logic questions
    { questionText: 'I speak without a mouth and hear without ears. What am I?', options: [{ label: 'A', value: 'Echo' }, { label: 'B', value: 'Wind' }, { label: 'C', value: 'Shadow' }, { label: 'D', value: 'Dream' }], correctAnswer: 'Echo', category: 'logic' },
    { questionText: 'A red house is made of red bricks. What is a greenhouse made of?', options: [{ label: 'A', value: 'Green bricks' }, { label: 'B', value: 'Wood' }, { label: 'C', value: 'Glass' }, { label: 'D', value: 'Leaves' }], correctAnswer: 'Glass', category: 'logic' },
    { questionText: 'What goes up but never comes down?', options: [{ label: 'A', value: 'Age' }, { label: 'B', value: 'Balloon' }, { label: 'C', value: 'Rain' }, { label: 'D', value: 'Temperature' }], correctAnswer: 'Age', category: 'logic' },
    { questionText: 'I have branches, but no fruit, trunk or leaves. What am I?', options: [{ label: 'A', value: 'Tree' }, { label: 'B', value: 'Bank' }, { label: 'C', value: 'Family' }, { label: 'D', value: 'River' }], correctAnswer: 'Bank', category: 'logic' },
    { questionText: 'What gets bigger the more you take away?', options: [{ label: 'A', value: 'Debt' }, { label: 'B', value: 'Hole' }, { label: 'C', value: 'Time' }, { label: 'D', value: 'Space' }], correctAnswer: 'Hole', category: 'logic' },
    // Advanced logic expansion
    { questionText: 'I am tall when I\'m young, and I\'m short when I\'m old. What am I?', options: [{ label: 'A', value: 'Tree' }, { label: 'B', value: 'Mountain' }, { label: 'C', value: 'Candle' }, { label: 'D', value: 'Building' }], correctAnswer: 'Candle', category: 'logic' },
    { questionText: 'What has hands but cannot clap?', options: [{ label: 'A', value: 'Robot' }, { label: 'B', value: 'Statue' }, { label: 'C', value: 'Clock' }, { label: 'D', value: 'Doll' }], correctAnswer: 'Clock', category: 'logic' },
    { questionText: 'What has words, but never speaks?', options: [{ label: 'A', value: 'Book' }, { label: 'B', value: 'Radio' }, { label: 'C', value: 'Teacher' }, { label: 'D', value: 'Sign' }], correctAnswer: 'Book', category: 'logic' },
    { questionText: 'The more of this there is, the less you see. What is it?', options: [{ label: 'A', value: 'Fog' }, { label: 'B', value: 'Darkness' }, { label: 'C', value: 'Snow' }, { label: 'D', value: 'Light' }], correctAnswer: 'Darkness', category: 'logic' },
    { questionText: 'Which word is written incorrectly in the dictionary?', options: [{ label: 'A', value: 'Incorrectly' }, { label: 'B', value: 'Wrongly' }, { label: 'C', value: 'No words' }, { label: 'D', value: 'All words' }], correctAnswer: 'Incorrectly', category: 'logic' },
    // Super expansion Logic
    { questionText: 'I have a tail, and I have a head, but I have no body. What am I?', options: [{ label: 'A', value: 'Snake' }, { label: 'B', value: 'Coin' }, { label: 'C', value: 'Worm' }, { label: 'D', value: 'Spoon' }], correctAnswer: 'Coin', category: 'logic' },
    { questionText: 'David’s parents have three sons: Snap, Crackle, and what’s the name of the third?', options: [{ label: 'A', value: 'Pop' }, { label: 'B', value: 'David' }, { label: 'C', value: 'John' }, { label: 'D', value: 'Smith' }], correctAnswer: 'David', category: 'logic' },
    { questionText: 'What gets wetter as it dries?', options: [{ label: 'A', value: 'Water' }, { label: 'B', value: 'Towel' }, { label: 'C', value: 'Sponge' }, { label: 'D', value: 'Cloud' }], correctAnswer: 'Towel', category: 'logic' },
    { questionText: 'What is full of holes but still holds water?', options: [{ label: 'A', value: 'Sponge' }, { label: 'B', value: 'Sieve' }, { label: 'C', value: 'Net' }, { label: 'D', value: 'Bucket' }], correctAnswer: 'Sponge', category: 'logic' },
    { questionText: 'I’m light as a feather, yet the strongest man can’t hold me for five minutes. What am I?', options: [{ label: 'A', value: 'Air' }, { label: 'B', value: 'Breath' }, { label: 'C', value: 'Thought' }, { label: 'D', value: 'Shadow' }], correctAnswer: 'Breath', category: 'logic' },
    { questionText: 'What is always in front of you but can’t be seen?', options: [{ label: 'A', value: 'Air' }, { label: 'B', value: 'Future' }, { label: 'C', value: 'Nose' }, { label: 'D', value: 'Eyebrows' }], correctAnswer: 'Future', category: 'logic' },
    { questionText: 'If you drop a yellow hat in the Red Sea, what does it become?', options: [{ label: 'A', value: 'Red' }, { label: 'B', value: 'Orange' }, { label: 'C', value: 'Wet' }, { label: 'D', value: 'Sunk' }], correctAnswer: 'Wet', category: 'logic' },
    { questionText: 'There is a one-story house where everything is yellow. What color are the stairs?', options: [{ label: 'A', value: 'Yellow' }, { label: 'B', value: 'White' }, { label: 'C', value: 'Wood' }, { label: 'D', value: 'No stairs' }], correctAnswer: 'No stairs', category: 'logic' },
    { questionText: 'What starts with T, ends with T, and has T in it?', options: [{ label: 'A', value: 'Tent' }, { label: 'B', value: 'Target' }, { label: 'C', value: 'Teapot' }, { label: 'D', value: 'Text' }], correctAnswer: 'Teapot', category: 'logic' },
];

const PROBLEM_SOLVING_QUESTIONS: Omit<Question, 'id'>[] = [
    { questionText: 'A train travels 60 km/h. It takes 2.5 hours. How far does it go?', options: [{ label: 'A', value: '120 km' }, { label: 'B', value: '150 km' }, { label: 'C', value: '140 km' }, { label: 'D', value: '180 km' }], correctAnswer: '150 km', category: 'problem-solving' },
    { questionText: 'Alice has twice as many marbles as Bob. Together they have 36. How many does Alice have?', options: [{ label: 'A', value: '12' }, { label: 'B', value: '18' }, { label: 'C', value: '24' }, { label: 'D', value: '30' }], correctAnswer: '24', category: 'problem-solving' },
    { questionText: 'A pool fills in 6 hours with tap A and empties in 12 hours via a drain. If both are open, how long to fill?', options: [{ label: 'A', value: '8 hours' }, { label: 'B', value: '10 hours' }, { label: 'C', value: '12 hours' }, { label: 'D', value: '24 hours' }], correctAnswer: '12 hours', category: 'problem-solving' },
    { questionText: 'You have a 3-liter and a 5-liter jug. How do you measure exactly 4 liters?', options: [{ label: 'A', value: 'Fill 5, pour into 3' }, { label: 'B', value: 'Fill 3 twice into 5' }, { label: 'C', value: 'Impossible' }, { label: 'D', value: 'Fill 5, pour 3 out, pour rest into 3, fill 5 again, pour into 3' }], correctAnswer: 'Fill 5, pour 3 out, pour rest into 3, fill 5 again, pour into 3', category: 'problem-solving' },
    { questionText: 'A book has 500 pages. How many digits are used to number all pages?', options: [{ label: 'A', value: '1392' }, { label: 'B', value: '1500' }, { label: 'C', value: '1389' }, { label: 'D', value: '1404' }], correctAnswer: '1392', category: 'problem-solving' },
    { questionText: 'A snail climbs 3 meters each day but slides back 2 meters each night. How many days to climb 10 meters?', options: [{ label: 'A', value: '10' }, { label: 'B', value: '8' }, { label: 'C', value: '7' }, { label: 'D', value: '9' }], correctAnswer: '8', category: 'problem-solving' },
    { questionText: 'Tom is 15 years old and his sister is half his age. When Tom is 30, how old will his sister be?', options: [{ label: 'A', value: '15' }, { label: 'B', value: '22' }, { label: 'C', value: '22.5' }, { label: 'D', value: '25' }], correctAnswer: '22.5', category: 'problem-solving' },
    { questionText: 'In a knockout tournament with 64 teams, how many matches are needed to find the winner?', options: [{ label: 'A', value: '32' }, { label: 'B', value: '63' }, { label: 'C', value: '64' }, { label: 'D', value: '128' }], correctAnswer: '63', category: 'problem-solving' },
    { questionText: 'You flip a coin 3 times. What\'s the probability of getting at least 2 heads?', options: [{ label: 'A', value: '3/8' }, { label: 'B', value: '1/2' }, { label: 'C', value: '4/8' }, { label: 'D', value: '5/8' }], correctAnswer: '4/8', category: 'problem-solving' },
    { questionText: 'A car uses 8 liters per 100 km. How much fuel for a 350 km trip?', options: [{ label: 'A', value: '24 L' }, { label: 'B', value: '28 L' }, { label: 'C', value: '32 L' }, { label: 'D', value: '35 L' }], correctAnswer: '28 L', category: 'problem-solving' },
    { questionText: 'If 8 workers can build a wall in 10 days, how many days for 4 workers?', options: [{ label: 'A', value: '15' }, { label: 'B', value: '20' }, { label: 'C', value: '25' }, { label: 'D', value: '40' }], correctAnswer: '20', category: 'problem-solving' },
    { questionText: 'A rectangle has a perimeter of 30 cm and a width of 5 cm. What is its area?', options: [{ label: 'A', value: '25 cm²' }, { label: 'B', value: '50 cm²' }, { label: 'C', value: '75 cm²' }, { label: 'D', value: '100 cm²' }], correctAnswer: '50 cm²', category: 'problem-solving' },
    { questionText: 'How many squares of any size are on a standard 8×8 chessboard?', options: [{ label: 'A', value: '64' }, { label: 'B', value: '200' }, { label: 'C', value: '204' }, { label: 'D', value: '256' }], correctAnswer: '204', category: 'problem-solving' },
    { questionText: 'You buy an item for $7, sell for $8, buy for $9, sell for $10. What is your profit?', options: [{ label: 'A', value: '$1' }, { label: 'B', value: '$2' }, { label: 'C', value: '$3' }, { label: 'D', value: '$4' }], correctAnswer: '$2', category: 'problem-solving' },
    { questionText: 'A pizza is cut with 4 straight cuts. What is the maximum number of pieces?', options: [{ label: 'A', value: '8' }, { label: 'B', value: '10' }, { label: 'C', value: '11' }, { label: 'D', value: '12' }], correctAnswer: '11', category: 'problem-solving' },
    { questionText: 'Three friends share a $30 hotel room. They each pay $10. The clerk returns $5. The bellboy keeps $2 and gives $1 back to each friend. They paid $9 each ($27) + $2 tip = $29. Where is the missing $1?', options: [{ label: 'A', value: 'With the clerk' }, { label: 'B', value: 'Trick question — no $ missing' }, { label: 'C', value: 'With the bellboy' }, { label: 'D', value: 'Lost' }], correctAnswer: 'Trick question — no $ missing', category: 'problem-solving' },
    { questionText: 'A cube is painted red and cut into 27 identical smaller cubes. How many small cubes have exactly 2 red faces?', options: [{ label: 'A', value: '6' }, { label: 'B', value: '8' }, { label: 'C', value: '12' }, { label: 'D', value: '18' }], correctAnswer: '12', category: 'problem-solving' },
    { questionText: 'A bacteria population doubles every hour. If a jar is full at 12:00, when was it half full?', options: [{ label: 'A', value: '6:00' }, { label: 'B', value: '10:00' }, { label: 'C', value: '11:00' }, { label: 'D', value: '11:30' }], correctAnswer: '11:00', category: 'problem-solving' },
    { questionText: 'You have 12 coins. One is fake and lighter. Using a balance scale, what is the minimum weighings needed?', options: [{ label: 'A', value: '2' }, { label: 'B', value: '3' }, { label: 'C', value: '4' }, { label: 'D', value: '6' }], correctAnswer: '3', category: 'problem-solving' },
    { questionText: 'A lily pad doubles in size each day. On day 48, it covers the whole lake. On which day did it cover half?', options: [{ label: 'A', value: '24' }, { label: 'B', value: '36' }, { label: 'C', value: '46' }, { label: 'D', value: '47' }], correctAnswer: '47', category: 'problem-solving' },
    // Additional problem solving questions
    { questionText: 'What occurs once in a minute, twice in a moment, and never in 1,000 years?', options: [{ label: 'A', value: 'Letter M' }, { label: 'B', value: 'Eclipses' }, { label: 'C', value: 'Blinks' }, { label: 'D', value: 'Thoughts' }], correctAnswer: 'Letter M', category: 'problem-solving' },
    { questionText: 'How many months have 28 days?', options: [{ label: 'A', value: '1' }, { label: 'B', value: '2' }, { label: 'C', value: '6' }, { label: 'D', value: '12' }], correctAnswer: '12', category: 'problem-solving' },
    { questionText: 'Which wheel of a car does not turn during a right turn?', options: [{ label: 'A', value: 'Front right' }, { label: 'B', value: 'Back right' }, { label: 'C', value: 'Spare wheel' }, { label: 'D', value: 'Front left' }], correctAnswer: 'Spare wheel', category: 'problem-solving' },
    { questionText: 'You see a boat filled with people. It has not sunk, but when you look again you don\'t see a single person. Why?', options: [{ label: 'A', value: 'They jumped' }, { label: 'B', value: 'They\'re all married' }, { label: 'C', value: 'It submerged' }, { label: 'D', value: 'They\'re hiding' }], correctAnswer: 'They\'re all married', category: 'problem-solving' },
    { questionText: 'What belongs to you but others use it more than you do?', options: [{ label: 'A', value: 'Your house' }, { label: 'B', value: 'Your name' }, { label: 'C', value: 'Your shoes' }, { label: 'D', value: 'Your phone' }], correctAnswer: 'Your name', category: 'problem-solving' },
    // Advanced problem expansion
    { questionText: 'A train is 100m long, driving 100m/s. How long to clear a 100m tunnel?', options: [{ label: 'A', value: '1 second' }, { label: 'B', value: '2 seconds' }, { label: 'C', value: '1.5 seconds' }, { label: 'D', value: '3 seconds' }], correctAnswer: '2 seconds', category: 'problem-solving' },
    { questionText: 'You have one match in a dark room with an oil heater, a candle, and a lamp. What do you light first?', options: [{ label: 'A', value: 'Match' }, { label: 'B', value: 'Candle' }, { label: 'C', value: 'Lamp' }, { label: 'D', value: 'Heater' }], correctAnswer: 'Match', category: 'problem-solving' },
    { questionText: 'I have 6 eggs. I broke two, cooked two, and ate two. How many are left?', options: [{ label: 'A', value: '0' }, { label: 'B', value: '2' }, { label: 'C', value: '4' }, { label: 'D', value: '6' }], correctAnswer: '4', category: 'problem-solving' },
    { questionText: 'How many times can you subtract 10 from 100?', options: [{ label: 'A', value: '1' }, { label: 'B', value: '10' }, { label: 'C', value: '9' }, { label: 'D', value: '0' }], correctAnswer: '1', category: 'problem-solving' },
    { questionText: 'If there are exactly 3 apples, and you take away 2, how many do you have?', options: [{ label: 'A', value: '1' }, { label: 'B', value: '2' }, { label: 'C', value: '3' }, { label: 'D', value: '0' }], correctAnswer: '2', category: 'problem-solving' },
    // Super expansion Problem Solving
    { questionText: 'A man walked in the rain without an umbrella or hat, but not a single hair got wet. Why?', options: [{ label: 'A', value: 'Indoors' }, { label: 'B', value: 'Bald' }, { label: 'C', value: 'Fast' }, { label: 'D', value: 'Dodged' }], correctAnswer: 'Bald', category: 'problem-solving' },
    { questionText: 'How many letters are in the alphabet?', options: [{ label: 'A', value: '26' }, { label: 'B', value: '24' }, { label: 'C', value: '11' }, { label: 'D', value: '8' }], correctAnswer: '11', category: 'problem-solving' },
    { questionText: 'If an electric train is traveling south, which way is the smoke blowing?', options: [{ label: 'A', value: 'North' }, { label: 'B', value: 'South' }, { label: 'C', value: 'East' }, { label: 'D', value: 'No smoke' }], correctAnswer: 'No smoke', category: 'problem-solving' },
    { questionText: 'Can a man legally marry his widow\'s sister?', options: [{ label: 'A', value: 'Yes' }, { label: 'B', value: 'No, he is dead' }, { label: 'C', value: 'Depends' }, { label: 'D', value: 'If not related' }], correctAnswer: 'No, he is dead', category: 'problem-solving' },
    { questionText: 'You draw a line. Without touching it, how do you make the line shorter?', options: [{ label: 'A', value: 'Erase it' }, { label: 'B', value: 'Draw a longer line next to it' }, { label: 'C', value: 'Cover part of it' }, { label: 'D', value: 'Impossible' }], correctAnswer: 'Draw a longer line next to it', category: 'problem-solving' },
    { questionText: 'What month of the year has 28 days?', options: [{ label: 'A', value: 'February exclusively' }, { label: 'B', value: 'None' }, { label: 'C', value: 'All of them' }, { label: 'D', value: 'Leap years only' }], correctAnswer: 'All of them', category: 'problem-solving' },
    { questionText: 'If a rooster lays an egg on a roof, which way will it roll?', options: [{ label: 'A', value: 'Down' }, { label: 'B', value: 'Left' }, { label: 'C', value: 'Right' }, { label: 'D', value: 'Roosters don\'t lay eggs' }], correctAnswer: 'Roosters don\'t lay eggs', category: 'problem-solving' },
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

function generateQuestions(challengeId: number): Question[] {
    const allQuestions = [...MATH_QUESTIONS, ...LOGIC_QUESTIONS, ...PROBLEM_SOLVING_QUESTIONS];
    const shuffled = seededShuffle(allQuestions, challengeId * 7919);
    return shuffled.slice(0, 20).map((q, idx) => ({ ...q, id: idx + 1 }));
}

/* ─── Category badge colors ─────────────────────────────────────── */
const categoryStyleMap: Record<string, { bg: string; text: string; emoji: string; key: string }> = {
    'math': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', emoji: '🔢', key: 'brain_training_math' },
    'logic': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', emoji: '🧩', key: 'brain_training_logic' },
    'problem-solving': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', emoji: '💡', key: 'brain_training_problem_solving' },
};

/* ─── Component ─────────────────────────────────────────────────── */
export default function BrainChallengeGameScreen() {
    const navigate = useNavigate();
    const { challengeId } = useParams<{ challengeId: string }>();
    const cId = Number(challengeId) || 1;
    const { t, language } = useLanguage();

    const languageNames: Record<string, string> = { en: 'English', fr: 'French', ar: 'Arabic' };
    const promptLang = languageNames[language] || 'English';

    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    useEffect(() => {
        let isMounted = true;
        const fetchQuestions = async () => {
            setIsLoading(true);
            try {
                const prompt = `Generate 5 brain training challenges for a kids learning app. Focus heavily on engaging math problems, while including some logic and problem-solving puzzles. 
The questions, answers, and options MUST be written in ${promptLang}.
Format as a valid JSON array exactly matching this structure:
[
  {
    "questionText": "What comes next in the sequence 2, 4, 6, 8, ...?",
    "imagePrompt": "A short descriptive prompt for an AI image generator to create a colorful, kid-friendly illustration related to this puzzle",
    "options": [
      { "label": "A", "value": "10" },
      { "label": "B", "value": "12" },
      { "label": "C", "value": "14" },
      { "label": "D", "value": "9" }
    ],
    "correctAnswer": "10",
    "category": "math"
  }
]`;
                const generated = await api.generateQuizFromAI(prompt);
                
                if (!isMounted) return;

                // Map to ensure it strictly follows our Question interface based on prompt
                // Handle different possible AI output formats
                const mappedQuestions = generated.map((q: any, i: number) => {
                    let formattedOptions = [];
                    if (q.options && q.options[0] && typeof q.options[0] === 'object' && q.options[0].label) {
                        formattedOptions = q.options;
                    } else if (Array.isArray(q.options)) {
                        formattedOptions = q.options.map((o: string, idx: number) => ({ label: ['A','B','C','D'][idx] || 'A', value: String(o) }));
                    }

                    return {
                        id: i + 1,
                        questionText: q.questionText || q.question || "Unknown question",
                        options: formattedOptions,
                        correctAnswer: String(q.correctAnswer || q.answer || ""),
                        category: ['math', 'logic', 'problem-solving'].includes(q.category) ? q.category : 'logic',
                        imageUrl: q.imagePrompt ? `https://image.pollinations.ai/prompt/${encodeURIComponent(q.imagePrompt + ' colorful 3d kids illustration, cute, bright colors')}` : undefined
                    };
                });

                if (mappedQuestions.length > 0) {
                    setQuestions(mappedQuestions);
                } else {
                    setQuestions(generateQuestions(cId).slice(0, 5));
                }
            } catch (err) {
                console.error("AI generation failed or timed out:", err);
                if (isMounted) setQuestions(generateQuestions(cId).slice(0, 5));
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchQuestions();
        return () => { isMounted = false; };
    }, [cId]);

    const selectAnswer = useCallback(
        (questionId: number, value: string) => {
            setAnswers((prev) => ({ ...prev, [questionId]: value }));
        },
        []
    );

    const goTo = (idx: number) => {
        if (idx >= 0 && idx < questions.length) setCurrentIndex(idx);
    };

    if (isLoading || questions.length === 0) {
        return (
            <div className="h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 transition-colors duration-300">
                <div className="w-24 h-24 border-4 border-[#e8f0fe] border-t-violet-500 rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('consulting_ai' as any) || 'Consulting AI...'}</h2>
            </div>
        );
    }

    const current = questions[currentIndex];
    const totalQuestions = questions.length;
    // Safely get category styles or default to logic if mapping fails
    const cat = categoryStyleMap[current.category] || categoryStyleMap['logic'];

    return (
        <div className="h-screen flex bg-white dark:bg-slate-900 font-sans overflow-hidden">
            {/* ── Left sidebar: question navigator ────────────────────── */}
            <aside className="w-44 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col overflow-hidden">
                <h2 className="px-4 py-4 text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    {t('brain_training_questions')}
                </h2>
                <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin">
                    {questions.map((q, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                            <button
                                key={q.id}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all text-sm ${isActive
                                    ? 'bg-violet-100 dark:bg-violet-900/40 border-2 border-violet-400 dark:border-violet-500'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-transparent'
                                    }`}
                            >
                                <span className={`font-black text-xs w-5 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {q.id}
                                </span>
                                <div className="flex gap-1">
                                    {q.options.map((opt) => {
                                        const isSelected = answers[q.id] === opt.value;
                                        return (
                                            <span
                                                key={opt.label}
                                                className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors ${isSelected
                                                    ? 'bg-violet-500 text-white'
                                                    : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                                                    }`}
                                            >
                                                {opt.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* ── Main content ────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-900">
                    <button
                        onClick={() => navigate('/brain-training')}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors text-sm font-bold"
                    >
                        <ChevronLeft className="w-5 h-5 inline -mt-0.5" /> {t('brain_training_back')}
                    </button>
                    <h1 className="text-lg font-black text-slate-800 dark:text-white">
                        {t('brain_training_challenges')} {cId}
                    </h1>
                    <div className="w-16" />
                </div>

                {/* Question area */}
                <div className="flex-1 overflow-y-auto px-6 md:px-16 lg:px-28 py-8 flex flex-col items-center">
                    {/* Category badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${cat.bg} ${cat.text} text-xs font-black uppercase tracking-wider mb-6`}>
                        {cat.emoji} {t(cat.key as any)}
                    </div>

                    {/* Question visual / text */}
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

                    {/* Answer options */}
                    <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-4">
                        {current.options.map((opt) => {
                            const isSelected = answers[current.id] === opt.value;
                            return (
                                <button
                                    key={opt.label}
                                    onClick={() => selectAnswer(current.id, opt.value)}
                                    className={`relative rounded-2xl p-5 text-center transition-all border-2 ${isSelected
                                        ? 'bg-violet-100 dark:bg-violet-900/30 border-violet-400 dark:border-violet-500 shadow-lg shadow-violet-200/50 dark:shadow-violet-900/30 scale-[1.02]'
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md'
                                        }`}
                                >
                                    <span className={`absolute top-3 left-4 text-xs font-bold ${isSelected ? 'text-violet-500 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'
                                        }`}>
                                        {opt.label}
                                    </span>
                                    <span className={`text-lg md:text-xl font-black block mt-2 break-words leading-tight ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-slate-700 dark:text-slate-200'
                                        }`}>
                                        {opt.value}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom navigation */}
                <div className="px-6 md:px-16 lg:px-28 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        <div className="flex gap-3">
                            <button
                                onClick={() => goTo(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-violet-200 dark:hover:bg-violet-800/40 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                {t('brain_training_previous')}
                            </button>
                            <button
                                onClick={() => goTo(currentIndex + 1)}
                                disabled={currentIndex === totalQuestions - 1}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-violet-200 dark:hover:bg-violet-800/40 transition-colors"
                            >
                                {t('next')}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                try {
                                    const stored = localStorage.getItem('completedBrainChallenges');
                                    const completed = stored ? JSON.parse(stored) : [];
                                    if (!completed.includes(cId)) {
                                        localStorage.setItem('completedBrainChallenges', JSON.stringify([...completed, cId]));
                                    }
                                } catch (e) {}

                                const nextId = cId + 1;
                                setCurrentIndex(0);
                                setAnswers({});
                                navigate(`/brain-training/${nextId}`);
                            }}
                            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-colors shadow-md"
                        >
                            {t('brain_training_next_challenge')}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="max-w-3xl mx-auto mt-3">
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">
                            {currentIndex + 1}/{totalQuestions}
                        </p>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-violet-500 rounded-full transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
