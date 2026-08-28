const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

code = code.replace(
  'className="group relative bg-white rounded-2xl p-2 sm:p-2.5 border border-black/[0.04] hover:border-black/10 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between h-full"',
  'className="group relative flex flex-col h-full bg-transparent"'
);

code = code.replace(
  'className="relative aspect-[4/5] bg-[#F7F6F2] rounded-xl overflow-hidden mb-2.5"',
  'className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-4"'
);

// We can also remove the "rounded-xl" from the button if it's there, but let's just leave the main container minimal
fs.writeFileSync('src/components/ProductCard.tsx', code);
console.log("Patched ProductCard");
