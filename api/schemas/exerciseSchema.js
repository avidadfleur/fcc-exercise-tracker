const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExerciseSchema = new Schema({
    user_id: {
      type: String,
      required: true
    },
    username: String,
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    date: Date
  }, { versionKey: false });
  
const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;