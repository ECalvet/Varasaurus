let THREE;

let scene;
let camera;
let renderer;
let globe;

let continentMeshes=[];

let continentsData;
let platesData;
let rotationsData;

export function initGlobe(three, continents, plates, rotations){

THREE = three;

continentsData = continents;
platesData = plates;
rotationsData = rotations;

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
45,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.z = 3;

renderer = new THREE.WebGLRenderer({antialias:true});

renderer.setSize(window.innerWidth,window.innerHeight);

document.getElementById("globe").appendChild(renderer.domElement);

createEarth();

drawContinents();

animate();

}

function createEarth(){

const geometry = new THREE.SphereGeometry(1,64,64);

const material = new THREE.MeshBasicMaterial({
color:0x001133
});

globe = new THREE.Mesh(geometry,material);

scene.add(globe);

}

function latLonToVector3(lat,lon,radius=1.01){

const phi = (90-lat)*(Math.PI/180);
const theta = (lon+180)*(Math.PI/180);

const x = -(radius*Math.sin(phi)*Math.cos(theta));
const z = (radius*Math.sin(phi)*Math.sin(theta));
const y = (radius*Math.cos(phi));

return new THREE.Vector3(x,y,z);

}

function drawContinents(){

const material = new THREE.LineBasicMaterial({color:0x55ff88});

continentsData.features.forEach(feature=>{

const coords = feature.geometry.coordinates;

coords.forEach(polygon=>{

const points=[];

polygon.forEach(coord=>{

const v = latLonToVector3(coord[1],coord[0]);

points.push(v);

});

const geometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry,material);

continentMeshes.push(line);

scene.add(line);

});

});

}

export function updateTime(time){

console.log("Time =",time);

}

function animate(){

requestAnimationFrame(animate);

globe.rotation.y += 0.0005;

renderer.render(scene,camera);

}
