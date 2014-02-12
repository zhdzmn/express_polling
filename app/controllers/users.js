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
      return res.render('index',
        { title : 'Index',
          currentUser: req.user,
          errors: error
        }
      );
    }
    res.render('users/index',
      { users : users,
        currentUser: req.user,
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
          currentUser: req.user,
          user : user
        });
    }
  });
};

var profile = function (req, res) {
  res.render('users/profile',
    { title: 'User',
      currentUser: req.user
    });
};

var newResource = function (req, res) {
  res.render('users/new',
    { title: 'User List',
      currentUser: req.user,
      user: new User(),
      errors: null
    }
  );
};

var create = function (req, res) {
  var user = new User(req.body);
  user.save(function (err, user) {
    if (err) {
      res.render('users/new',
        { title: 'Create user',
          currentUser: req.user,
          user : req.body,
          errors: err
        });
    } else {
      res.render('users/show',
        { title: 'User',
          currentUser: req.user,
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
          currentUser: req.user,
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
          currentUser: req.user,
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

var loginForm = function (req, res) {
  res.render('users/login',
    { title: 'Login User', user: req.session.tempUser, currentUser: req.user, message: req.session.messages });
};

module.exports = {
  list: list,
  get: get,
  newResource: newResource,
  create: create,
  edit: edit,
  update: update,
  remove: remove,
  profile: profile,
  loginForm: loginForm
};
