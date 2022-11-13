const jwt = require('jsonwebtoken');
const User = require("../models/user");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const userData = jwt.verify(token, process.env.JWT_KEY);
        if (userData.id !== req.params.userId) {
            return res.status(401).json({message: 'Authentication failed'});
        }
        res.user = await User.findOne({id: userData.id});
        next();
    } catch (err) {
        return res.status(401).json({message: 'Authentication failed'});
    }
}
