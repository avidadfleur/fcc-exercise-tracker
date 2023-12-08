const User = require('../schemas/userSchema');

const validateUser = async (req, res, next) => {
    const id = req.params._id;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send({
                message: 'The user does not exist. Please enter a valid user id.'
            });
        }

        next();
    } catch (error) {
        next(error); 
    }
};


module.exports = validateUser;