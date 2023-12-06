const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogSchema = new Schema({
    description: String,
    duration: Number,
    date: Date
  }, { versionKey: false, _id: false });

const UserLogSchema = new Schema({
  username: String,
  count: Number,
  user_id: String,
  log: [LogSchema]
}, { versionKey: false });

const Log = mongoose.model('Log', UserLogSchema);

module.exports = Log;