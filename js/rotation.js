export function parseRotations(rotText){
    const rotations = {}
    const lines = rotText.split("\n").filter(l => l.trim() && !l.startsWith("#"))

    for(const line of lines){
        const [plateId, age, lat, lon, angle] = line.trim().split(/\s+/)
        if(!rotations[plateId]) rotations[plateId] = []
        rotations[plateId].push({
            age: parseFloat(age),
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            angle: parseFloat(angle)
        })
    }

    console.log("parsed rotations for first plate:", rotations[Object.keys(rotations)[0]])
    return rotations
}
