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
      { title : 'Index',
        currentUser: req.user }
    );
  });

  // user resource
  getAuthenticated(app, '/users/new', controller.users.newResource);
  getAuthenticated(app, '/users', controller.users.list);
  postAuthenticated(app, '/users', controller.users.create);

  getAuthenticated(app, '/user/profile', controller.users.profile);
  getAuthenticated(app, '/user/:id/edit', controller.users.edit);
  getAuthenticated(app, '/user/:id', controller.users.get);
  putAuthenticated(app, '/user/:id', controller.users.update);
  deleteAuthenticated(app, '/user/:id', controller.users.remove);

  // poll resource
  getAuthenticated(app, '/polls', controller.polls.list);
  getAuthenticated(app, '/polls/chart', controller.polls.chart);
  getAuthenticated(app, '/polls/new', controller.polls.newResource);
  postAuthenticated(app, '/polls', controller.polls.create);

  // login
  app.get('/login', controller.users.loginForm);

};

function getAuthenticated(app, path, method) {
  return app.get(path, ensureAuthenticated, method);
}

function postAuthenticated(app, path, method) {
  return app.post(path, ensureAuthenticated, method);
}

function putAuthenticated(app, path, method) {
  return app.put(path, ensureAuthenticated, method);
}

function deleteAuthenticated(app, path, method) {
  return app.delete(path, ensureAuthenticated, method);
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
