var sync = require('synchronize');
var request = require('request');
var createTemplate = require('../utils/template.js').typeahead;
var platformAggregator = require('../platform_integrations/platformAggregator.js');
var _ = require('underscore');

// A list of artifact types you can search through (will default to songs if not present)
var resourceType = {
  // user-friendly name => key used to identify using the API
  "album": "album",           // On Soundcloud this will redirect to playlist
  "artist": "artist",         // On Soundcloud this will hit the "users" route because  artist should == user on that platform
  "song": "track",
  "playlist": "playlist"
};

// A list of music subscription services (will default to both if not present) that is extendable
var platforms = {
  // user-friendly name => key used to identify using the API
  "Soundcloud": "Soundcloud",
  "Spotify": "Spotify"
};








// The Type Ahead API.
module.exports = function(req, res) {
  // The idea here is to take the search string (provided in req.query.text) and provide helpful
  // contextual feedback as the user is typing. For this particular command, we're going to have the
  // user search the Soundcloud genre first, then the name of the track. So our search string is the
  // format:
  //    <genre search word>: <track search term>

  var searchTerm = req.query.text;
  // If a user has selected a valid genre, then it will be the prefix of the search string
  var selectedPlatform = _.find(_.keys(platforms), function(key) {
    return searchTerm.indexOf(key + ': ') === 0; // Search prefix.
  });

  // If the user doesn't have a valid platform selected, then assume they're still searching platforms.
  if (!selectedPlatform) {
    var matchingPlatforms = _.filter(_.keys(platforms), function(platform) {
      // Show all platforms if there is no search string
      if (searchTerm.trim() === '') return true;

      return platform.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0;
    });

    if (matchingPlatforms.length === 0) {
      res.json([{
        title: '<i>(no platforms found)</i>',
        text: ''
      }]);
    } else {
      res.json(matchingPlatforms.map(function(platform) {
        return {
          title: platform,
          text: platform + ': ',
          resolve: false // Don't automatically resolve and remove the text (keep searching instead).
        };
      }));
    }
    return;
  }

  var platformName = platforms[selectedPlatform];
  // The track search term is the remaining string after the genre and the delimiter.
  var trackSearchTerm = searchTerm.slice((selectedPlatform + ': ').length);

  //Call out to our service aggregator
  var response = platformAggregator.trackSearch(platformName, trackSearchTerm, req, res);

  if (response.statusCode !== 200 || !response.body) {
    res.status(500).send('Error');
    return;
  }

  var results = platformAggregator.buildResult(platformName, response.body, 'typeahead');
  if (results.length === 0) {
    res.json([{
      title: '<i>(no results)</i>',
      text: ''
    }]);
  } else {
    res.json(results);
  }
};