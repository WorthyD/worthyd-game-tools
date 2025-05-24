const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

console.log('Tailwind config for craft-cart', createGlobPatternsForDependencies(__dirname));
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    extend: {}
  },
  plugins: []
};
