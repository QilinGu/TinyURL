var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlService = require('../services/urlService');

router.post('/urls', jsonParser, function(req, res) {
    var shortUrl = urlService.getShortUrl(req.body.longUrl, req.app.longToShortHash, req.app.shortToLongHash);
    res.json({
        shortUrl: shortUrl,
        longUrl: req.body.longUrl
    });
});

module.exports = router;