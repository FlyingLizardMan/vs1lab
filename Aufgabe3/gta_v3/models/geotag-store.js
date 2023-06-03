// File origin: VS1LAB A3
const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    /**
     * @type {GeoTag[]}
     */
    #geoTags = [];

    constructor() {
        GeoTagExamples.tagList.forEach(tag => {
            this.addGeoTag(tag[0],tag[1],tag[2],tag[3],(errorMessage) => { console.log(errorMessage) });
        })
    }

    /**
     * Save GeoTags
     * Does NOT check if name or hashtag is already used!
     * @param name Either GeoTag itself or String name for GeoTag -> If name is GeoTag itself, rest values will be ignored
     * @param latitude
     * @param longitude
     * @param hashtag
     * @param errorCallback If GeoTag could not be created ErrorCallback will be thrown telling the client about the problem
     */
    addGeoTag(name,latitude,longitude,hashtag, errorCallback) {
        let newGeoTag;
        if (name instanceof GeoTag) {
            newGeoTag = name;
        } else {
            newGeoTag = new GeoTag(name,latitude,longitude,hashtag)
        }
        const gname = newGeoTag.name;
        if (!(this.#geoTags.some(item => item.name === gname))) {
            this.#geoTags.push(newGeoTag);
        } else {
            errorCallback("Name already used. Please use a different name");
        }
    }

    removeGeoTag(name) {
        const index = this.#geoTags.indexOf(name);
        if (index > -1) { //Only splice,remove if item is found
            this.#geoTags.splice(index,1);
        }
    }

    /**
     *
     * @param lat Latitude
     * @param long Longitude
     * @returns {GeoTag[]} returns nearby GeoTags
     */

    getNearbyGeoTags(lat, long) {
        const proximity = 50; //Standard number to start with (idea 50km)
        const r = 6371; //Radius of Earth in km
        return this.#geoTags.filter(item => {  //Distance calculations
            const dLon = degToRad(long - item.longitude);
            const dLat = degToRad(lat - item.latitude);
            let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(degToRad(lat)) * Math.cos(degToRad(item.latitude)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
            a = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = r * a;
            return distance < proximity;
        });
    }
    searchNearbyGeoTags(key, geoTags /* = this.getNearbyGeoTags(location-helper.latitude, location-helper.longitude) */ ) {
        key = key.toLowerCase();
        return geoTags.filter(item => item.name.toLowerCase().includes(key) || item.hashtag.toLowerCase().includes(key));
    }
}
module.exports = InMemoryGeoTagStore
