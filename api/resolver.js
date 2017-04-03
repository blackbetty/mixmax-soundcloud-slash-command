var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');
var platformAggregator = require('../platform_integrations/platformAggregator.js');
var createTemplate = require('../utils/template.js').resolver;


var platforms = {
    // user-friendly name => key used to identify using the API
    "soundcloud": "soundcloud",
    "spotify": "spotify"
};



// The API that returns the in-email representation.
module.exports = function(req, res) {
    var term = req.query.text.trim();
    handleSearchString(term, req, res);
};

function handleSearchString(term, req, res) {
    var response;
    response = platformAggregator.resolveSong(term, req, res);
    console.log(response.body);
    res.json({
        body: createTemplate(response.body)
    });
}
