var express = require('express'),
    express3Handlebars  = require('express3-handlebars'),
    stylus = require('stylus'),
    nib = require('nib');

var app = express();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views');
app.engine('handlebars', express3Handlebars({defaultLayout: 'application'}));
app.set('view engine', 'handlebars');
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public'
    , compile: compile
  }
));

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index',
    { title : 'Home' }
  );
});
app.listen(3000);