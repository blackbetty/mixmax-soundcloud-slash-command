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
            url: 'http://api.soundcloud.com/tracks',
            qs: {
                q: trackName,
                limit: 20,
                client_id: key
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
    return _.chain(responseBody)
        .reject(function(data) {
            // Filter out results without artwork.
            return !data.artwork_url;
        })
        .map(function(data) {
            //Strip down the object a little, probably a better way to do this with underscore
            if (data.user) {
                templateData.artistname = data.user.username
            }
            templateData.artwork_url = data.artwork_url;
            templateData.title = data.title;
            templateData.track_url = data.permalink_url;

            return {
                title: createTemplate(templateData),
                text: templateData.track_url
            };
        })
        .value();
}


exports.resolveSong = function(songID, req, res) {
    try {
        return sync.await(request({
            url: 'http://api.soundcloud.com/resolve',
            qs: {
                url: songID,
                client_id: key
            },
            gzip: true,
            json: true,
            timeout: 15 * 1000
        }, sync.defer()));
    } catch (e) {
        res.status(500).send('Error');
        return;
    }
}
