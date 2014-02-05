'use strict';

var mongoose = require('mongoose'),
  Poll = mongoose.model('Poll'),
  moment = require('moment'),
  _ = require('lodash');

var socketIo;

var useSocket = function (io) { socketIo = io.sockets; };

var list = function (req, res) {
  Poll.find(req.query).populate('user').sort('time').exec(function (listError, polls) {
    if (listError) {
      return res.render('index',
        { title : 'Index',
          currentUser: req.user,
          errors: listError
        }
      );
    }

    polls = _.map(polls, function (poll) {
      poll.formattedTime = moment(poll.time).format("D MMM YYYY, h:mm:ss a");
      return poll;
    });

    Poll.aggregate([{ $group: { _id : '$choice', count: { $sum: 1 } }}],
      function (aggError, pollChartData) {
        if (aggError) {
          return res.render('index',
            { title : 'Index',
              currentUser: req.user,
              errors: aggError
            }
          );
        }
        return res.render('polls/index',
          { polls : polls,
            pollChartData: pollChartData,
            currentUser: req.user,
            title : 'Poll List' }
        );
      });
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
      Poll.populate(poll, {path: 'user'}, function (err, poll) {
        socketIo.emit('poll:new', poll);
        res.redirect('/polls');
      });
    }
  });
};

module.exports = {
  list: list,
  newResource: newResource,
  create: create,
  useSocket: useSocket
};
