'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  avatarUrl: {type: String},
  organization: {type: String}
});

mongoose.model('User', UserSchema);