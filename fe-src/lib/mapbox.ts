const MapboxClient = require("mapbox");

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWF4aWoxNiIsImEiOiJja3o4ZGM4czIxajNnMnZwMXVnOW9rNDNzIn0.ABGwGPaAvtM2_g4yHzWb-w";

const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

export {mapboxClient, MAPBOX_TOKEN}