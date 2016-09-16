var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var statsService = require('../services/statsService');
var app = express();

var redirectRouter = function(app) {
    router.get('*', function(req, res) {
        var shortUrl = req.originalUrl.slice(1);
        if (shortUrl == 'signup' || shortUrl == 'login') {
            res.redirect(originalUrl);
            console.log('OK');
        } else if (shortUrl == 'services/authentication.js') {
            res.sendfile('./services/authentication.js');
        } else {
            urlService.getLongUrl(shortUrl, function(url) {
                if (url) {
                    res.redirect(url.longUrl);
                    statsService.logRequest(shortUrl, req);
                    if (app.io[shortUrl]) {
                       app.io[shortUrl].emit('reload', 'please reload stats');
                    }
                } else {
                    res.sendfile('./public/views/404.html');
                }
            });
        }
    });
    return router;
};


module.exports = redirectRouter;