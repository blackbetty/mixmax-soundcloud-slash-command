// Links into individual integrations.  As more are added, a <>Integration file is needed,
// an update to this aggregator, and an update to the typeahead module.

var soundcloudIntegration = require('./soundcloudIntegration.js');
var spotifyIntegration = require('./spotifyIntegration.js');
var _ = require('underscore');

// A list of music subscription services (will default to both if not present) that is extendable
var platforms = {
  // user-friendly name => key used to identify using the API
  "Soundcloud": "Soundcloud",
  "Spotify": "Spotify"
};



function getPlatform(platformName) {
    switch (platformName) {
        case "soundcloud":
            return soundcloudIntegration;
            break;
        case "spotify":
            return spotifyIntegration;
            break;
    }

}
exports.trackSearch = function(platformName, trackName, req, res) {
	platform = getPlatform(platformName.toLowerCase())
	return	platform.trackSearch(trackName, req, res);
}

exports.buildResult = function(platformName, responseBody) {
    platform = getPlatform(platformName.toLowerCase())
	return platform.buildResult(responseBody);
}


exports.resolveSong = function(songAddress, req, res) {

    var platformName = _.find(_.keys(platforms), function(key) {
        return songAddress.indexOf(key.toLowerCase()) > -1; // Search prefix.
    });
    platform = getPlatform(platformName.toLowerCase());
    return platform.resolveSong(songAddress, req, res);
}