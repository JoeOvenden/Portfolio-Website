import { createMap, getIcons } from './map.js';
import { getLocation } from './geolocation.js';

let map = undefined;
let marker = undefined;
let circle = undefined;
const initialCoordinates = [51, 0];

function initPosition(position) {
    let latlng = [position.coords.latitude.toFixed(5), position.coords.longitude.toFixed(5)];
    map.setView(latlng);
    marker.setLatLng(latlng);
    circle.setLatLng(latlng);
}

document.addEventListener("DOMContentLoaded", () => {
    map = createMap("map");
    map.on('click', e => {
        marker.setLatLng(e.latlng);
        circle.setLatLng(e.latlng);
    });
    marker = L.marker(initialCoordinates).addTo(map);
    let radiusInputElement = document.querySelector("#radius-input");

    circle = L.circle(initialCoordinates, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.2,
        radius: radiusInputElement.value * 1000,
        weight: 2,
    }).addTo(map);

    radiusInputElement.addEventListener('change', () => {
        circle.setRadius(radiusInputElement.value * 1000);
    })
    
    getLocation(initPosition);       // Set map to view to device location
});