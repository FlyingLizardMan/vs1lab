// File origin: VS1LAB A3

const GeoTag = require("./geotag");

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
class InMemoryGeoTagStore {
    idCounter;
    #geotagsArray = [];
    updatedArray = [];

    //pageElements = 5;
    //pageIDs = [5];

    setUpdatedArray(array) {
        this.updatedArray = array;
    }
    pagination(page) {

        let pageArray = [5];
        let minIndex = (page - 1) * 5;
        let maxIndex = minIndex + 4;

        if (page > 0) {
            for (; minIndex <= maxIndex; minIndex++) {
                if (typeof this.updatedArray[minIndex] != 'undefined') {
                    pageArray[minIndex % 5] = this.updatedArray[minIndex];
                }

            }

        } else {
            page = 1;
            this.pagination();
        }
        return pageArray
    }

    constructor() {
        this.idCounter = 0
    }

    addGeoTag(newGeotag) {
        this.#geotagsArray.push(newGeotag);
        this.idCounter++;
    }

    removeGeoTag(name) {
        var index;
        for (let i = 0; i < this.#geotagsArray.length; i++) {
            if (name == this.#geotagsArray[i].name) {
                index = i
            }
        }
        if (index != undefined) {
            this.#geotagsArray.splice(index, 1);
        }

    }

    removeGeoTagById(id) {
        var index;
        for (let i = 0; i < this.#geotagsArray.length; i++) {
            if (id == this.#geotagsArray[i].id) {
                index = i
            }
        }
        if (index != undefined) {
            this.#geotagsArray.splice(index, 1);
        }

    }


    getNearbyGeoTags(latitude, longitude, radius) {
        var returnTags = [];
        this.#geotagsArray.forEach(element => {
            var latDistance = latitude - element.latitude;
            var lonDistance = longitude - element.longitude;

            var distanceFromOrigin = Math.sqrt((latDistance * latDistance) + (lonDistance * lonDistance))

            if (distanceFromOrigin <= radius) {
                returnTags.push(element);
            }
        });
        return returnTags
    }

    getArray() {
        return this.#geotagsArray;
    }

    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        var leftoverTags = this.getNearbyGeoTags(latitude, longitude, radius);
        if (keyword == '') {
            return leftoverTags
        }

        var returnTags = []
        leftoverTags.forEach(element => {
            var withoutHashtag = element.hashtag.replace('#', '')
            if (element.name === keyword) {
                returnTags.push(element);
            } else if (element.hashtag === keyword) {
                returnTags.push(element);
            } else if (withoutHashtag === keyword) {
                returnTags.push(element);
            }
        });
        return returnTags
    }
}


module.exports = InMemoryGeoTagStore
