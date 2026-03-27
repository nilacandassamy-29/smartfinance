const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { search: /font-grenze-bold/g, replace: 'font-outfit-bold' },
  { search: /font-grenze-semibold/g, replace: 'font-outfit-semibold' },
  { search: /font-grenze-black/g, replace: 'font-outfit-bold' },
  { search: /font-grenze/g, replace: 'font-outfit' },
  { search: /font-cinzel-bold/g, replace: 'font-inter-bold' },
  { search: /font-cinzel-semibold/g, replace: 'font-inter-semibold' },
  { search: /font-cinzel-black/g, replace: 'font-inter-bold' },
  { search: /font-cinzel-regular/g, replace: 'font-inter' },
  { search: /font-cinzel/g, replace: 'font-inter' },
  { search: /'GrenzeGotisch-Bold'/g, replace: "'Outfit-Bold'" },
  { search: /'GrenzeGotisch-SemiBold'/g, replace: "'Outfit-SemiBold'" },
  { search: /'GrenzeGotisch-Regular'/g, replace: "'Outfit-Regular'" },
  { search: /'Cinzel-Bold'/g, replace: "'Inter-Bold'" },
  { search: /'Cinzel-SemiBold'/g, replace: "'Inter-SemiBold'" },
  { search: /'Cinzel-Regular'/g, replace: "'Inter-Regular'" }
];

function processDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = content;
      replacements.forEach(r => {
         updated = updated.replace(r.search, r.replace);
      });
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Font replacement complete!');
