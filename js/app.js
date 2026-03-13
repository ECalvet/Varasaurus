import { initGlobe, updatePolygons } from "./globe.js"
import { parseRotations } from "./rotation.js"
import { reconstructContinents } from "./reconstruction.js"

let continents, rotations, globe

async function init() {
    // 1️⃣ charger les données
    const continentsRes = await fetch("data/continents_simplified.geojson")
    continents = await continentsRes.json()

    const rotRes = await fetch("data/rotations.rot")
    const rotText = await rotRes.text()
    rotations = parseRotations(rotText)

    // 2️⃣ initialiser le globe
    globe = initGlobe()

    // 3️⃣ setup slider
    const slider = document.getElementById("timeSlider")
    slider.oninput = e => {
        const t = parseFloat(e.target.value)
        document.getElementById("timeLabel").innerText = t + " Ma"
        update(t)
    }

    // 4️⃣ afficher l’état initial
    update(0)
}

function update(time) {
    const reconstructed = reconstructContinents(continents, rotations, plateIdMap, time)
    updatePolygons(globe, reconstructed)
}

init()
