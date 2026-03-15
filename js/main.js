// main.js

// ------------------------------
// Fonction de rotation interpolée
// ------------------------------
function getRotationAtAge(rotArray, age) {
  if (!rotArray || rotArray.length === 0) return [0, 0, 0]; // sécurité

  for (let i = 0; i < rotArray.length - 1; i++) {
    if (age >= rotArray[i].age && age <= rotArray[i + 1].age) {
      const t = (age - rotArray[i].age) / (rotArray[i + 1].age - rotArray[i].age);
      return rotArray[i].euler.map(
        (v, idx) => v + t * (rotArray[i + 1].euler[idx] - v)
      );
    }
  }

  // Si age avant ou après la plage connue
  if (age < rotArray[0].age) return rotArray[0].euler;
  return rotArray[rotArray.length - 1].euler;
}

// ------------------------------
// Filtrer les Polygons / MultiPolygons
// ------------------------------
const polygonFeatures = continents.features.filter(
  f => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
);

// ------------------------------
// Initialiser Globe
// ------------------------------
const globe = Globe()(document.getElementById('globeViz'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
  .polygonsData(polygonFeatures)
  .polygonCapColor(() => 'rgba(0,200,255,0.6)')
  .polygonSideColor(() => 'rgba(0,100,255,0.2)')
  .polygonStrokeColor(() => '#111')
  .polygonAltitude(0.01);

// ------------------------------
// Rotation des coordonnées
// ------------------------------
function rotateGeojson(coords, rx, ry, rz) {
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(rx),
    THREE.MathUtils.degToRad(ry),
    THREE.MathUtils.degToRad(rz),
    'XYZ'
  );
  const q = new THREE.Quaternion().setFromEuler(euler);

  function rotatePoint(lon, lat) {
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon + 180);
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);

    const v = new THREE.Vector3(x, y, z).applyQuaternion(q);

    const lat2 = 90 - THREE.MathUtils.radToDeg(Math.acos(v.y));
    const lon2 = THREE.MathUtils.radToDeg(Math.atan2(v.z, v.x)) - 180;
    return [lon2, lat2];
  }

  if (Array.isArray(coords[0][0])) {
    return coords.map(ring => ring.map(([lon, lat]) => rotatePoint(lon, lat)));
  } else {
    return coords.map(([lon, lat]) => rotatePoint(lon, lat));
  }
}

// ------------------------------
// Slider temporel
// ------------------------------
const slider = document.getElementById('timeSlider');
const ageLabel = document.getElementById('currentAge');

slider.addEventListener('input', () => {
  const age = parseFloat(slider.value);
  ageLabel.textContent = age + ' Ma';

  polygonFeatures.forEach(feature => {
    const plateId = feature.properties.plate_id;
    const rotArray = rotations[plateId];

    if (!rotArray || rotArray.length === 0) return; // aucune rotation connue

    const euler = getRotationAtAge(rotArray, age);

    // sécurité : si euler n'est pas un tableau de 3 nombres, ignorer
    if (!Array.isArray(euler) || euler.length !== 3) return;
    const [rx, ry, rz] = euler;

    feature.geometry.coordinates = rotateGeojson(feature.geometry.coordinates, rx, ry, rz);
  });

  globe.polygonsData(polygonFeatures);
});
