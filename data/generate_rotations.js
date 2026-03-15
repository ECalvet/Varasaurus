const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'rotations.rot');
const outputFile = path.join(__dirname, 'rotations.js');

const lines = fs.readFileSync(inputFile, 'utf-8').split(/\r?\n/);

const rotations = {};

lines.forEach(line => {
  line = line.trim();
  if (!line || line.startsWith('!')) return; // ignorer lignes vides ou commentaires

  // Séparer la ligne par espaces multiples
  const parts = line.split(/\s+/);
  if (parts.length < 5) return; // sécurité

  const plate_id = parts[0];
  const age = parseFloat(parts[1]);
  const rot_x = parseFloat(parts[2]);
  const rot_y = parseFloat(parts[3]);
  const rot_z = parseFloat(parts[4]);

  if (!rotations[plate_id]) rotations[plate_id] = [];
  rotations[plate_id].push({ age, euler: [rot_x, rot_y, rot_z] });
});

// Générer le contenu JS
let jsContent = 'const rotations = {\n';
for (const [plate, arr] of Object.entries(rotations)) {
  jsContent += `  ${plate}: [\n`;
  arr.forEach(r => {
    jsContent += `    { age: ${r.age}, euler: [${r.euler.join(', ')}] },\n`;
  });
  jsContent += '  ],\n';
}
jsContent += '};\n\n';

// Optionnel : ajouter la fonction getRotationAtAge
jsContent += `function getRotationAtAge(rotArray, age) {
  for (let i = 0; i < rotArray.length - 1; i++) {
    if (age >= rotArray[i].age && age <= rotArray[i + 1].age) {
      const t = (age - rotArray[i].age) / (rotArray[i + 1].age - rotArray[i].age);
      return rotArray[i].euler.map((v, idx) => v + t * (rotArray[i + 1].euler[idx] - v));
    }
  }
  return rotArray[rotArray.length - 1].euler;
}
`;

// Écrire dans rotations.js
fs.writeFileSync(outputFile, jsContent, 'utf-8');

console.log('rotations.js généré avec succès !');
