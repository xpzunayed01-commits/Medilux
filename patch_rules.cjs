const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  "return request.auth != null && exists(/databases/$(database)/documents/admins/$(request.auth.uid));",
  "return request.auth != null && (exists(/databases/$(database)/documents/admins/$(request.auth.uid)) || request.auth.token.email == 'xpzunayed01@gmail.com');"
);
fs.writeFileSync('firestore.rules', rules);
