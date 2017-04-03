var request = require('request');
var key = require('../utils/key');
var sync = require('synchronize');
var _ = require('underscore');
var createTemplate = require('../utils/template.js').typeahead;


exports.trackSearch = function(trackName, req, res) {
    var response;
    try {
        response = sync.await(request({
            // https://developers.soundcloud.com/docs/api/reference#tracks
            url: 'https://api.spotify.com/v1/search',
            qs: {
                q: trackName,
                type: 'track',
                limit: 20
            },
            gzip: true,
            json: true,
            timeout: 10 * 1000
        }, sync.defer()));
        return response;
    } catch (e) {
        res.status(500).send('Error');
        return res;
    }
}


exports.buildResult = function(responseBody) {
    // These are the fields the template expects
    var templateData = {
        artistname: null,
        artwork_url: null,
        title: null,
        track_url: null
    }
    if (responseBody.tracks.items != null) {
        return _.chain(responseBody.tracks.items)
            .reject(function(data) {
                // Filter out results without an image.
                return (data.album.images.length == 0);
            })
            .map(function(data) {


                // copy to a new object that matches what the template expects
                if (data.artists.length != 0) {
                    templateData.artistname = data.artists[0].name // If there are multiple artists need to concat
                }

                // Images are stored in the original object in reverse-size order, and we want the smallest
                templateData.artwork_url = data.album.images[data.album.images.length - 1].url;
                templateData.title = data.name;
                templateData.track_url = data.href;

                return {
                    title: createTemplate(templateData),
                    text: templateData.track_url
                };
            })
            .value();
    } else {
        return null;
    }
}


exports.resolveSong = function(songID, req, res) {
    try {
        return sync.await(request({
            url: songID,
            gzip: true,
            json: true,
            timeout: 15 * 1000
        }, sync.defer()));
    } catch (e) {
        res.status(500).send('Error');
        return;
    }
}
