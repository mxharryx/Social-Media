require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');

const usersRoutes = require('./backend/routes/users');


//Connect to mongoDB
const MONGODB_URI = process.env.MONGODB_URI;

// Create an async function to connect to MongoDB
const connectToMongoDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
      process.exit(1); // Exit the application on connection failure
    }
};

  // Call the async function to connect to MongoDB
connectToMongoDB();

//cross origin resource sharing
app.use(cors());

//parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', usersRoutes);


//test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is up and running!' });
});



//run express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


