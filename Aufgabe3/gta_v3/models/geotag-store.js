// File origin: VS1LAB A3

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
        let geoTags = [];
    }

    addGeoTag(newGeoTag) {
        this.geoTags[this.geoTags.length] = newGeoTag;
    }
    removeGeoTag(name) {
        const index = this.geoTags.indexOf(name);
        if (index > -1) { //Only splice/remove if item is found
            this.geoTags.splice(index,1);
        }
    }
    getNearbyGeoTags(latitude, longitude) {
        const proximity = 50; //Standard number to start with (idea 50km)
        const lat = latitude;
        const long = longitude;
        const r = 6371; //Radius of Earth in km
        let nearby = this.geoTags.filter(item => {  //Distance calculations
            const dLon = Math.degToRad(long-item.longitude);
            const dLat = Math.degToRad(lat-item.latitude);
            let a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(Math.degToRad(lat)) * Math.cos(Math.degToRad(item.latitude)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
            a = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = r * a;
            return distance<proximity;
        });
        return nearby;
    }
    searchNearbyGeoTags(location, key) {
        let nearby = this.getNearbyGeoTags(location);
        nearby = nearby.filter(item => item.name.includes(key) || item.hashtag.includes(key));
        return nearby;
    }
}
let geoTagStore = new InMemoryGeoTagStore();
module.exports = InMemoryGeoTagStore
module.exports = geoTagStore
