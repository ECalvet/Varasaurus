import { initGlobe, updateTime } from "./globe.js";
import { loadGeoJSON } from "./geojsonLoader.js";
import { loadRotations } from "./rotations.js";

const slider = document.getElementById("timeSlider");
const label = document.getElementById("timeValue");

let continents;
let plates;
let rotations;

async function init(){

continents = await loadGeoJSON("data/continents.geojson");
plates = await loadGeoJSON("data/plates.geojson");
rotations = await loadRotations("data/rotations.rot");

initGlobe(continents, plates, rotations);

}

slider.addEventListener("input", e => {

const t = parseInt(e.target.value);

label.innerText = t;

updateTime(t);

});

init();
