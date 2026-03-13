export function initGlobe(){

const globe = Globe()(document.getElementById("globe"))

.globeImageUrl(
"//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
)

.polygonCapColor(()=>"rgba(200,150,80,0.8)")
.polygonSideColor(()=>"rgba(0,0,0,0)")
.polygonStrokeColor(()=>"black")

return globe

}

export function updatePolygons(globe,data){

globe.polygonsData(data.features)

}
