import fs from 'fs';

const content = fs.readFileSync('constants.ts', 'utf8');
const lines = content.split('\n');
const newLines = [];

let i = 0;
while (i < lines.length) {
  // Check if this line is the start of a bad chapter
  // It usually looks like `      {` and the next line is `      id: '..._advanced',`
  if (lines[i].includes('{') && lines[i+1] && lines[i+1].includes('_advanced\',') && lines[i+2] && lines[i+2].includes('_advanced_title\',')) {
    // Check ahead to see if it's the bad placeholder
    let isBad = false;
    for (let j = 1; j < 15; j++) {
      if (lines[i+j] && lines[i+j].includes('// Advanced logic')) {
        isBad = true;
        break;
      }
    }

    if (isBad) {
      // Skip this entire block. Count braces to find the end.
      let openBraces = 0;
      let closedBraces = 0;
      let j = i;
      while (j < lines.length) {
        openBraces += (lines[j].match(/\{/g) || []).length;
        closedBraces += (lines[j].match(/\}/g) || []).length;
        j++;
        if (openBraces > 0 && openBraces === closedBraces) {
          // Check if there is a trailing comma on the closing brace line
          if (lines[j-1].trim().endsWith(',')) {
            // all good
          }
          break;
        }
      }
      i = j; // skip to the end of the block
      continue;
    }
  }

  newLines.push(lines[i]);
  i++;
}

// Now add Masterclass
let finalLines = [];
let lastLevel = 250;
let currentPath = null;
let inLessonsByPath = false;

for (let j = 0; j < newLines.length; j++) {
  const line = newLines[j];
  if (line.includes('export const LESSONS_BY_PATH:')) {
    inLessonsByPath = true;
  }
  if (inLessonsByPath && line.startsWith('export const BADGES_BY_PATH:')) {
    inLessonsByPath = false;
  }

  if (inLessonsByPath) {
    const pathMatch = line.match(/^  ([a-zA-Z0-9_+'"{}]+):\s*\[/);
    if (pathMatch && !line.includes('//')) {
      let extractedPath = pathMatch[1].replace(/['"]/g, '');
      currentPath = extractedPath;
    }

    if (line.match(/^  \],/) && currentPath) {
      lastLevel++;
      let pathId = currentPath;
      if (pathId === 'c++') pathId = 'cpp';
      if (pathId === 'c_sharp') pathId = 'csharp';

      const masterclassChapter = `    {
      id: '${currentPath}_masterclass',
      titleKey: '${pathId}_masterclass_title',
      lessons: [
        { id: 1, level: ${lastLevel}, titleKey: '${pathId}_master_lesson_1', icon: 'brain', xp: 50, color: '#ff4757', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '${pathId}_master_chal_1', starterCode: '// Masterclass\\n', solutionCode: '// Solution', expectedOutput: 'Master' },
        { id: 1, level: ${lastLevel + 1}, titleKey: '${pathId}_master_lesson_2', icon: 'trophy', xp: 100, color: '#ff4757', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '${pathId}_master_chal_2', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    },`;
      finalLines.push(masterclassChapter);
      lastLevel++;
      currentPath = null;
    }
  }

  finalLines.push(line);
}

fs.writeFileSync('constants.ts', finalLines.join('\n'));
console.log('Done cleaning and appending masterclasses.');
