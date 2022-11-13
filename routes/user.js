const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    try {
        const users = await User.find({email: req.body.email});
        if (users.length >= 1) {
            return res.status(409).json({message: 'Email already exist'});
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email, password: hashedPassword
        });
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.post('/login', async (req, res) => {
    try {
        const users = await User.find({email: req.body.email});
        if (users.length < 1) {
            return res.status(401).json({message: 'Authentication failed'});
        }
        await bcrypt.compare(req.body.password, users[0].password, (_err, bcryptRes) => {
            if (bcryptRes) {
                const token = jwt.sign({
                    id: users[0]._id
                }, process.env.JWT_KEY, {
                    expiresIn: '10h'
                });
                return res.status(200).json({message: 'Authentication successful', token});
            } else {
                return res.status(401).json({message: 'Authentication failed'});
            }
        })
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;
