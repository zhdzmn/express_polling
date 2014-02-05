var express = require('express')
  , http = require('http')
  , path = require('path')
  , application_root = __dirname + '/app'
  , partials = require('express-partials')
  , mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , database = require('./config/database')[env]
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , socketIo = require('socket.io')
  , app = express();

mongoose.connect(database.connectionUrl);

//requiring all the models here
require("fs").readdirSync("./app/models").forEach(function(file) {
  require("./app/models/" + file);
});

//require('./config/passport');

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.engine('.html', require('ejs').__express);
  app.set('views', application_root + '/views');
  app.set('view engine', 'html');

  app.use(partials());

  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.session({ secret: 'newscred tuts' }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(path.join(application_root, "assets")));
  if ('development' === app.get('env')) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  }
  app.use(express.logger('dev'));
});


// all the routes are declered here
require('./config/routes')(app);

// passport settings

var User = mongoose.model('User');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.  In the real world, this would query a database;
// however, in this example we are using a baked-in set of users.

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + email }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      req.session.tempUser = {email: req.body.email};
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/user/profile');
    });
  })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

var server = http.createServer(app).listen(app.get('port'),  _initServer);

function _initServer() {
  console.log('Express server listening on port ' + app.get('port'));
  var io = socketIo.listen(server);
  require('./app/controllers/polls').useSocket(io);

}