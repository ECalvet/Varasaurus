import { initGlobe, updatePolygons } from "./globe.js"
import { parseRotations } from "./rotation.js"
import { reconstructContinents } from "./reconstruction.js"

let continents, rotations, globe

// mapping manuel ou généré automatiquement
const plateIdMap = {
    "AF": "101",
    "NA": "102",
    "SA": "103",
    "EU": "104",
    "AN": "105",
    "AU": "106",
    "PA": "107",
    "SU": "108",
    "NH": "109",
    "BS": "110",
    "MS": "111",
    // … compléter selon tes plate_id
}

async function loadData(){
    const continentsRes = await fetch("data/continents_with_plate.geojson")
    continents = await continentsRes.json()

    const rotRes = await fetch("data/rotations.rot")
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
        document.getElementById("timeLabel").innerText = t + " Ma"
        update(t)
    }
}

function update(time){
    const reconstructed = reconstructContinents(continents, rotations, plateIdMap, time)
    updatePolygons(globe, reconstructed)
}

init()
