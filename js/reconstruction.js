// reconstruction.js

/**
 * Reconstruit les continents pour un âge donné en appliquant les rotations
 * 
 * continents: GeoJSON avec plate_id (ex: "AF", "NA", "AN"…)
 * rotations: objet {rotationID (ex:"101") : [{age, lat, lon, angle}, ...], ...}
 * plateIdMap: objet {plate_id du GeoJSON : rotationID du fichier rotations.rot}
 * time: âge en Ma
 */
export function reconstructContinents(continents, rotations, plateIdMap, time){
    // cloner le GeoJSON pour que Globe.gl détecte le changement
    const result = JSON.parse(JSON.stringify(continents))

    for(const feature of result.features){
        const plate = feature.properties.plate_id
        const rotationId = plateIdMap[plate]

        if(!rotationId){
            console.warn("Pas de rotation pour", plate)
            continue
        }

        const rotationData = rotations[rotationId]
        if(!rotationData || rotationData.length === 0){
            console.warn("Rotation vide pour", plate, rotationId)
            continue
        }

        for(const ring of feature.geometry.coordinates){
            for(const p of ring){
                const r = rotatePoint(p, time, rotationData)
                p[0] = r[0]
                p[1] = r[1]
            }
        }
    }

    return result
}

/**
 * Applique la rotation interpolée d'une plaque sur un point
 * point = [lon, lat] en degrés
 * time = âge actuel (Ma)
 * rotationData = array d'objets {age, lat, lon, angle}
 */
export function rotatePoint(point, time, rotationData){
    const lon = point[0]
    const lat = point[1]
    const rad = Math.PI / 180

    // 1️⃣ trouver les deux rotations encadrant le temps
    let rot1 = rotationData[0]
    let rot2 = rotationData[rotationData.length - 1]

    for(let i=0; i<rotationData.length-1; i++){
        if(rotationData[i].age <= time && time <= rotationData[i+1].age){
            rot1 = rotationData[i]
            rot2 = rotationData[i+1]
            break
        }
    }

    // 2️⃣ interpolation linéaire
    let alpha = 0
    if(rot1.age !== rot2.age){
        alpha = (time - rot1.age) / (rot2.age - rot1.age)
    }

    const poleLat = rot1.lat + (rot2.lat - rot1.lat)*alpha
    const poleLon = rot1.lon + (rot2.lon - rot1.lon)*alpha
    const angle = rot1.angle + (rot2.angle - rot1.angle)*alpha

    // 3️⃣ convertir le point en vecteur 3D
    let x = Math.cos(lat*rad)*Math.cos(lon*rad)
    let y = Math.cos(lat*rad)*Math.sin(lon*rad)
    let z = Math.sin(lat*rad)

    // 4️⃣ vecteur du pôle
    const px = Math.cos(poleLat*rad)*Math.cos(poleLon*rad)
    const py = Math.cos(poleLat*rad)*Math.sin(poleLon*rad)
    const pz = Math.sin(poleLat*rad)
    const pole = [px, py, pz]

    // 5️⃣ rotation autour du pôle (axis-angle)
    const theta = angle * rad
    const kx = pole[0], ky = pole[1], kz = pole[2]
    const cosT = Math.cos(theta), sinT = Math.sin(theta)
    const dot = x*kx + y*ky + z*kz
    const xRot = x*cosT + (ky*z - kz*y)*sinT + kx*dot*(1-cosT)
    const yRot = y*cosT + (kz*x - kx*z)*sinT + ky*dot*(1-cosT)
    const zRot = z*cosT + (kx*y - ky*x)*sinT + kz*dot*(1-cosT)

    // 6️⃣ reconvertir en lon/lat
    const newLon = Math.atan2(yRot, xRot)/rad
    const newLat = Math.asin(zRot)/rad

    return [newLon, newLat]
}
