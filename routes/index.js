var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.sendfile('./public/views/index.html');
});

router.get('/services/authentication.js', function(req, res) {
	res.sendfile('./services/authentication.js');
});

module.exports = router;