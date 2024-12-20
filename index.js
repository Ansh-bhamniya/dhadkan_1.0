const express = require('express');
const mongoose = require('mongoose');
const patientRoutes = require('./controllers/patient');
const doctorRoutes = require('./controllers/doctor');
const authRoutes = require('./controllers/auth')

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://sher:sher@moviecluster.m0gfq.mongodb.net/?retryWrites=true&w=majority&appName=MovieCluster')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));


app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
  res.send({"All": "Clear.", "Go": "Ahead."});
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});