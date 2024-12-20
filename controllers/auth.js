const express = require('express')
const User = require('../models/user')
const responses = require('../utils/responses')
const router = express.Router()
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');


router.post('/login', async (req, res) => {
    let {mobile, password} = req.body;

    if (!mobile || !password) {
        return res.status(400).json(responses.error("Some fields are empty"))
    }
    try {
        const user = await User.findOne({mobile});
        if (!user) {
            return res.status(400).json(responses.error("Invalid Mobile."));
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json(responses.error("Invalid password"));
        }
        const token = jwt.sign(
            {userId: user._id, role: user.role},
            'sher',
            {expiresIn: '7d'}
        );
        res.json(responses.success(token));
    } catch (error) {
        console.log(error);
        res.json(responses.error("Some error occurred."));
    }
})





router.post('/get-details', authMiddleware, (req, res) => {
    console.log(req.user);
    try {
        res.json(responses.success_data(req.user));
    } catch (error) {
        print(error);
        res.json(responses.error("Some error occurred"));
    }
})

module.exports = router;