// globe.js

// Initialise le globe
export function initGlobe() {
    const globe = new Globe()  // Globe est global grâce au <script> dans HTML
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')  // optionnel
        .polygonsData([])       // on remplira plus tard
        .polygonAltitude(0.01)
        .polygonCapColor(() => 'green')               // couleur principale des continents
        .polygonSideColor(() => 'rgba(0,100,0,0.5)') // côtés (petit relief)
        .polygonStrokeColor(() => 'black')           // contours

    // Le conteneur dans ton HTML s'appelle maintenant #globe
    globe(document.getElementById('globe'))

    return globe
}

// Met à jour les polygones du globe
export function updatePolygons(globe, data){
    globe.polygonsData(data.features)
}
