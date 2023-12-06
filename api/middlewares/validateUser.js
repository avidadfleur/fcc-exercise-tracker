const User = require('../schemas/userSchema');

const validateUser = async (req, res, next) => {
    const id = req.params._id;

    if (!id) {
        return res.status(400).send({
            message: 'User id is missing. Please enter a valid user id.'
        });
    }

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