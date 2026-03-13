import { initGlobe, updatePolygons } from "./globe.js"
import { parseRotations } from "./rotation.js"
import { reconstructContinents } from "./reconstruction.js"

let continents
let rotations
let globe

async function loadData(){

const continentsRes =
await fetch("../data/continents_with_plate.geojson")

continents = await continentsRes.json()

const rotRes =
await fetch("../data/rotations.rot")

const rotText = await rotRes.text()

rotations = parseRotations(rotText)

}

async function init(){

await loadData()

globe = initGlobe()

update(0)

const slider = document.getElementById("timeSlider")

slider.oninput = e => {

const t = parseFloat(e.target.value)

document.getElementById("timeLabel").innerText =
t + " Ma"

update(t)

}

}

function update(time){

const reconstructed =
reconstructContinents(continents, rotations, time)

updatePolygons(globe, reconstructed)

}

init()
