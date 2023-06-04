// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */
// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */


function updateLocation() {
    function setValues(helper) {
        console.log("setValues")
        //Fields füllen
        //Tagging
        document.getElementById("text_field_latitude").value = helper.latitude;
        document.getElementById("text_field_longitude").value = helper.longitude;
        //Discovery
        document.getElementById("latitude_input").value = helper.latitude;
        document.getElementById("longitude_input").value = helper.longitude;
        setMap(helper);
    }
    function setMap(helper) {
        let mapList = document.getElementById("mapView").getAttribute("data-tags");
        if (mapList !== "") { mapList = JSON.parse(mapList); }
        //Set Map
        let mm = new MapManager("iAPktSY0xLO4PpxaSrdVu3e5LlM1qdc6");
        let mapURL = mm.getMapUrl(helper.latitude,helper.longitude);

        console.log(mapURL);
        console.log("Rendering Map")
        document.getElementById("mapView").src = mapURL;
    }
    //Func Aufrufe
    if (document.getElementById("text_field_latitude").value === "") {
        LocationHelper.findLocation(setValues);
    }
    else setMap(new LocationHelper(
        document.getElementById("text_field_latitude").value,
        document.getElementById("text_field_longitude").value
    ));
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});