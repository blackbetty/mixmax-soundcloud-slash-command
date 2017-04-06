var platformAggregator = require('../platform_integrations/platformAggregator.js');


// The API that returns the in-email representation.
module.exports = function (req, res) {
    var term = req.query.text.trim();
    handleSearchString(term, req, res);
};

function handleSearchString (term, req, res) {
    var response;
    response = platformAggregator.resolveSong(term, req, res);
    var results = platformAggregator.buildResult(term, response.body, 'resolver');



    if (results == null || results.body == null || results.body == '') {
        res.json([{
            body: '<i>(no results)</i>'
        }]);
    } else {
        res.json(results);
    }
}
