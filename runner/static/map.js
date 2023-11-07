let points = {
    "start": null,
    "end": null
};

let maps = {};

function onMapClick(e, map, mapType) {
    if (points[mapType] != null) {
        map.removeLayer(points[mapType]);
    }
    points[mapType] = L.marker([e.latlng["lat"], e.latlng["lng"]]).addTo(map);
    document.querySelector(`#${mapType}Coordinates`).style.display = 'block';
    document.querySelector(`#${mapType}Latitude`).innerHTML = e.latlng["lat"].toFixed(5);
    document.querySelector(`#${mapType}Longitude`).innerHTML = e.latlng["lng"].toFixed(5);
    console.log(points);
}

for (let i = 0; i < 2; i++) {
    let mapType = "start";
    if (i == 1) {
        mapType = "end";
    }
    let map = L.map(`${mapType}Map`).setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    map.on('click', e => onMapClick(e, map, mapType));
    maps[mapType] = map;
}