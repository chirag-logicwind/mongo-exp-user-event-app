const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
    .then(() => console.log('DB Connected.'))
    .catch(() => console.log('DB connection error.'));
