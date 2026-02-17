// --- Scene Three.js ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// --- Globe ---
const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
const globeMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, wireframe: false });
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// --- Continent container ---
const continentsGroup = new THREE.Group();
scene.add(continentsGroup);

// --- Convert lat/lon to 3D vector ---
function latLonToVector3(lat, lon, radius=1.01){
    const phi = (90-lat) * Math.PI/180;
    const theta = (lon+180) * Math.PI/180;
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

// --- Load continents ---
async function loadContinents(time){
    const data = await fetch(`data/continents_${time}Ma.geojson`).then(r=>r.json());

    data.features.forEach(feature => {
        const coords = feature.geometry.coordinates[0];
        const points = coords.map(([lon,lat]) => latLonToVector3(lat,lon));

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({ color: 0x006400 }));
        continentsGroup.add(line);
    });
}

function clearContinents(){
    while(continentsGroup.children.length){
        continentsGroup.remove(continentsGroup.children[0]);
    }
}

// --- Slider ---
const slider = document.getElementById("timeSlider");
const label = document.getElementById("label");

slider.oninput = () => {
    const time = slider.value;
    label.innerText = time + " Ma";
    clearContinents();
    loadContinents(time);
}

// --- Handle resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animate ---
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// --- Initial load ---
loadContinents(0);
