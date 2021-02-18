//Publickey to access MapBox API
mapboxgl.accessToken = 'pk.eyJ1IjoibWlrZW91dHNpZGUiLCJhIjoiY2pkNXBvYWczMXVraTJxcWp5bHI2MmM4MCJ9.2z_G7gwdmxJWTqjFRHxExg';

//Create map variable
let map;

//Use users location to re-initiate map and stats
var currentLocation = document.getElementById('myLocation');
currentLocation.addEventListener('click', myLocation);

//Search specific location and reinitiate map and stats
var locationButton = document.getElementById('searchLocationButton');
locationButton.addEventListener('click', getCoords);

//Search specific location and reinitiate map and stats when Enter
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

//Inititate map from generic location (UK)
noLocation();

//Create map from generic location (UK)
function noLocation() {
    createMap([-0.12838523470829866, 51.504629944543225])
};

//Create map
function createMap(coords, zoom = '5') {
    if(zoom !== '5') {
        passTimes(coords[0], coords[1]);
    }

    peopleInSpace();

    //Create new map
    map = new mapboxgl.Map({
        container: 'map', //Container ID
        style: 'mapbox://styles/mapbox/outdoors-v11', //Style URL
        center: coords, //Starting position [lng, lat]
        zoom: zoom //Starting zoom
    })

    startPolling();
}

//Polling for long and lat position of ISS
function startPolling() {   

    let marker = createMarker()

    setInterval(function() {
        fetch('http://localhost:8080/http://api.open-notify.org/iss-now.json') //CORS Anywhere used due to HTTP
        .then(response => response.json())
        .then(coords => {
            addMarker(marker, coords.iss_position.latitude, coords.iss_position.longitude) //Create ISS marker icon with response coords
            longitudeText.textContent = coords.iss_position.longitude; //Update long/lat text
            latitudeText.textContent = coords.iss_position.latitude;
        });
    }, 5000);
}

//Create element & marker to house ISS icon
function createMarker() {
    let element = document.createElement('div');
    element.className = 'issIcon';
    let marker = new mapboxgl.Marker(element);
    return marker;
}

//Add marker to map and determine movement
function addMarker(marker, lat, long) {        
    marker.setLngLat([long,lat]);
    marker.addTo(map);
    map.flyTo({
        center: [long, lat],
        zoom: 2.5,
        speed: 0.3,
        essential: true
        });
}

//Retrieve number of people in space
function peopleInSpace() {
    // Uses 'cors-anywhere' proxy to add Access-Control-Allow-Origin: * to response header
    fetch('http://localhost:8080/http://api.open-notify.org/astros.json')
        .then(response => response.json())
        .then(people => {
            peopleInSpaceText.textContent = people.number;
        });
}

//Prompt access for browser to access users current location 
//and use coordinates to initiate map and stats
function myLocation() {

    //Only create map once browser location is allowed or denied
    var promise1 = new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(function(pos){
            let lat = pos.coords.latitude
            let lon = pos.coords.longitude
            resolve([lon,lat]);
        },
        function(err) {
            if (err.code == err.PERMISSION_DENIED) {
                console.log(err);
                createMap("[-0.12838523470829866, 51.504629944543225]"); //Use set coords if location not found or blocked
            }
        })
    })
    .then(function(coords) {
        createMap(coords, '12');
    });
};

//Retrieve pass times for location based on users location or search
function passTimes(lon, lat) {
    // Uses 'cors-anywhere' proxy to add Access-Control-Allow-Origin: * to response header
    let url = new URL('http://localhost:8080/http://api.open-notify.org/iss-pass.json')
    url.search = new URLSearchParams({ //Create URL with long and lat parameters
        lat: lat,
        lon: lon
    })
    fetch(url)
    .then(response => response.json())
    .then(passes => {
        let date = new Date(passes.response[0].risetime*1000); //Convert pass time to readable GMT
        passTimeText.textContent = date.toString();
    });
}

//Get coordinates for searched location
function getCoords() {
    let apiKey = '82845a74c5cd488caf782fd4074540b3';
    //Opencagedata API which converts text location to longitude and latitude values
    fetch('https://api.opencagedata.com/geocode/v1/json?key=' + apiKey + '&q=' + locationInput.value)
    .then(response => response.json())
    .then(coords => {
        createMap([coords.results[0].geometry.lng, coords.results[0].geometry.lat], 12);
    });
}