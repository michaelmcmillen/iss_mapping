<h1>ISS Mapping</h1>

ISS Mapping is a personal practice project, used to bring together the use of the <a href='https://docs.mapbox.com/api/overview/'>Mapbox</a>, <a href='http://open-notify.org/'>Open Notify Space Locator</a> and <a href='https://opencagedata.com/'>Open Cage Geocode</a> API's, to provide a visual representation of the current location of the International Space Station, relevant to your location, or one of your choosing.

<h1>Features</h1>

<ul>
    <li>International Space Station Coordinates Polling</li>
    <li>Moving Map Display of ISS Location</li>
    <li>ISS Data Relevant To User Location</li>
    <li>ISS Data Relevant To Searched Location</li>
    <li>Map Update In Response To Location Update</li>
    <li>Heroku Deployment Allowing Live Demo</li>
</ul>

<h1>Technology Used</h1>

<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>Javascript</li>
    <li>Heroku</li>
    <li>NPM</li>
    <li>Node.js</li>
    <li><a href='https://www.npmjs.com/package/cors-anywhere/v/0.4.1'>cors-anywhere</a> - To add required response headers</li>    
    <li><a href='https://docs.mapbox.com/api/overview/'>Mapbox</a> - Mapbox JS to build out mapping and marker features</li>
    <li><a href='http://open-notify.org/'>Open Notify Space Locator</a> - Polled for up to date ISS coordinates and other metrics</li> 
    <li><a href='https://opencagedata.com/'>Open Cage Geocode</a> - Request made to retrieve LONG & LAT Coordinates based on user location, or searched location</li>   
</ul>

<h1>Issues</h1>

<ul>
    <li>Every new request i.e. location search or retrieving user's current location generates a new ISS icon marker on the map, causing multiple pulsing icons. This requires addressing, so if an ISS marker icon is present, a new one is not required.</li>
    <li>Performance in relation to map movement is slow. Investigation into why is required, so map and transitions are smooth and responsive.</li>  
</ul>


Click <a href='https://michaelmcmillen.github.io/iss_mapping/'>here</a> to view a live demo (Please be patient for map to load when searching a location, or selecting your own location. Performance is an issue as highlighted in Issues above. Thankyou).