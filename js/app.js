import { initGlobe, updatePolygons } from "./globe.js"
import { parseRotations } from "./rotation.js"
import { reconstructContinents } from "./reconstruction.js"

let continents, rotations, globe
let plateIdMap  // <-- déclarer ici pour qu'il soit visible partout

async function init() {
    // 1️⃣ charger les données
    const continentsRes = await fetch("data/continents_simplified.geojson")
    continents = await continentsRes.json()

    const rotRes = await fetch("data/rotations.rot")
    const rotText = await rotRes.text()
    rotations = parseRotations(rotText)

    // 2️⃣ mapping automatique + manuel
    plateIdMap = {}  // <-- assigner ici
    const rotationKeys = Object.keys(rotations)
    const plateIds = [...new Set(continents.features.map(f => f.properties.plate_id))]

    for(const plate of plateIds){
        if(rotationKeys.includes(plate)){
            plateIdMap[plate] = plate
        } else {
            console.warn(`Pas de correspondance automatique pour plate_id "${plate}"`)
            // tu peux ici compléter manuellement, ex:
            // if(plate === "AF") plateIdMap[plate] = "101"
        }
    }
    console.log("Mapping plaques :", plateIdMap)

    // 3️⃣ initialiser le globe
    globe = initGlobe()

    // 4️⃣ setup slider
    const slider = document.getElementById("timeSlider")
    slider.oninput = e => {
        const t = parseFloat(e.target.value)
        document.getElementById("timeLabel").innerText = t + " Ma"
        update(t)
    }

    // 5️⃣ afficher l’état initial
    update(0)
}

function update(time) {
    const reconstructed = reconstructContinents(continents, rotations, plateIdMap, time)
    updatePolygons(globe, reconstructed)
}

console.log(reconstructContinents(
    { features: [continents.features.find(f => f.properties.plate_id==='AF')] }, 
    rotations, 
    { 'AF': '101' }, 
    50  // Ma
))

init()
