export function rotatePoint(point,time,rotations){

const lon = point[0]
const lat = point[1]

const rad = Math.PI/180

let x =
Math.cos(lat*rad)*Math.cos(lon*rad)

let y =
Math.cos(lat*rad)*Math.sin(lon*rad)

let z =
Math.sin(lat*rad)

const angle = time*0.01

const nx =
x*Math.cos(angle) -
y*Math.sin(angle)

const ny =
x*Math.sin(angle) +
y*Math.cos(angle)

const nz = z

const newLon =
Math.atan2(ny,nx)/rad

const newLat =
Math.asin(nz)/rad

return [newLon,newLat]

}
