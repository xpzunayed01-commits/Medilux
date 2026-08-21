const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<img')) {
    // replace <img with <img referrerPolicy="no-referrer"
    // carefully avoiding if it's already there
    content = content.replace(/<img(?!\s+referrerPolicy="no-referrer")/g, '<img referrerPolicy="no-referrer"');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
