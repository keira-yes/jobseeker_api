const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const companies = require('./routes/companies');

dotenv.config({ path: './config/config.env' });

// Connect to mongodb
connectDB();

const app = express();

// Add logger to requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/companies', companies);

const PORT = process.env.PORT || 5000;
const {NODE_ENV} = process.env;

const server = app.listen(PORT, () => console.log(`Server is running on ${PORT} port in ${NODE_ENV} mode`));

// Handle error of connection to server
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
})