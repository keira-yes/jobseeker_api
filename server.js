const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

const companies = require('./routes/companies');
const jobs = require('./routes/jobs');

// Connect to mongodb
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Add logger to requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1/companies', companies);
app.use('/api/v1/jobs', jobs);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const {NODE_ENV} = process.env;

const server = app.listen(PORT, () => console.log(`Server is running on ${PORT} port in ${NODE_ENV} mode`.brightBlue));

// Handle error of connection to server
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.brightRed);
    server.close(() => process.exit(1));
});