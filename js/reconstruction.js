import { rotatePoint } from "./rotation_math.js"

export function reconstructContinents(
continents,
rotations,
time
){

const result = JSON.parse(JSON.stringify(continents))

for(const feature of result.features){

const plate = feature.properties.plate_id

const rotation = rotations[plate]

if(!rotation) continue

for(const ring of feature.geometry.coordinates){

for(const p of ring){

const r = rotatePoint(p,time,rotation)

p[0] = r[0]
p[1] = r[1]

}

}

}

return result

}
