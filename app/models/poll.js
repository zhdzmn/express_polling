'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PollSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  time: {type: Date, required: true},
  choice: {type: String, required: true}
});

mongoose.model('Poll', PollSchema);
