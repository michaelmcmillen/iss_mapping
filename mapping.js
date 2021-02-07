//Publickey to access MapBox API
mapboxgl.accessToken = 'pk.eyJ1IjoibWlrZW91dHNpZGUiLCJhIjoiY2pkNXBvYWczMXVraTJxcWp5bHI2MmM4MCJ9.2z_G7gwdmxJWTqjFRHxExg';

let map;

var yesButton = document.getElementById('yesButton');
yesButton.addEventListener('click', yesLocation);

var locationButton = document.getElementById('locationButton');
locationButton.addEventListener('click', getCoords);

var locationInput = document.getElementById('locationInput');
locationInput.addEventListener('keyup', enterPress = (e) => {
    if(e.keyCode === 13) {
        getCoords();
    }
});

var locationInput = document.getElementById('locationInput');

var longitudeText = document.getElementById('longitudeText');
var latitudeText = document.getElementById('latitudeText');
var passTimeText = document.getElementById('passTimeText');
var peopleInSpaceText = document.getElementById('peopleInSpace');

noLocation();

function yesLocation() {

    var promise1 = new Promise(function(resolve, reject) {

        navigator.geolocation.getCurrentPosition(function(pos){
            let lat = pos.coords.latitude
            let lon = pos.coords.longitude
            resolve([lon,lat]);
        },
        function(err) {
            if (err.code == err.PERMISSION_DENIED) {
                console.log(err);
                createMap("[-0.12838523470829866, 51.504629944543225]")
            }
        })

})
.then(function(value) {
    createMap(value, '12');

});
};

function noLocation() {
    createMap([-0.12838523470829866, 51.504629944543225])
};

function createMap(value, zoom = '5') {

    if(zoom !== '5') {
        passTimes(value[0], value[1]);
    }
        
    peopleInSpace();

    map = new mapboxgl.Map({
        
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
        center: value, // starting position [lng, lat] for Bristol
        zoom: zoom // starting zoom
    })
    startPolling();
}

function startPolling() {
    
    setInterval(function() {
        fetch('http://api.open-notify.org/iss-now.json')
        .then(response => response.json())
        .then(coords => {
            addMarker(coords.iss_position.latitude, coords.iss_position.longitude)
            longitudeText.textContent = coords.iss_position.longitude;
            latitudeText.textContent = coords.iss_position.latitude;
        });
    }, 5000);
}

var el = document.createElement('div');
el.className = 'marker';
var marker = new mapboxgl.Marker(el);
 
function addMarker(lat, long) {
    
    marker.setLngLat([long,lat]);
    marker.addTo(map);
    map.flyTo({
        center: [long, lat],
        zoom: 2.5,
        speed: 0.3,
        // curve: 0.1,
        essential: true
        });
}

function passTimes(lon, lat) {

    // Uses 'cors-anywhere' proxy to add Access-Control-Allow-Origin: * to response header
    let url = new URL('https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-pass.json')
    url.search = new URLSearchParams({
        lat: lat,
        lon: lon
})

    fetch(url)
        .then(response => response.json())
        .then(passes => {
            let date = new Date(passes.response[0].risetime*1000);
            passTimeText.textContent = date.toString();
        });
}

function peopleInSpace() {

    // Uses 'cors-anywhere' proxy to add Access-Control-Allow-Origin: * to response header
    fetch('https://cors-anywhere.herokuapp.com/http://api.open-notify.org/astros.json')
        .then(response => response.json())
        .then(people => {
            peopleInSpaceText.textContent = people.number;
        });
}

function getCoords() {

    let apiKey = '82845a74c5cd488caf782fd4074540b3';

    fetch('https://api.opencagedata.com/geocode/v1/json?key=' + apiKey + '&q=' + locationInput.value)
        .then(response => response.json())
        .then(coords => {
            // console.log(coords.results[0].geometry.lat, coords.results[0].geometry.lat);
            createMap([coords.results[0].geometry.lng, coords.results[0].geometry.lat], 12); 
        });
}