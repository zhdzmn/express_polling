var express = require('express')
  , http = require('http')
  , path = require('path')
  , application_root = __dirname + '/app'
  , partials = require('express-partials')
  , mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , database = require('./config/database')[env]
  , app = express();

mongoose.connect(database.connectionUrl);

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.engine('.html', require('ejs').__express);
  app.set('views', application_root + '/views');
  app.set('view engine', 'html');

  app.use(partials());

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.urlencoded());
  app.use(express.json());

  app.use(app.router);
  app.use(express.static(path.join(application_root, "assets")));
  if ('development' === app.get('env')) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  }
  app.use(express.logger('dev'));
});

//requiring all the models here
require("fs").readdirSync("./app/models").forEach(function(file) {
  require("./app/models/" + file);
});

//all the routes are declered here
require('./config/routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
