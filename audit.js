const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) { 
        if(!file.includes('node_modules') && !file.includes('.git') && !file.includes('.expo')) {
          results = results.concat(walk(file));
        }
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) { 
        results.push(file);
      }
    });
  } catch(e) {}
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let changedFiles = 0;

files.forEach(f => {
  let original = fs.readFileSync(f, 'utf8');
  let content = original;

  // Replace text-slate-300 and text-slate-400 with text-slate-500
  content = content.replace(/text-slate-300/g, 'text-slate-500');
  content = content.replace(/text-slate-400/g, 'text-slate-500');
  
  // Replace direct hex instances of slate-400 and slate-300 in inline styles
  content = content.replace(/['"]#94a3b8['"]/gi, "'#64748b'");
  content = content.replace(/['"]#cbd5e1['"]/gi, "'#64748b'");

  // Bump all microscopic text to text-xs (12px)
  content = content.replace(/text-\[8px\]/g, 'text-xs');
  content = content.replace(/text-\[9px\]/g, 'text-xs');
  content = content.replace(/text-\[10px\]/g, 'text-xs');
  content = content.replace(/text-\[11px\]/g, 'text-xs');

  // Bump inline font-sizes below 12
  content = content.replace(/fontSize:\s*11\b/g, 'fontSize: 12');
  content = content.replace(/fontSize:\s*10\b/g, 'fontSize: 12');
  content = content.replace(/fontSize:\s*9\b/g, 'fontSize: 12');
  content = content.replace(/fontSize:\s*8\b/g, 'fontSize: 12');

  // Enforce body text text-sm minimum 14px and leading-[22px]
  content = content.replace(/text-sm\b(?!\s*leading-)/g, 'text-sm leading-[22px]');
  content = content.replace(/text-\[13px\]/g, 'text-sm leading-[22px]');
  content = content.replace(/fontSize:\s*13\b/g, 'fontSize: 14');

  if (content !== original) {
    fs.writeFileSync(f, content);
    changedFiles++;
    console.log("Updated", f);
  }
});

console.log('Modified files:', changedFiles);
