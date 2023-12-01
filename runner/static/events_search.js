import { createMap, getIcons } from './map.js';
import { getLocation } from './geolocation.js';

let map = undefined;
let marker = undefined;
let circle = undefined;
let coordinateInput = undefined;    // Hidden HTML coordinate input element
const initialCoordinates = [51, 0];

function initPosition(position) {       // Set map location to device location
    let latlng = {
        "lat": position.coords.latitude,
        "lng": position.coords.longitude
    };
    changePosition(latlng);
    map.fitBounds(circle.getBounds());  // Fit the bounds of the map to the circle bounds
}

function changePosition(latlng) {
    // Change position of marker and circle and update hidden html coordinate input element
    marker.setLatLng(latlng);
    circle.setLatLng(latlng);
    console.log(latlng);
    coordinateInput.value = latlng["lat"].toFixed(5) + "," + latlng["lng"].toFixed(5);
}

document.addEventListener("DOMContentLoaded", () => {

    coordinateInput = document.querySelector("#latlng");
    map = createMap("map");             // Create the map

    coordinateInput.addEventListener('change', () => {
        // Get longitude and latitude from input element as an array
        // Removes whitespace and splits into lat and lng by the comma
        
        let latlngArray = coordinateInput.value.replace(/\s/g, "").split(",");
        let latlng = {
            "lat": parseFloat(latlngArray[0]),
            "lng": parseFloat(latlngArray[1])
        };
        changePosition(latlng);
        map.fitBounds(circle.getBounds());
    });

    map.on('click', e => {              // When the map is clicked
        changePosition(e.latlng);
        map.setView(marker._latlng);    // Change the view to centre on this point
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

    // When the user changes the radius in the input element, change the circle radius on the map
    // and then change the zoom based on the size of the circle.
    radiusInputElement.addEventListener('change', () => {
        circle.setRadius(radiusInputElement.value * 1000);
        map.fitBounds(circle.getBounds());
    })

    getLocation(initPosition);          // Set location to device location
});