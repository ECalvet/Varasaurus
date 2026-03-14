let THREE;

let scene;
let camera;
let renderer;
let globe;
let controls;

let continentMeshes = [];
let rotationsByPlate = {};

export function initGlobe(three, OrbitControls, continents, plates, rotations){

THREE = three;

preprocessRotations(rotations);

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
45,
window.innerWidth/window.innerHeight,
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

window.addEventListener("resize",onResize);

animate();
}

function onResize(){

camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

}

function createEarth(){

const geometry = new THREE.SphereGeometry(1,64,64);

const material = new THREE.MeshPhongMaterial({
color:0x001133
});

globe = new THREE.Mesh(geometry,material);

scene.add(globe);

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,3,5);

scene.add(light);

}

function latLonToVector3(lat,lon,r=1){

const phi=(90-lat)*Math.PI/180;
const theta=(lon+180)*Math.PI/180;

return new THREE.Vector3(
-(r*Math.sin(phi)*Math.cos(theta)),
r*Math.cos(phi),
(r*Math.sin(phi)*Math.sin(theta))
);

}

function drawPolygon(coords,plate){

const points=[];

for(const c of coords){

points.push(latLonToVector3(c[1],c[0],1.01));

}

const geometry=new THREE.BufferGeometry().setFromPoints(points);

const material=new THREE.LineBasicMaterial({color:0x55ff88});

const line=new THREE.Line(geometry,material);

scene.add(line);

continentMeshes.push({
mesh:line,
plate:plate,
original:points
});

}

function drawContinents(data){

for(const feature of data.features){

const geom=feature.geometry;
const plate=feature.properties.plate_id;

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

function preprocessRotations(rotations){

for(const r of rotations){

if(!rotationsByPlate[r.plate]){
rotationsByPlate[r.plate]=[];
}

rotationsByPlate[r.plate].push(r);

}

for(const p in rotationsByPlate){

rotationsByPlate[p].sort((a,b)=>a.time-b.time);

}

}

function rotationToQuaternion(rot){

const axis = latLonToVector3(rot.lat,rot.lon).normalize();

const angle = THREE.MathUtils.degToRad(rot.angle);

const q=new THREE.Quaternion();
q.setFromAxisAngle(axis,angle);

return q;

}

function getInterpolatedRotation(plate,time){

const list=rotationsByPlate[plate];

if(!list) return null;

let r1=null;
let r2=null;

for(let i=0;i<list.length-1;i++){

if(list[i].time<=time && list[i+1].time>=time){

r1=list[i];
r2=list[i+1];
break;

}

}

if(!r1) return rotationToQuaternion(list[list.length-1]);

if(!r2) return rotationToQuaternion(r1);

const q1=rotationToQuaternion(r1);
const q2=rotationToQuaternion(r2);

const t=(time-r1.time)/(r2.time-r1.time);

const q=new THREE.Quaternion();

THREE.Quaternion.slerp(q1,q2,q,t);

return q;

}

export function updateTime(time){

for(const c of continentMeshes){

const q=getInterpolatedRotation(c.plate,time);

if(!q) continue;

const newPoints=[];

for(const p of c.original){

newPoints.push(p.clone().applyQuaternion(q));

}

c.mesh.geometry.setFromPoints(newPoints);

}

}

function animate(){

requestAnimationFrame(animate);

controls.update();

renderer.render(scene,camera);

}
