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
        user: req.session.tempUser,
        currentUser: req.user }
    );
  });

  // user resource
  getAuthenticated(app, '/users', controller.users.list);
  getAuthenticated(app, '/users/new', controller.users.newResource);
  postAuthenticated(app, '/users', controller.users.create);
  getAuthenticated(app, '/user/:id', controller.users.get);
  getAuthenticated(app, '/user/:id/edit', controller.users.edit);
  putAuthenticated(app, '/user/:id', controller.users.update);
  deleteAuthenticated(app, '/user/:id', controller.users.remove);

  getAuthenticated(app, '/user/profile', controller.users.profile);

  // poll resource
  getAuthenticated(app, '/polls', controller.polls.list);
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
