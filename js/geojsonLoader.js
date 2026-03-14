export async function loadGeoJSON(path){

const res = await fetch(path);
return await res.json();

}
