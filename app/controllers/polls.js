'use strict';

var mongoose = require('mongoose'),
  Poll = mongoose.model('Poll');

var list = function (req, res) {
  Poll.find(req.query).populate('user').exec(function (error, polls) {
    if (error) {
      res.render('index',
        { title : 'Index',
          currentUser: req.user,
          errors: error
        }
      );
      return;
    }
    res.render('polls/index',
      { polls : polls,
        currentUser: req.user,
        title : 'Poll List' }
    );
  });
};

var chart = function (req, res) {
  Poll.aggregate([{ $group: { _id : '$choice', count: { $sum: 1 } }}],
    function (error, polls) {
      if (error) {
        res.render('index',
          { title : 'Index',
            currentUser: req.user,
            errors: error
          }
        );
        return;
      }
      res.render('polls/chart',
        { polls : polls,
          currentUser: req.user,
          title : 'Poll List' }
      );
    });
};

var newResource = function (req, res) {
  res.render('polls/new',
    { title: 'New poll',
      currentUser: req.user,
      poll: new Poll()
    }
  );
};

var create = function (req, res) {
  var poll = new Poll(req.body);
  poll.user = req.user._id;
  poll.time = Date.now();
  poll.save(function (err, poll) {
    if (err) {
      res.render('polls/new',
        { title: 'New poll',
          currentUser: req.user,
          poll: req.body,
          errors: err
        }
      );
    } else {
      res.redirect('/polls');
    }
  });
};

module.exports = {
  list: list,
  chart: chart,
  newResource: newResource,
  create: create
};
