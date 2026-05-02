import fs from 'fs';

let content = fs.readFileSync('contexts/LanguageContext.tsx', 'utf8');

const paths = [
  { id: 'block_coding', name: 'Block Coding' },
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'lua', name: 'Lua' },
  { id: 'web_dev', name: 'Web Dev' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'java', name: 'Java' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'swift', name: 'Swift' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'sql', name: 'SQL' },
  { id: 'r', name: 'R' },
  { id: 'dart', name: 'Dart' },
  { id: 'scala', name: 'Scala' },
  { id: 'math', name: 'Math' }
];

const langs = ['en', 'fr', 'ar'];

const getTranslations = (lang, pathId, pathName) => {
  if (lang === 'en') {
    return `    ${pathId}_masterclass_title: 'Masterclass ${pathName}',
    ${pathId}_master_lesson_1: '${pathName} Masterclass Concepts',
    ${pathId}_master_lesson_2: '${pathName} Final Mastery Project',
    ${pathId}_master_chal_1: 'Complete this masterclass challenge for ${pathName}.',
    ${pathId}_master_chal_2: 'Test your ultimate ${pathName} knowledge.',\n`;
  } else if (lang === 'fr') {
    return `    ${pathId}_masterclass_title: 'Masterclass ${pathName}',
    ${pathId}_master_lesson_1: 'Concepts Masterclass ${pathName}',
    ${pathId}_master_lesson_2: 'Projet Final de Maîtrise ${pathName}',
    ${pathId}_master_chal_1: 'Complétez ce défi masterclass pour ${pathName}.',
    ${pathId}_master_chal_2: 'Testez vos connaissances ultimes en ${pathName}.',\n`;
  } else if (lang === 'ar') {
    return `    ${pathId}_masterclass_title: 'ماستر كلاس ${pathName}',
    ${pathId}_master_lesson_1: 'مفاهيم ماستر كلاس ${pathName}',
    ${pathId}_master_lesson_2: 'المشروع النهائي لاتقان ${pathName}',
    ${pathId}_master_chal_1: 'أكمل هذا التحدي المتقدم لـ ${pathName}.',
    ${pathId}_master_chal_2: 'اختبر معرفتك القصوى في ${pathName}.',\n`;
  }
};

langs.forEach(lang => {
  let toInsert = '';
  paths.forEach(path => {
    toInsert += getTranslations(lang, path.id, path.name);
  });
  
  // Find the start of the language object, e.g. `  en: {\n`
  const regex = new RegExp(`  ${lang}: \\{\\n`);
  content = content.replace(regex, `  ${lang}: {\n` + toInsert);
});

fs.writeFileSync('contexts/LanguageContext.tsx', content);
console.log('LanguageContext.tsx updated');
