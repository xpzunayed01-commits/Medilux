const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  "allow read, write: if isAdmin();",
  "allow create: if true;\n      allow read, update, delete: if isAdmin();"
);
fs.writeFileSync('firestore.rules', rules);
