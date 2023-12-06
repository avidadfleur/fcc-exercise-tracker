const { getAllUsers, newUser, newUserExercise, getUserExerciseLog } = require('../controllers');

const { Router } = require('express')
const validateUser = require('../middlewares/validateUser')

const router = Router();

router.post('/', newUser)
router.get('/', getAllUsers)
router.post('/:_id/exercises', validateUser, newUserExercise)
router.get('/:_id/logs', validateUser, getUserExerciseLog )


module.exports = router;