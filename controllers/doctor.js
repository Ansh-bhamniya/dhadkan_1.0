const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const responses = require('../utils/responses')
const authMiddleware = require('./authMiddleware');
const DailyData = require("../models/DailyData");
const router = express.Router();
const utils = require('../utils/formatDailyData')


router.get('/', (req, res) => {
    res.json({'all': 'good'});
})

router.post('/signup', async (req, res) => {
    let {name, mobile, password, email, hospital} = req.body;
    console.log({name, password, email, hospital});

    if (!name || !mobile || !password || !hospital) {
        return res.status(400).json(responses.error("Some fields are empty."))
    }
    const existingUser = await User.findOne({mobile: mobile});
    if (existingUser) {
        return res.status(400).json(responses.error("Mobile already exists. Log In."));
    }
    try {
        const role = "doctor";
        const user = new User({name, mobile, password, role, email, hospital});
        console.log(user);
        await user.save();
        return res.status(201).json(responses.success("User created successfully. You may log in."));
    } catch (error) {
        console.log(error);
        return res.status(400).json(responses.error("Something went wrong!"))
    }
});

router.post('/get-patients-data', authMiddleware, async (req, res) => {
    if (req.user.role === 'patient') {
        res.status(401).json(responses.error("Invalid request"));
    }

    try {
        const patients = await User.find({role: "patient", doctor: req.user});
        let result = [];

        // Use for...of to handle async properly
        for (const patient of patients) {
            console.log("CURRENT PATIENT IS " + patient.name);
            const dailyData = await DailyData.find({patient: patient}).sort({time: 1});
            console.log(`Found ${dailyData.length} entries for him.`);
            const graphData = utils.generateGraphData(dailyData);
            result.push({'patient': patient, 'graphData': graphData});
        }

        res.json(responses.success_data(result));
    } catch (error) {
        console.log(error);
        res.json(responses.error("Some error occurred"));
    }
});


router.post('/get-details', authMiddleware, async (req, res) => {
    if (req.user.role === 'patient') {
        res.status(401).json(responses.error("Invalid request"));
    }

    try {
        const name = req.user.name;
        const hospital = req.user.hospital;
        const speciality = "Obstetrics";
        const patients = await User.find({role: "patient", doctor: req.user});
        const patientCount = patients.length;
        res.json(responses.success_data({name, hospital, speciality, patientCount}));
    } catch (error) {
        console.log(error);
        res.json(responses.error("Some error occurred"));
    }
})


module.exports = router;
