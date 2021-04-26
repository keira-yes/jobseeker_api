const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });

const app = express();

const PORT = process.env.PORT || 5000;
const {NODE_ENV} = process.env;

app.listen(PORT, () => console.log(`Server is running on ${PORT} port in ${NODE_ENV} mode`));