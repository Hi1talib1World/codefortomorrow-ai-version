import fs from 'fs';

let content = fs.readFileSync('contexts/LanguageContext.tsx', 'utf8');

const regexAr = /[\ \t]*math_advanced_title:\s*'Math متقدم',[\s\S]*?block_coding_adv_chal_2:\s*'اختبر معلوماتك في Block Coding',\n/g;

content = content.replace(regexAr, '');

fs.writeFileSync('contexts/LanguageContext.tsx', content);
console.log('LanguageContext.tsx cleaned for Arabic');
