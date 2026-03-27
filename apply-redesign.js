const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const fontReplacements = [
  // Outfit / Inter / boundary cases
  { search: /\bfont-(outfit|inter|grenze|cinzel)-black\b/g, replace: 'font-times font-bold' },
  { search: /\bfont-(outfit|inter|grenze|cinzel)-bold\b/g, replace: 'font-times font-bold' },
  { search: /\bfont-(outfit|inter|grenze|cinzel)-semibold\b/g, replace: 'font-times font-semibold' },
  { search: /\bfont-(outfit|inter|grenze|cinzel)-regular\b/g, replace: 'font-times' },
  { search: /\bfont-(outfit|inter|grenze|cinzel)\b/g, replace: 'font-times' },
  // Inline Font families (from previous mappings)
  { search: /fontFamily: 'Outfit-[A-Za-z]+'/g, replace: "fontFamily: 'times'" },
  { search: /fontFamily: 'Inter-[A-Za-z]+'/g, replace: "fontFamily: 'times'" },
  // Remove italic styling strictly
  { search: /\bitalic\b/g, replace: '' },
  // Double spaces cleanup inside classes (from deleting italic)
  { search: /  +/g, replace: ' ' }
];

function processDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Apply font replacements
      fontReplacements.forEach(r => {
         content = content.replace(r.search, r.replace);
      });

      // Handle SafeAreaView migration
      if (content.includes('SafeAreaView') && !content.includes('react-native-safe-area-context')) {
         // Remove from react-native
         content = content.replace(/,\s*SafeAreaView\b/g, '');
         content = content.replace(/\bSafeAreaView\s*,/g, '');
         content = content.replace(/\{\s*SafeAreaView\s*\}/g, '{}');
         
         // Add to top of file
         const importStatement = "import { SafeAreaView } from 'react-native-safe-area-context';\n";
         
         // Find first import and insert after it
         const importMatch = content.match(/import\s+.*?;/);
         if (importMatch) {
            content = content.replace(importMatch[0], importMatch[0] + '\n' + importStatement);
         } else {
            content = importStatement + content;
         }
      }

      if (originalContent !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Redesign enhancements applied!');
