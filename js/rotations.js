const rotations = {
  83330: [
    { age: 0.0, euler: [90.0, 0.0, 0.0] },
    { age: 85.96, euler: [90.0, 0.0, 0.0] },
    { age: 100.0, euler: [-58.51, -33.61, 0.45] },
    { age: 600.0, euler: [90.0, 0.0, 0.0] }
  ],
  83340: [
    { age: 0.0, euler: [90.0, 0.0, 0.0] },
    { age: 85.96, euler: [90.0, 0.0, 0.0] },
    { age: 100.0, euler: [4.41, -31.26, 1.52] },
    { age: 600.0, euler: [90.0, 0.0, 0.0] }
  ],
  // ajoute toutes les plaques ici
};

// Interpolation simple entre rotations
function getRotationAtAge(rotArray, age) {
  for (let i = 0; i < rotArray.length - 1; i++) {
    if (age >= rotArray[i].age && age <= rotArray[i + 1].age) {
      const t = (age - rotArray[i].age) / (rotArray[i + 1].age - rotArray[i].age);
      return rotArray[i].euler.map((v, idx) => v + t * (rotArray[i + 1].euler[idx] - v));
    }
  }
  return rotArray[rotArray.length - 1].euler;
}
