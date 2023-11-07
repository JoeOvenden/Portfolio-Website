let points = {
    "start": null,
    "end": null
};

let maps = {};

let file_upload_row = document.querySelector("#id_route").parentElement.parentElement;
file_upload_row.style.display = "none";

function setRowDisplay(mapType, display) {
    document.querySelector(`#${mapType}MapRow`).style.display = display;
    if (display == "table-row") {
        maps[mapType].invalidateSize();
    }
}

function showGpx() {
    // Show gpx
    file_upload_row.style.display = "table-row";
    setRowDisplay("route", "table-row");

    // Hide start and end point maps
    setRowDisplay("start", "none");
    setRowDisplay("end", "none");
}

function showStartEnd() {
    // Show start and end point maps
    setRowDisplay("start", "table-row");
    setRowDisplay("end", "table-row");

    // Hide gpx
    file_upload_row.style.display = "none";
    setRowDisplay("route", "none");
}

document.querySelectorAll('input[name="uploadMethod"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        // If upload method is by gpx, then show file upload row and route map row
        if (this.value === 'gpx') {
            showGpx();
        } else if (this.value === 'manual') {
            // Code to execute when "Choose start end point manually" is selected
            showStartEnd();
        }
    });
});

function moveMapMarker(lat=undefined, lng=undefined, mapType) {
    if (lat != undefined) {
        points[mapType].lat = lat;
    }
    if (lng != undefined) {
        points[mapType].lng = lng;
    }
}

function setMapMarker(latlng, mapType) {
    if (points[mapType] != null) {
        maps[mapType].removeLayer(points[mapType]);
    }
    points[mapType] = L.marker([latlng["lat"], latlng["lng"]]).addTo(maps[mapType]);
    maps[mapType].setView([latlng["lat"], latlng["lng"]], 13);
    document.querySelector(`#${mapType}Coordinates`).style.display = 'block';
    document.querySelector(`#${mapType}Latitude`).value = latlng["lat"].toFixed(5);
    document.querySelector(`#${mapType}Longitude`).value = latlng["lng"].toFixed(5);
}

function createMap(mapId) {
    let map = L.map(mapId).setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    return map;
}

["start", "end"].forEach(mapType => {
    let map = createMap(`${mapType}Map`);
    map.on('click', e => setMapMarker(e.latlng, mapType));
    maps[mapType] = map;
});

maps["route"] = createMap("routeMap");

document.querySelector("#id_route").addEventListener('change', event => {
    // document.querySelector("#routeMapRow").style.display = "table-row";
    let gpxFile = event.target.files[0];

    let reader = new FileReader();
    reader.onload = function() {
        let gpxData = reader.result;
        new L.GPX(gpxData, {
            async: true,
            marker_options: {
                startIconUrl: 'media/icons/pin-icon-start.png',
                endIconUrl: 'media/icons/pin-icon-end.png',
                shadowUrl: null
            }
        }).on('addpoint', e => {
            setMapMarker(e.point._latlng, e.point_type);
        }).on('loaded', function(e) {
            maps["route"].fitBounds(e.target.getBounds());
        }).addTo(maps["route"]);
    }

    reader.readAsText(gpxFile);
});

document.querySelectorAll()