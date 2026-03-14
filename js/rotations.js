export async function loadRotations(path){

const text = await fetch(path).then(r=>r.text());

const lines = text.split("\n");

const rotations = [];

for(let line of lines){

line=line.trim();

if(line==="" || line.startsWith("!")) continue;

const parts = line.split(/\s+/);

const plate = parts[0];
const time = parseFloat(parts[1]);
const lat = parseFloat(parts[2]);
const lon = parseFloat(parts[3]);
const angle = parseFloat(parts[4]);

rotations.push({
plate,
time,
lat,
lon,
angle
});

}

return rotations;

}
