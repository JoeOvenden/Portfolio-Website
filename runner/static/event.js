import { createMap } from './map.js';

let maps = {};
let markers = {};

// Moves map marker
function moveMapMarker(mapType, latlng) {
    markers[mapType].setLatLng(latlng);
    maps[mapType].setView(latlng);
}

// Moves map marker and changes the values in the lat and lng input elements
function setMapMarker(latlng, mapType) {
    moveMapMarker(mapType, latlng);
    document.querySelector(`#${mapType}Latitude`).value = latlng["lat"].toFixed(5);
    document.querySelector(`#${mapType}Longitude`).value = latlng["lng"].toFixed(5);
}

document.addEventListener("DOMContentLoaded", () => {

    let displayType = document.querySelector("#displayType").innerHTML;

    if (displayType == "route") {
        // Create route map
        maps["route"] = createMap("routeMap");

        // Get the gpx file
        let gpxFile = document.querySelector("#gpxFileLoc").innerHTML;
        console.log(gpxFile);
        new L.GPX(gpxFile, {
            async: true,
            marker_options: {
                startIconUrl: '/media/icons/pin-icon-start.png',
                endIconUrl: '/media/icons/pin-icon-end.png',
                shadowUrl: null
            }
        }).on('loaded', function(e) {
            console.log("LOADED");
            maps["route"].fitBounds(e.target.getBounds());
        }).addTo(maps["route"]);
    }

    else if (displayType == "startEnd") {
        // Add start and end point maps
        ["start", "end"].forEach(mapType => {
            let markerCoordinates = [
                document.querySelector(`#${mapType}Latitude`).innerHTML,
                document.querySelector(`#${mapType}Longitude`).innerHTML
            ]
            maps[mapType] = createMap(`${mapType}Map`, markerCoordinates);
            markers[mapType] = L.marker(markerCoordinates).addTo(maps[mapType]);
        });
    }
});