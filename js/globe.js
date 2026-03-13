// globe.js
export function initGlobe() {
    const globe = new Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')  // optionnel
        .polygonsData([])   // on remplira plus tard
        .polygonAltitude(0.01)
        .polygonCapColor(() => 'green')
        .polygonSideColor(() => 'rgba(0,100,0,0.5)')
        .polygonStrokeColor(() => 'black')
    globe(document.getElementById('globeViz'))
    return globe
}

export function updatePolygons(globe,data){

globe.polygonsData(data.features)

}
