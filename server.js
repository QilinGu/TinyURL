var express = require('express');
var app = express();
var restRouter = require('./routes/rest');
var redirectRouter = require('./routes/redirect');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');

mongoose.connect('mongodb://gump423:lovefxy070503@ds019678.mlab.com:19678/tinyurl');

// app.longToShortHash = {};
// app.shortToLongHash = {};

app.use('/public', express.static(__dirname + "/public"));

app.use('/api/v1', restRouter);

app.use('/:shortUrl', redirectRouter);

app.use('/', indexRouter);

app.listen(3000);