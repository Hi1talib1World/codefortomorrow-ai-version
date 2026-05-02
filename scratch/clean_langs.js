import fs from 'fs';

let content = fs.readFileSync('contexts/LanguageContext.tsx', 'utf8');

// The bad block for `en` starts with `math_advanced_title: 'Advanced Math',` and ends with `block_coding_adv_chal_2: 'Test your Block Coding knowledge',`
// We can use a regex to match from `[\s]*math_advanced_title:` to `block_coding_adv_chal_2: '[^']+',\n`
const regexEn = /[\ \t]*math_advanced_title:\s*'Advanced Math',[\s\S]*?block_coding_adv_chal_2:\s*'Test your Block Coding knowledge',\n/g;
const regexFr = /[\ \t]*math_advanced_title:\s*'Math Avancé',[\s\S]*?block_coding_adv_chal_2:\s*'Testez vos connaissances en Block Coding',\n/g;
const regexAr = /[\ \t]*math_advanced_title:\s*'ماث متقدم',[\s\S]*?block_coding_adv_chal_2:\s*'اختبر معرفتك في Block Coding',\n/g;

content = content.replace(regexEn, '');
content = content.replace(regexFr, '');
content = content.replace(regexAr, '');

fs.writeFileSync('contexts/LanguageContext.tsx', content);
console.log('LanguageContext.tsx cleaned');
