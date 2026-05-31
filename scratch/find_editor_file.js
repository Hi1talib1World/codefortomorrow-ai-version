import fs from 'fs';
import path from 'path';

const searchDir = 'C:/Users/hicha/Documents/GitHub/codefortomorrow-ai-version';

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist') && !file.includes('scratch') && !file.includes('.claude')) {
            walk(file, (err, res) => {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            if (!--pending) done(null, results);
          }
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk(searchDir, (err, files) => {
  if (err) throw err;
  const matches = [];
  files.forEach(file => {
    const base = path.basename(file);
    if ((file.endsWith('.tsx') || file.endsWith('.jsx')) && !base.includes('constants') && !base.includes('types')) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('initialTemplate') || content.includes('code') && content.includes('cpp')) {
        matches.push(file);
      }
    }
  });

  console.log('Matches:', matches);
});
