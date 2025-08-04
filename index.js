const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 8000;

require('./config/db.config.js');

const authRoutes = require("./routes/user.routes.js");
const eventRoutes = require("./routes/event.routes.js");

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});
