// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

//Set-up GeoTags App should probably be done elsewhere?
const store = new GeoTagStore();

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  const geoTags = store.geoTags;
  res.render('index', {
    taglist: geoTags,
    set_latitude: "",
    set_longitude: "",
    errorMessage: "",
    mapList: geoTags
  })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

router.post('/tagging', (req,res) => {
  const { text_field_latitude, text_field_longitude, text_field_name, text_field_tags } = req.body;

  const newGeoTag = new GeoTag(
      text_field_name,
      text_field_latitude,
      text_field_longitude,
      text_field_tags
      );

  let errorMessage;
  errorMessage = store.addGeoTag(newGeoTag);
  const geoTags = store.getNearbyGeoTags(newGeoTag.latitude, newGeoTag.longitude);

  res.render('index', {
    taglist: geoTags,
    set_latitude: text_field_latitude,
    set_longitude: text_field_longitude,
    errorMessage: "Error: " + errorMessage,
    mapList: geoTags
  })
});



/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

router.post('/discovery', (req,res) => {

  const { text_field_search, latitude_input, longitude_input } = req.body;
  let geoTags = store.getNearbyGeoTags(latitude_input, longitude_input)
  if (text_field_search !== null) geoTags = store.searchNearbyGeoTags(text_field_search, geoTags);

  res.render('index', {
    taglist: geoTags,
    set_latitude: req.body.latitude,
    set_longitude: req.body.longitude,
    errorMessage: "",
    mapList: geoTags
  })
});

module.exports = router;
