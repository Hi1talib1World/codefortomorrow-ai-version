import fs from 'fs';

const content = fs.readFileSync('constants.ts', 'utf8');
const lines = content.split('\n');
const newLines = [];

let inLessonsByPath = false;
let currentPath = null;
let skipLines = 0;
let lastLevel = 200;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('export const LESSONS_BY_PATH:')) {
    inLessonsByPath = true;
    newLines.push(line);
    continue;
  }

  if (inLessonsByPath && line.startsWith('export const BADGES_BY_PATH:')) {
    inLessonsByPath = false;
  }

  if (inLessonsByPath && skipLines === 0) {
    // Check for path start
    const pathMatch = line.match(/^  ([a-zA-Z0-9_+'"{}]+):\s*\[/);
    if (pathMatch && !line.includes('//')) {
      let extractedPath = pathMatch[1].replace(/['"]/g, '');
      if (extractedPath === 'c++') extractedPath = 'cpp';
      if (extractedPath === 'c_sharp') extractedPath = 'csharp';
      currentPath = extractedPath;
    }

    // Check for bad advanced chapter start
    if (line.includes("_advanced'") && lines[i+1] && lines[i+1].includes("_advanced_title'")) {
      // It's the bad chapter. Let's see if it has 'Advanced logic' down a few lines
      let isBad = false;
      for(let j=1; j<10; j++) {
        if(lines[i+j] && lines[i+j].includes('// Advanced logic')) {
          isBad = true;
          break;
        }
      }
      if (isBad) {
        // Find the end of this chapter object
        let openBraces = 0;
        let closedBraces = 0;
        for (let j = i; j < lines.length; j++) {
           openBraces += (lines[j].match(/\{/g) || []).length;
           closedBraces += (lines[j].match(/\}/g) || []).length;
           if (openBraces > 0 && openBraces === closedBraces) {
              // we found the end
              skipLines = j - i + 1;
              break;
           }
        }
        if (skipLines > 0) continue;
      }
    }

    // Check for end of path array
    if (line.match(/^  \],/) && currentPath) {
      // Append masterclass here
      lastLevel++;
      
      // If original path had quotes, we don't need them for ID but let's use currentPath
      let pathId = currentPath;
      if (pathId === 'cpp') pathId = 'c++';
      if (pathId === 'csharp') pathId = 'c_sharp';
      
      const masterclassChapter = `    {
      id: '${pathId}_masterclass',
      titleKey: '${pathId}_masterclass_title',
      lessons: [
        { id: 1, level: ${lastLevel}, titleKey: '${pathId}_master_lesson_1', icon: 'brain', xp: 50, color: '#ff4757', type: 'lesson', nodeType: 'standard', challengeDescriptionKey: '${pathId}_master_chal_1', starterCode: '// Enter masterclass code here\\n', solutionCode: '// Solution', expectedOutput: 'Master' },
        { id: 1, level: ${lastLevel + 1}, titleKey: '${pathId}_master_lesson_2', icon: 'trophy', xp: 100, color: '#ff4757', type: 'project', nodeType: 'trophy', challengeDescriptionKey: '${pathId}_master_chal_2', starterCode: '', solutionCode: '', expectedOutput: '' },
      ],
    },`;
      newLines.push(masterclassChapter);
      lastLevel++;
      currentPath = null;
    }
  }

  if (skipLines > 0) {
    skipLines--;
    continue;
  }

  newLines.push(line);
}

fs.writeFileSync('constants.ts', newLines.join('\n'));
console.log('constants.ts updated successfully with line-by-line logic.');
