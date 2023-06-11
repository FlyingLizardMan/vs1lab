// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

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

    constructor() {
        this.geoTags = [];
    }
    addGeoTag(geotag) {
        this.geoTags.push(geotag);
    }
    removeGeoTag(name) {
        geoTags.forEach(element => {
            if (element.name == name) {
                var index = this.geoTags.indexOf(element);
                this.geoTags.splice(index, 1);
            }
        });
    }
    getNearbyGeoTags(location) {
        nearbyGeoTags = this.#getNearbyGeoTags(location);
        return nearbyGeoTags;
    }

    searchNearbyGeoTags(location, keyword) {
        nearbyGeoTags = this.#getNearbyGeoTags(location);
        matchingGeoTags = []
        nearbyGeoTags.forEach(element => {
            if ((element.name).includes(keyword) || element.hashtag.includes(keyword)) {
                matchingGeoTags.push(element);
            }
        });
        return matchingGeoTags;
    }

    #getNearbyGeoTags(location) {
        var nearbyGeoTags = [];
        var radius = 3;
        var earthRadius = 6371;
        geoTags.forEach(element => {
            var dLat = (element.latitude - location.latitude) * (Math.PI/180);
            var dLong = (element.longitude - location.longitude) * (Math.PI/180);
            var sindLat = Math.sin(dLat / 2);
            var sindLong = Math.sin(dLong / 2);
            var a = Math.pow(sindLat, 2) + Math.pow(sindLong, 2) * Math.cos(location.latitude * (Math.PI/180)) * Math.cos(element.latitude * (Math.PI/180));
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var distance = earthRadius * c;
            if (distance <= radius) {
                nearbyGeoTags.push(element);
            }
        });
    } 

}

module.exports = InMemoryGeoTagStore
