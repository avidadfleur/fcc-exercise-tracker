const validateDate = require('./helpers/validateDate');
const addHours = require('./helpers/addHours');

const Exercise = require('./schemas/exerciseSchema');
const User = require('./schemas/userSchema');
const Log = require('./schemas/logSchema');

// GET all users '/api/users'

const getAllUsers = async (req, res) => {

  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json(
        { message: 'There are no users registered in the database.' }
      )
    }

    res.status(200).json(
      { users }
    );

  } catch (err) {

    res.status(500).json(
      { message: 'There was an error while retrieving users.' }
    );

  }

};

// POST new user '/api/users'

const newUser = async (req, res) => {
  const username = req.body.username;

  try {

    if (!username) {
      return res.status(400).json({
        message: 'Username cant be empty. Please enter a valid username.'
      })
    }

    const foundUser = await User.findOne({ username });

    if (foundUser) {
      return res.status(404).json(
        { message: 'User is already registered in the database.' }
      );
    }

    const user = new User({ username });
    const newUser = await user.save();

    res.status(200).json(newUser);

  } catch (err) {

    res.status(500).json(
      { message: 'There was an error while saving the username.' }
    );

  }

};


// POST exercise for user '/api/users/:_id/exercises'

const newUserExercise = async (req, res) => {
  
  const id = req.params._id;
  const { description, duration, date } = req.body;
  const nowDate = new Date().setHours(0, 0, 0, 0);
  const UTCDate = new Date(nowDate).setUTCHours(0);
  
  const errors = [];
  
  if (description.length < 1) {
    errors.push({
      field: 'description',
      message: 'Please enter a valid description'
    })
  }
  
  if (duration.length < 1 || isNaN(duration)) {
    errors.push({
      field: 'duration',
      message: " Please enter a valid duration. Duration can't be empty and should be a number "
    })
  }
  
  if (!validateDate(date) && date !== '') {
    errors.push({
      field: 'date',
      message: 'Please enter the date in the following format YYYY-MM-DD'
    })
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      errors: errors
    });
  }
  
  try {
    
    const user = await User.findById(id);
    
    const exercise = new Exercise({
      user_id: user._id,
      username: user.username,
      description,
      duration,
      date: date || UTCDate
    });
    
    const newExercise = await exercise.save();
    
    res.status(200).json({
      newExercise
    });
    
  } catch (err) {
    console.log(err)
    res.status(500).json(
      { message: 'There was an error while saving the exercise.' }
      );
      
    }
    
  };
  
  // GET user exercise logs '/api/users/:_id/logs'
  
  const getUserExerciseLog = async (req, res) => {
    const id = req.params._id;
    const { from, to, limit } = req.query;
  
    try {
      let dateObj = {};
      let query = { user_id: id };
  
      const user = await User.findById(id);
  
      if (from) {
        dateObj['$gte'] = new Date(from);
      }
  
      if (to) {
        dateObj['$lte'] = new Date(to);
      }
  
      if (from || to) {
        query.date = dateObj;
      }

      const aggregationPipeline = [
        { $match: query },
        { $sort: { date: 1 } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            exercises: { $push: "$$ROOT" }
          }
        },
        { $unwind: "$exercises" },
        { $limit: parseInt(limit) || 500 },
        {
          $project: {
            _id: "$exercises._id",
            description: "$exercises.description",
            duration: "$exercises.duration",
            date: "$exercises.date",
            count: 1
          }
        }
      ];

      const exercises = await Exercise.aggregate(aggregationPipeline);
      
      if (exercises.length === 0) {
        return res.status(404).json({ message: 'No exercises found for the given query' });
      }

      const logs = exercises.map(e => ({
        description: e.description,
        duration: e.duration,
        date: e.date
      }));

      const log = new Log({
        username: user.username,
        count: exercises[0].count,
        _id: user._id,
        log: logs
      });
  
      res.status(200).json(log);
  
    } catch (err) {
      console.log(err)
      res.status(500).json(
        { message: 'There was an error while retrieving user logs' }
      );
  
    }
  
  };

  module.exports = {
    getAllUsers,
    newUser,
    newUserExercise,
    getUserExerciseLog
}