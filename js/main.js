import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

import { initGlobe, updateTime } from "./globe.js";
import { loadGeoJSON } from "./geojsonLoader.js";
import { loadRotations } from "./rotations.js";

const slider = document.getElementById("timeSlider");
const label = document.getElementById("timeValue");

async function init(){

console.log("Loading data...");

const continents = await loadGeoJSON("data/continents.geojson");
const plates = await loadGeoJSON("data/plates.geojson");
const rotations = await loadRotations("data/rotations.rot");

console.log("Data loaded");

initGlobe(THREE, continents, plates, rotations);

}

slider.addEventListener("input", e => {

const t = parseInt(e.target.value);

label.innerText = t;

updateTime(t);

});

init();
