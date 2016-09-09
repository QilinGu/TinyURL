var express = require('express');
var app = express();
var restRouter = require('./routes/rest');
var redirectRouter = require('./routes/redirect');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var moment = require('moment');
var _ = require('lodash');
var useragent = require('express-useragent');

mongoose.connect('mongodb://urluser:urlpwd@ds019678.mlab.com:19678/tinyurl');

app.use(useragent.express());


app.use('/node_modules', express.static(__dirname + "/node_modules"));
app.use('/public', express.static(__dirname + "/public"));

app.use('/api/v1', restRouter);

app.use('/:shortUrl', redirectRouter);

app.use('/', indexRouter);

app.listen(3000);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

var tokenSecret = 'your unique secret';

var userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  facebook: {
    id: String,
    email: String
  },
  google: {
    id: String,
    email: String
  }
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);


function ensureAuthenticated(req, res, next) {
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

function createJwtToken(user) {
  var payload = {
    user: user,
    iat: new Date().getTime(),
    exp: moment().add('days', 7).valueOf()
  };
  return jwt.encode(payload, tokenSecret);
}

app.post('/auth/signup', function(req, res, next) {
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  console.log(JSON.stringify(req.body));
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
});

app.post('/auth/login', function(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) return res.send(401, 'User does not exist');
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) return res.send(401, 'Invalid email and/or password');
      var token = createJwtToken(user);
      res.send({ token: token });
    });
  });
});

app.post('/auth/facebook', function(req, res, next) {
  var profile = req.body.profile;
  var signedRequest = req.body.signedRequest;
  var encodedSignature = signedRequest.split('.')[0];
  var payload = signedRequest.split('.')[1];

  var appSecret = '298fb6c080fda239b809ae418bf49700';

  var expectedSignature = crypto.createHmac('sha256', appSecret).update(payload).digest('base64');
  expectedSignature = expectedSignature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  if (encodedSignature !== expectedSignature) {
    return res.send(400, 'Invalid Request Signature');
  }

  User.findOne({ facebook: profile.id }, function(err, existingUser) {
    if (existingUser) {
      var token = createJwtToken(existingUser);
      return res.send(token);
    }
    var user = new User({
      name: profile.name,
      facebook: {
        id: profile.id,
        email: profile.email
      }
    });
    user.save(function(err) {
      if (err) return next(err);
      var token = createJwtToken(user);
      res.send(token);
    });
  });
});

app.post('/auth/google', function(req, res, next) {
  var profile = req.body.profile;
  User.findOne({ google: profile.id }, function(err, existingUser) {
    if (existingUser) {
      var token = createJwtToken(existingUser);
      return res.send(token);
    }
    var user = new User({
      name: profile.displayName,
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    });
    user.save(function(err) {
      if (err) return next(err);
      var token = createJwtToken(user);
      res.send(token);
    });
  });
});

app.get('/api/users', function(req, res, next) {
  if (!req.query.email) {
    return res.send(400, { message: 'Email parameter is required.' });
  }

  User.findOne({ email: req.query.email }, function(err, user) {
    if (err) return next(err);
    res.send({ available: !user });
  });
});