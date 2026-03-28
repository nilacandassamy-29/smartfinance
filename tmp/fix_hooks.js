const fs = require('fs');
const path = require('path');
const dir = path.join('d:', 'smartfinance', 'src', 'screens', 'onboarding');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let changed = false;

  // Search for the hooks block outside the component
  // Example:
  //  const { theme, isDarkMode } = useTheme();
  //  const { width } = Dimensions.get('window');
  //  const Step...
  
  // Use a targeted regex that looks for these declarations
  const themeRegex = /^[ \t]*const\s+\{\s*theme,\s*isDarkMode\s*\}\s*=\s*useTheme\(\);\s*\n?/m;
  const widthRegex = /^[ \t]*const\s+\{\s*width\s*\}\s*=\s*Dimensions\.get\('window'\);\s*\n?/m;

  // check if one of these matches AND it is before the component body.
  const compRegex = /const\s+Step\d+_[A-Za-z]+\s*=\s*\([^)]*\)\s*=>\s*\{/;
  
  if (compRegex.test(content) && (themeRegex.test(content) || widthRegex.test(content))) {
      // split around comp
      const parts = content.split(compRegex);
      if (parts.length === 2 || parts.length === 3) {
          let before = parts[0];
          let compMatch = content.match(compRegex)[0];
          let after = parts[parts.length - 1]; // what comes after
          
          let hasTheme = themeRegex.test(before);
          let hasWidth = widthRegex.test(before);
          
          if (hasTheme || hasWidth) {
              if (hasTheme) before = before.replace(themeRegex, '');
              if (hasWidth) before = before.replace(widthRegex, '');
              
              let newInjections = '\n';
              if (hasTheme) newInjections += '  const { theme, isDarkMode } = useTheme();\n';
              if (hasWidth) newInjections += '  const { width } = Dimensions.get(\'window\');\n';
              
              // assemble
              const newContent = before + compMatch + newInjections + after;
              fs.writeFileSync(filePath, newContent, 'utf8');
              console.log('Fixed:', file);
          }
      }
  }
});
console.log('Operation complete.');
