// File origin: VS1LAB A3, A4

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
const GeoTagExamples = require('../models/geotag-examples');

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

const storage = new GeoTagStore();
GeoTagExamples.tagList.forEach(element => {
  var temp = new GeoTag(element[0], element[3], element[1], element[2], storage.idCounter);
  storage.addGeoTag(temp);
});;
var updateArray = storage.getArray();
var longitudeServer;
var latitudeServer;

let pageNumber = 1;
let maxPageNumber = Math.ceil(storage.getArray().length / 5)

router.get('/', (req, res) => {
  res.render('index', {
    taglist: updateArray,
    longitudeClient: longitudeServer,
    latitudeClient: latitudeServer
  })
});

router.post('/tagging', function (req, res) {
  var newGeoTag = new GeoTag(req.body.tagName, req.body.tagHashtag, req.body.tagLatitude, req.body.tagLongitude);
  storage.addGeoTag(newGeoTag);
  latitudeServer = req.body.tagLatitude;
  longitudeServer = req.body.tagLongitude;
  updateArray = storage.getNearbyGeoTags(req.body.tagLatitude, req.body.tagLongitude, 10);
  res.redirect('/');
});


router.post('/discovery', function (req, res) {
  updateArray = storage.searchNearbyGeoTags(req.body.discoveryHiddenLatitude, req.body.discoveryHiddenLongitude, 10, req.body.discoverySearch);
  res.redirect('/');
});

module.exports = router;

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...

router.get('/coordinates', (req, res) => {
  latitudeServer = req.query.discoveryHiddenLatitude;
  longitudeServer = req.query.discoveryHiddenLongitude;
  res.status(200).send({
    latitudeClient: latitudeServer,
    longitudeClient: longitudeServer
  })
});


router.get('/api/geotags', (req, res) => {
  if (req.query.discoverySearch != null &&
    req.query.discoveryHiddenLatitude != null &&
    req.query.discoveryHiddenLongitude != null) {
    updateArray = storage.searchNearbyGeoTags(req.query.discoveryHiddenLatitude, req.query.discoveryHiddenLongitude, 10, req.query.discoverySearch);
  }
  res.status(200).send(JSON.stringify(updateArray))
})

router.get('/api/pagination/:id', (req, res) => {
  if (req.query.discoverySearch != "" ||
    req.query.discoveryHiddenLatitude != "" ||
    req.query.discoveryHiddenLongitude != "") {
    storage.updatedArray = storage.searchNearbyGeoTags(req.query.discoveryHiddenLatitude, req.query.discoveryHiddenLongitude, 10, req.query.discoverySearch);
  } else {
    storage.setUpdatedArray(storage.getArray());
  }
  // let page = req.query.id;
  pageNumber = req.params.id
  res.status(200).send(JSON.stringify({
    arrayGeotags: storage.pagination(pageNumber),
    pageNumber: pageNumber,
    maxPageNumber: Math.ceil(storage.updatedArray.length / 5),
  }))
})
/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...


/* router.post('/api/geotags', (req, res) => {
  let geoTag = req.body;
  let newId = storage.idCounter

  storage.addGeoTag(geoTag.name, geoTag.hashtag, geoTag.latitude, geoTag.longitude, newId)
  res.set('Location', '/api/geotags/' + newId)

  res.status(201).send({
    name: geoTag.name,
    hashtag: geoTag.hashtag,
    latitude: geoTag.latitude,
    longitude: geoTag.longitude,
    id: newId,
  })
}) */

router.post('/api/geotags', (req, res) => {
  let geoTag = req.body;
  let newId = storage.idCounter;
  geoTag.id = newId;

  storage.addGeoTag(geoTag)
  res.set('Location', '/api/geotags/' + newId)

  res.status(201).send(JSON.stringify(geoTag))
})


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...

/* router.get('/api/geotags/:id', (req, res) => {
  let geoTag;
  storage.getArray().forEach(element => {
    if (element.id == (req.params.id)) {
      geoTag = element;
    }
  })
  res.status(200).send({
    name: geoTag.name,
    hashtag: geoTag.hashtag,
    latitude: geoTag.latitude,
    longitude: geoTag.longitude,
    id: geoTag.id
  })
}) */

router.get('/api/geotags/:id', (req, res) => {
  let geoTag;
  storage.getArray().forEach(element => {
    if (element.id == (req.params.id)) {
      geoTag = element;
    }
  })
  if (!geoTag) {
    res.status(404).send();
  }
  res.status(200).send(JSON.stringify(geoTag));
})



/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
/* 
router.put('/api/geotags/:id', (req, res) => {
  let requestedGeoTag = req.body;
  let newGeoTag;
  storage.getArray().forEach(element => {
    if (element.id == (req.params.id)) {
      element.name = requestedGeoTag.name;
      element.hashtag = requestedGeoTag.hashtag;
      element.latitude = requestedGeoTag.latitude;
      element.longitude = requestedGeoTag.longitude;
      newGeoTag = element;
    }
  })
  res.status(200).send({
    name: newGeoTag.name,
    hashtag: newGeoTag.hashtag,
    latitude: newGeoTag.latitude,
    longitude: newGeoTag.longitude,
    id: newGeoTag.id
  })
}) */

router.put('/api/geotags/:id', (req, res) => {
  let requestedGeoTag = req.body;
  let newGeoTag;
  storage.getArray().forEach(element => {
    if (element.id == (req.params.id)) {
      element.name = requestedGeoTag.name;
      element.hashtag = requestedGeoTag.hashtag;
      element.latitude = requestedGeoTag.latitude;
      element.longitude = requestedGeoTag.longitude;
      newGeoTag = element;
    }
  })
  res.status(200).send(JSON.stringify(newGeoTag));
})



/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
/* 
router.delete('/api/geotags/:id', (req, res) => {
  let removedGeoTag
  storage.getArray().forEach(element => {
    if (element.id == (req.params.id)) {
      removedGeoTag = element
      storage.removeGeoTagById(req.params.id)
    }
  })
  res.status(200).send({
    name: removedGeoTag.name,
    hashtag: removedGeoTag.hashtag,
    latitude: removedGeoTag.latitude,
    longitude: removedGeoTag.longitude,
    id: removedGeoTag.id
  })
})
 */


router.delete('/api/geotags/:id', (req, res) => {
  let removedGeoTag;
  storage.getArray().forEach(element => {
    if (element.id == (req.params.id)) {
      removedGeoTag = element
      storage.removeGeoTagById(req.params.id)
    }
  })
  res.status(200).send(JSON.stringify(removedGeoTag))
})



module.exports = router;
