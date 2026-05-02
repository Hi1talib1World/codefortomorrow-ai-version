import fs from 'fs';

let content = fs.readFileSync('constants.ts', 'utf8');

// 1. Remove the placeholder advanced chapters exactly
const exactBadChapterRegex = /[\ \t]*\{\s*id:\s*'[^']+_advanced',\s*titleKey:\s*'[^']+_advanced_title',\s*lessons:\s*\[\s*\{\s*id:\s*1,\s*level:\s*\d+,\s*titleKey:\s*'[^']+_adv_lesson_1',\s*icon:\s*'brain',\s*xp:\s*30,\s*color:\s*'#6366f1',\s*type:\s*'lesson',\s*nodeType:\s*'standard',\s*challengeDescriptionKey:\s*'[^']+_adv_chal_1',\s*starterCode:\s*'\/\/\s*Advanced\s*logic\\n',\s*solutionCode:\s*'\/\/\s*Advanced\s*solution',\s*expectedOutput:\s*'Done'\s*\},\s*\{\s*id:\s*1,\s*level:\s*\d+,\s*titleKey:\s*'[^']+_adv_lesson_2',\s*icon:\s*'star',\s*xp:\s*50,\s*color:\s*'#6366f1',\s*type:\s*(?:'quiz'|'project'),\s*nodeType:\s*'quiz',\s*challengeDescriptionKey:\s*'[^']+_adv_chal_2',\s*starterCode:\s*'',\s*solutionCode:\s*'',\s*expectedOutput:\s*''\s*\},?\s*\]\s*\},?\s*/g;

let initialLen = content.length;
content = content.replace(exactBadChapterRegex, '\n');
console.log('Removed bytes: ', initialLen - content.length);

const paths = [
  'block_coding', 'python', 'javascript', 'lua', 'web_dev', 'c++', 'c_sharp', 'java', 'kotlin', 'swift', 'go', 'rust', 'php', 'ruby', 'typescript', 'sql', 'r', 'dart', 'scala', 'math'
];

let lastLevel = 250; 

// Append masterclass to each path
paths.forEach(path => {
  // We look for the end of the lessons array for each path:
  // We can do this by splitting the string at `\n  ],\n  <next_path>: [\n` or similar.
  // Actually, a safer way is: we know each path ends with `      ],\n    },\n  ],\n`
  // Wait, let's find `export const LESSONS_BY_PATH` to `export const BADGES_BY_PATH`.
  // We can do this with replace string:
});

fs.writeFileSync('constants.ts', content);
