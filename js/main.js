// main.js

// Filtrer uniquement Polygons et MultiPolygons
const polygonFeatures = continents.features.filter(f =>
  f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
);

const globe = Globe()(document.getElementById('globeViz'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
  .polygonsData(polygonFeatures)
  .polygonCapColor(() => 'rgba(0,200,255,0.6)')
  .polygonSideColor(() => 'rgba(0,100,255,0.2)')
  .polygonStrokeColor(() => '#111')
  .polygonAltitude(0.01);

// Fonction de rotation
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

// Slider
const slider = document.getElementById('timeSlider');
const ageLabel = document.getElementById('currentAge');

slider.addEventListener('input', () => {
  const age = parseFloat(slider.value);
  ageLabel.textContent = age + ' Ma';

  polygonFeatures.forEach(feature => {
    const plateId = feature.properties.plate_id;
    const rotArray = rotations[plateId];
    if (!rotArray) return; // ignore si pas de rotation

    const euler = getRotationAtAge(rotArray, age);
    if (!Array.isArray(euler)) return;

    const [rx, ry, rz] = euler;
    feature.geometry.coordinates = rotateGeojson(feature.geometry.coordinates, rx, ry, rz);
  });

  globe.polygonsData(polygonFeatures);
});
