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
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let updatedCount = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (content.includes('toLocaleString()')) {
    content = content.replace(/toLocaleString\(\)/g, "toLocaleString('en-IN')");
    changed = true;
  }
  
  if (content.includes('Rs.')) {
    content = content.replace(/Rs\.\s*/g, "₹");
    changed = true;
  }

  if (content.match(/\$([0-9])/)) {
    content = content.replace(/\$([0-9])/g, "₹$1");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, content);
    updatedCount++;
    console.log(`Updated ${f}`);
  }
});

console.log(`Total files updated: ${updatedCount}`);
