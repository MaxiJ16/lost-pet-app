const MapboxClient = require("mapbox");
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

export { mapboxClient, MAPBOX_TOKEN };
