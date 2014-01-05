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
    res.redirect('/users');
  });

  // user resource
  app.get('/users', controller.users.list);
  app.get('/users/new', controller.users.newResource);
  app.post('/users/create', controller.users.create);
  app.get('/user/:id', controller.users.get);
  app.get('/user/:id/edit', controller.users.edit);
  app.put('/user/:id', controller.users.update);
  app.delete('/user/:id', controller.users.remove);


};
