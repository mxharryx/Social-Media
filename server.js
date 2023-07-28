const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

//cross origin resource sharing
app.use(cors());

//parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is up and running!' });
});

//run express server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});