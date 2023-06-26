// File origin: VS1LAB A2

//const GeoTag = require("../../models/geotag");

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A class to help using the HTML5 Geolocation API.
 */


/**
 * A class to help using the MapQuest map service.
 */


/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

let currentPageNum;
let maxPageNum;
let fiveElements;

function updateLocation() {
    LocationHelper.findLocation(currentLocationDetails);
}

// Callback function
function currentLocationDetails(locationHelper) {
    //Updating Form Elements
    assignValues(locationHelper.latitude, locationHelper.longitude);
    createMap(locationHelper.latitude, locationHelper.longitude);
    //Updating mapView Element
}

function createMap(lat, lon, array) {

    testManager = new MapManager('1HPBmokEdBAmuzdaqc3u4K7vItqdUq1a');
    let mapURL = testManager.getMapUrl(lat, lon, array);
    imageElement = document.getElementById("mapView")
    imageElement.src = mapURL;
}

function updateMap(array) {
    if (array) {
        console.log(array)
        createMap(document.getElementById("tag-latitude").value, document.getElementById("tag-longitude").value, array.map((geotag) => {
            return {
                name: geotag.name,
                latitude: geotag.latitude,
                longitude: geotag.longitude
            }
        }))
    }
}


function assignValues(lat, lon) {
    latitudeInput = document.getElementById("tag-latitude")
    longitudeInput = document.getElementById("tag-longitude")
    hiddenLatitudeInput = document.getElementById("discoveryHiddenLatitude")
    hiddenLongitudeInput = document.getElementById("discoveryHiddenLongitude")

    latitudeInput.value = lat;
    longitudeInput.value = lon;
    hiddenLatitudeInput.value = lat;
    hiddenLongitudeInput.value = lon;
}

const generateNewMap = async (tags) => {
    /*   const response = await fetch('/coordinates', {
          method: 'GET',
      });
      const data = await response.json(); */
    //createMap(data.latitudeClient, data.longitudeClient, tags)
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    // alert("Please change the script 'geotagging.js'");
    latitude = document.getElementById("tag-latitude").value
    longitude = document.getElementById("tag-longitude").value

    if (latitude === "" || longitude === "") {
        updateLocation();
    } else {
        assignValues(latitude, longitude)
        createMap(latitude, longitude)
    }
    updateDiscovery()
});

const postGeotags = async () => {
    let response = await fetch('/api/geotags', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            name: document.getElementById("tag-name").value,
            hashtag: document.getElementById("tag-hashtag").value,
            latitude: document.getElementById("tag-latitude").value,
            longitude: document.getElementById("tag-longitude").value
        })
    });
    //let data = await response.json();
    //console.log(data);
    updateDiscovery();
}

document.getElementById("discoveryFilterForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const response = await fetch('/api/geotags?discoverySearch=' + document.getElementById("discoverySearch").value + '&discoveryHiddenLatitude=' + document.getElementById("discoveryHiddenLatitude").value + '&discoveryHiddenLongitude=' + document.getElementById("discoveryHiddenLongitude").value, {
        method: 'GET',
    });
    const data = await response;
    let spanNum = document.getElementById("pagination-num");
    spanNum.innerText = 1;

    (document.getElementById('mapView').setAttribute('data-geotags', data))
    updateDiscovery();
});


const updateDiscovery = async () => {
    /*   let response = await fetch('/api/geotags', {
          method: "GET",
          headers: {
              'Content-Type': 'application/json'
          },
      });
      let data = await response.json()
      let newContent = '';
  
  
      data.forEach(function (gtag) {
          newContent += '<li>' + gtag.name + ' (' + gtag.latitude + ',' + gtag.longitude + ') ' + gtag.hashtag + '</li>';
      });
      //Aktualisiert Seite */


    let fiveElementArray;

    getPageArray().then(returnData => {
        console.log(returnData)
        maxPageNum = returnData.maxPageNumber
        fiveElementArray = returnData.arrayGeotags
        fiveElements = fiveElementArray

        let newContent = '';
        fiveElementArray.forEach(function (gtag) {
            newContent += '<li>' + gtag.name + ' (' + gtag.latitude + ',' + gtag.longitude + ') ' + gtag.hashtag + '</li>';
        });
        $('#discoveryResults').html(newContent);
        updateMap(fiveElementArray);
    })
}

const getPageArray = async (pageNum) => {
    let response = await fetch('/api/pagination/' + document.getElementById('pagination-num').innerHTML + '?discoverySearch=' + document.getElementById("discoverySearch").value + '&discoveryHiddenLatitude=' + document.getElementById("discoveryHiddenLatitude").value + '&discoveryHiddenLongitude=' + document.getElementById("discoveryHiddenLongitude").value, {
        method: 'GET',
    });
    const data = await response.json();
    return data
}



document.getElementById("tag-form").addEventListener("submit", function (event) {
    event.preventDefault();
    postGeotags();
});

document.getElementById("next-button").addEventListener("click", function (event) {
    let spanNum = document.getElementById("pagination-num");

    if (parseInt(spanNum.innerText) < maxPageNum) {
        spanNum.innerText = parseInt(spanNum.innerText) + 1;
        /* getPageArray().then(returnData => {
            console.log(returnData)
        }) */
        updateDiscovery()
    }
});

document.getElementById("prev-button").addEventListener("click", function (event) {
    let spanNum = document.getElementById("pagination-num");

    if (parseInt(spanNum.innerText) > 1) {
        spanNum.innerText = parseInt(spanNum.innerText) - 1;
        /*   getPageArray().then(returnData => {
              console.log(returnData)
          }) */
        updateDiscovery()
    }
});




