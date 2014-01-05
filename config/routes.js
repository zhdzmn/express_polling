'use strict';

var controller = {};

require("fs").readdirSync(__dirname + '/../app/controllers').forEach(function(file) {
  if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    controller[name] = require(__dirname + '/../app/controllers/' + file);
  }
});

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('index',
      { title : 'Index' }
    );
  });

  // user resource
  getAuthenticated(app, '/users', controller.users.list);
  getAuthenticated(app, '/users/new', controller.users.newResource);
  app.post('/users/create', controller.users.create);
  getAuthenticated(app, '/user/:id', controller.users.get);
  getAuthenticated(app, '/user/:id/edit', controller.users.edit);
  app.put('/user/:id', controller.users.update);
  app.delete('/user/:id', controller.users.remove);

  // login
  app.get('/login', controller.users.loginForm);

};

function getAuthenticated(app, path, method) {
  return app.get(path, ensureAuthenticated, method);
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
