import { initGlobe, updatePolygons } from "./globe.js"
import { parseRotations } from "./rotation.js"

// Suppression de l'import de reconstructContinents externe car tu l'as défini ici
// import { reconstructContinents } from "./reconstruction.js"

let continents
let rotations
let globe

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

    update(0) // afficher les continents initiaux

    const slider = document.getElementById("timeSlider")
    slider.oninput = e => {
        const t = parseFloat(e.target.value)
        document.getElementById("timeLabel").innerText = t + " Ma"
        update(t)
    }
}

// La fonction update reprend le rôle de mettre à jour le globe
function update(time){
    const reconstructed = reconstructContinents(continents, rotations, time)
    updatePolygons(globe, reconstructed)
}

// Ta fonction reconstructContinents
function reconstructContinents(continents, rotations, time){
    // cloner le GeoJSON pour que Globe.gl détecte le changement
    const result = JSON.parse(JSON.stringify(continents))

    for(const feature of result.features){
        const plate = feature.properties.plate_id
        const rotation = rotations[plate]
        if(!rotation) continue

        for(const ring of feature.geometry.coordinates){
            for(const p of ring){
                const r = rotatePoint(p, time, rotation)
                p[0] = r[0]
                p[1] = r[1]
            }
        }
    }
    return result
}

// Simple rotation temporaire pour tester (à remplacer par interpolation réelle)
function rotatePoint(point, time, rotation){
    const lon = point[0]
    const lat = point[1]
    const rad = Math.PI / 180

    let x = Math.cos(lat*rad) * Math.cos(lon*rad)
    let y = Math.cos(lat*rad) * Math.sin(lon*rad)
    let z = Math.sin(lat*rad)

    // rotation fictive pour voir un mouvement
    const angle = time * 0.01
    const nx = x*Math.cos(angle) - y*Math.sin(angle)
    const ny = x*Math.sin(angle) + y*Math.cos(angle)
    const nz = z

    const newLon = Math.atan2(ny, nx) / rad
    const newLat = Math.asin(nz) / rad

    return [newLon, newLat]
}

init()
