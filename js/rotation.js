export function parseRotations(text){

const lines = text.split("\n")

const rotations = {}

for(const line of lines){

const parts = line.trim().split(/\s+/)

if(parts.length < 5) continue

const plate = parts[0]
const age = parseFloat(parts[1])

const lat = parseFloat(parts[2])
const lon = parseFloat(parts[3])
const angle = parseFloat(parts[4])

if(!rotations[plate])
rotations[plate] = []

rotations[plate].push({
age,
lat,
lon,
angle
})

}

return rotations

}
