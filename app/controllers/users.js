'use strict';

var mongoose = require('mongoose'),
  crypto = require('crypto'),
  User = mongoose.model('User');

var list = function (req, res) {
  User.find(req.query, function (error, users) {
    users.forEach(function (user) {
      if (!user.avatarUrl && user.email) {
        user.avatarUrl = 'http://www.gravatar.com/avatar/' + crypto.createHash('md5').update(user.email.trim().toLowerCase()).digest('hex');
      }
    });
    if (error) {
      res.render('index',
        { title : 'Index',
          errors: error
        }
      );
    }
    res.render('users/index',
      { users : users,
        title : 'User List' }
    );
  });
};

var get = function (req, res) {
  User.findById(req.params.id, function (error, user) {
    if (error) {
      res.redirect('/users');
    } else {
      res.render('users/show',
        { title: 'User',
          user : user
        });
    }
  });
};

var newResource = function (req, res) {
  res.render('users/new',
    { title: 'User List' }
  );
};

var create = function (req, res) {
  var user = new User(req.body);
  user.save(function (err, user) {
    if (err) {
      res.redirect('/users/new');
    } else {
      res.render('users/show',
        { title: 'User',
          user : user
        });
    }

  });
};

var edit = function (req, res) {
  User.findById(req.params.id, function (error, user) {
    if (error) {
      res.redirect('/users');
    } else {
      res.render('users/edit',
        { title: 'Edit user',
          user : user
        });
    }
  });
};

var update = function (req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, function (error, user) {
    if (error) {
      res.redirect('/users');
    } else {
      res.render('users/show',
        { title: 'User',
          user : user
        });
    }
  });
};

var remove = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (error) {
    res.redirect('/users');
  });
};

module.exports = {
  list: list,
  get: get,
  newResource: newResource,
  create: create,
  edit: edit,
  update: update,
  remove: remove
};
