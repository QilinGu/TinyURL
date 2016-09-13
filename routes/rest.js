var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var urlService = require('../services/urlService');
var statsService = require('../services/statsService');

var jwt = require('jwt-simple')
var tokenSecret = 'your unique secret';

function isAuthenticated(req, res, next) {
  if (req.headers.authorization) {
    var token = req.headers.authorization.split(' ')[1];
    try {
      var decoded = jwt.decode(token, tokenSecret);
      if (decoded.exp <= Date.now()) {
        res.send(400, 'Access token has expired');
      } else {
        req.user = decoded.user;
        return next();
      }
    } catch (err) {
      return res.send(500, 'Error parsing token');
    }
  } else {
    return res.send(401);
  }
}

// function currentUser (req) {
//     var token = getToken(req.headers);
//     if (token) {
//         var user = jwt.decode(token, config.secret).email;
//     } else {
//         var user = "";
//     }
//     return user;
// };

// function getToken (headers) {
//     if (headers && headers.authorization) {
//         var parted = headers.authorization.split(' ');
//         if (parted.length === 2) {
//             return parted[1];
//         } else {
//             return null;
//         }
//     } else {
//         return null;
//     }
// };

router.post('/urls', jsonParser, function (req, res) {
    var longUrl = req.body.longUrl;
    var user = req.body.user;
    urlService.getShortUrl(longUrl, user, function (url) {
        res.json(url);
    });
});

router.get("/urls/:shortUrl", function (req, res) {
    var shortUrl = req.params.shortUrl;
    urlService.getLongUrl(shortUrl, function(url) {
        if (url) {
            res.json(url);
        } else {
            res.status(404).send("what????????");
        }
    });
});

router.get("/users/urls/:shortUrl", isAuthenticated, function (req, res) {
    var shortUrl = req.params.shortUrl;
    urlService.getLongUrl(shortUrl, function(url) {
        if (url) {
            res.json(url);
        } else {
            res.status(404).send("what????????");
        }
    });
});

router.post('/users/urls', jsonParser, isAuthenticated, function (req, res) {
    var longUrl = req.body.longUrl;
    var user = req.body.user;
    console.log(user);
    urlService.getShortUrl(longUrl, user, function (url) {
        res.json(url);
    });
});

router.get('/user/urls', jsonParser, isAuthenticated, function (req, res) {
    var user = req.user.email;
    urlService.getUrls(user, function (urls) {
        res.json(urls);
    })
});


router.get("/urls/:shortUrl/:info", function (req, res) {
    statsService.getUrlInfo(req.params.shortUrl, req.params.info, function (data) {
        res.json(data);
    });
});

module.exports = router;