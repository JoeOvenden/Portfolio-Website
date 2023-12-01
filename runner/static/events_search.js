import { createMap, getIcons } from './map.js';
import { getLocation } from './geolocation.js';

let map = undefined;
let centreMarker = undefined;
let markers = {};
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
    centreMarker.setLatLng(latlng);
    circle.setLatLng(latlng);
    coordinateInput.value = latlng["lat"].toFixed(5) + "," + latlng["lng"].toFixed(5);
}

function addEventMarkers() {
    // Add marker to map for every event on the page

    // Get an array containing all <p> elements for the event latlngs
    let coordinateElements = Array.from(document.querySelectorAll('[id^="event-latlng"]'));

    for(let coordinateElement of coordinateElements) {
        let latlng = coordinateElement.innerHTML.split(",");
        let marker = L.marker(latlng).addTo(map);
        let id = coordinateElement.id.split("-")[2];
        let parent = coordinateElement.parentElement;
        let distance = parent.querySelector("#distance").innerHTML;
        let title = parent.querySelector("#title").innerHTML;
        marker.bindPopup(`<a href="event/${id}"><p>Event: ${title}</p></a><p>Distance: ${distance}</p>`);
        markers[id] = marker;
    }
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
        map.setView(centreMarker._latlng);    // Change the view to centre on this point
    });

    centreMarker = L.marker(initialCoordinates).addTo(map);
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
    addEventMarkers();
});