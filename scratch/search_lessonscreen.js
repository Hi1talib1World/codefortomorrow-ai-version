import fs from 'fs';

const filePath = 'C:/Users/hicha/Documents/GitHub/codefortomorrow-ai-version/components/LessonScreen/index.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('Searching for useState hooks or template keywords...');
lines.forEach((line, i) => {
  if (line.includes('useState') && (line.includes('code') || line.includes('Code') || line.includes('Template') || line.includes('template') || line.includes('content') || line.includes('content'))) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
  if (line.includes('initialTemplate') || line.includes('initialCode') || line.includes('initialValue')) {
    console.log(`Line ${i + 1} (template ref): ${line.trim()}`);
  }
});
