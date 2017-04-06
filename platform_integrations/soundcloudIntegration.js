var request = require('request');
var key = require('../utils/key');
var sync = require('synchronize');
var _ = require('underscore');
var createTypeTemplate = require('../utils/template.js').typeahead;
var createResolverTemplate = require('../utils/template.js').resolver;

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

// Functions in this Integration file must at least match those expected by the platformAggregator

exports.buildResult = function(responseBody, templateType) {

    // These are the fields the template expects
    var templateData = {
        artistname: null,
        artwork_url: null,
        title: null,
        track_url: null,
        user_permalink_url: null,
        description: null
    }

    // Builds the needed template based on the flag passed
    if (templateType == 'typeahead') {
        return _.chain(responseBody)
            .reject(function(data) {
                // Filter out results without artwork.
                return !data.artwork_url;
            })
            .map(function(data) {

                if (data.user) {
                    templateData.artistname = data.user.username
                }
                templateData.artwork_url = data.artwork_url;
                templateData.title = data.title;
                templateData.track_url = data.permalink_url;

                return {
                    title: createTypeTemplate(templateData),
                    text: templateData.track_url
                };
            })
            .value();
    } else if (templateType == 'resolver') {
        // No need to iterate since we have a single song
        if (responseBody.user) {
            templateData.artistname = responseBody.user.username;
            templateData.user_permalink_url = responseBody.user.permalink_url;
        }
        templateData.artwork_url = responseBody.artwork_url;
        templateData.title = responseBody.title;
        templateData.track_url = responseBody.permalink_url;
        templateData.description = responseBody.description;

        return {
            body: createResolverTemplate(templateData)
        };
    } else {
        // If a templateType flag is not passed, or is invalid, we return null;
        return null
    }
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
