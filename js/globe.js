let THREE;

let scene;
let camera;
let renderer;
let globe;
let controls;

let continentMeshes = [];
let rotationsData;

export function initGlobe(three, OrbitControls, continents, plates, rotations){

THREE = three;
rotationsData = rotations;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
45,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.z = 3;

renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);

document.getElementById("globe").appendChild(renderer.domElement);

controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

createEarth();
drawContinents(continents);

window.addEventListener("resize", onResize);

animate();
}

function onResize(){

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth,window.innerHeight);

}

function createEarth(){

const geometry = new THREE.SphereGeometry(1,64,64);

const material = new THREE.MeshBasicMaterial({
color:0x001133
});

globe = new THREE.Mesh(geometry,material);
scene.add(globe);

}

function latLonToVector3(lat,lon,r=1.01){

const phi = (90-lat)*Math.PI/180;
const theta = (lon+180)*Math.PI/180;

return new THREE.Vector3(
-(r*Math.sin(phi)*Math.cos(theta)),
r*Math.cos(phi),
(r*Math.sin(phi)*Math.sin(theta))
);

}

function drawPolygon(coords,plate){

const points=[];

for(const c of coords){

points.push(latLonToVector3(c[1],c[0]));

}

const geometry = new THREE.BufferGeometry().setFromPoints(points);

const material = new THREE.LineBasicMaterial({color:0x55ff88});

const line = new THREE.Line(geometry,material);

scene.add(line);

continentMeshes.push({
mesh:line,
plate:plate,
original:points
});

}

function drawContinents(data){

for(const feature of data.features){

const geom = feature.geometry;
const plate = feature.properties.plate_id;

if(geom.type==="Polygon"){

for(const ring of geom.coordinates){

drawPolygon(ring,plate);

}

}

if(geom.type==="MultiPolygon"){

for(const poly of geom.coordinates){

for(const ring of poly){

drawPolygon(ring,plate);

}

}

}

}

}

function getRotation(plate,time){

let best=null;

for(const r of rotationsData){

if(r.plate!==plate) continue;

if(r.time<=time){

if(!best || r.time>best.time) best=r;

}

}

return best;

}

function rotatePoint(p,axis,angle){

const q = new THREE.Quaternion();
q.setFromAxisAngle(axis,angle);

return p.clone().applyQuaternion(q);

}

export function updateTime(time){

for(const c of continentMeshes){

const rot = getRotation(c.plate,time);

if(!rot) continue;

const axis = latLonToVector3(rot.lat,rot.lon,1).normalize();

const angle = THREE.MathUtils.degToRad(rot.angle);

const newPoints=[];

for(const p of c.original){

const rp = rotatePoint(p,axis,angle);

newPoints.push(rp);

}

c.mesh.geometry.setFromPoints(newPoints);

}

}

function animate(){

requestAnimationFrame(animate);

controls.update();

renderer.render(scene,camera);

}
