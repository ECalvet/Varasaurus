export async function loadRotations(path){

const text = await fetch(path).then(r=>r.text());

const lines = text.split("\n");

const rotations=[];

for(let line of lines){

line=line.trim();

if(line==="" || line.startsWith("!")) continue;

const p=line.split(/\s+/);

rotations.push({
plate:p[0],
time:parseFloat(p[1]),
lat:parseFloat(p[2]),
lon:parseFloat(p[3]),
angle:parseFloat(p[4])
});

}

return rotations;

}
