// Links into individual integrations.  To add more supported platforms, just add the platform below,
// and create a <Platform>Integration.js file.
var _ = require('underscore');
var soundcloudIntegration = require('./soundcloudIntegration.js');
var spotifyIntegration = require('./spotifyIntegration.js');

// A list of music subscription services
global.platforms = {
    // user-friendly name => key used to identify using the API
    'Soundcloud': 'Soundcloud',
    'Spotify': 'Spotify'
};

// Take in a platform name, return the correlated platform
function getPlatform (platformName) {
    switch (platformName) {
        case 'soundcloud':
            return soundcloudIntegration;
        case 'spotify':
            return spotifyIntegration;
        default:
            // Don't modify this return, other functions depend on it to indicate
            // the need to try and parse a URL.
            return null;
    }
}

// Parses the platform name out of the URL or other identifying string of the given platform
function parsePlatformName (songAddress) {
    return _.find(_.keys(global.platforms), function (key) {
        return songAddress.indexOf(key.toLowerCase()) > -1; // Search prefix.
    });
}

// Checks whether the first word of a search string is a valid "platform:"
exports.getPlatformPrefix = function (searchString) {
    return _.find(_.keys(global.platforms), function (key) {
        return searchString.indexOf(key + ': ') === 0; // Search prefix.
    });
};

// calls the given platform's search method
exports.trackSearch = function (platformName, trackName, req, res) {
    var platform = getPlatform(platformName.toLowerCase());
    return platform.trackSearch(trackName, req, res);
};

// Builds the given platform's result template
exports.buildResult = function (platformName, responseBody, templateType) {
    var platform = getPlatform(platformName.toLowerCase());
    // If we don't have reference to the name directly, we can at least pass in the URL
    // and get the name like that.
    if (platform == null) {
        platformName = parsePlatformName(platformName);
        platform = getPlatform(platformName.toLowerCase());
    }
    return platform.buildResult(responseBody, templateType);
};

// Calls the given platform's resolver function
exports.resolveSong = function (songAddress, req, res) {
    var platformName = parsePlatformName(songAddress);
    var platform = getPlatform(platformName.toLowerCase());
    return platform.resolveSong(songAddress, req, res);
};