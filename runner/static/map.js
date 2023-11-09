// Creates and returns a map
export function createMap(mapId, coordinates=[51, 0]) {
    let map = L.map(mapId).setView(coordinates, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    return map;
}