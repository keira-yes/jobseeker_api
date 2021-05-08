const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const Company = require('./models/Company');
const Job = require('./models/Job');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Read data
const companies = JSON.parse(fs.readFileSync(`${__dirname}/_data/companies.json`, 'utf-8'));
const jobs = JSON.parse(fs.readFileSync(`${__dirname}/_data/jobs.json`, 'utf-8'));

// Write data to DB
const importData = async () => {
    try {
        await Company.create(companies);
        await Job.create(jobs);
        console.log('Success! Data imported.'.green);
        process.exit();
    } catch(err) {
        console.error(err);
    }
}

// Delete data from DB
const deleteData = async () => {
    try {
        await Company.deleteMany();
        await Job.deleteMany();
        console.log('Success! Data deleted.'.red);
        process.exit();
    } catch(err) {
        console.error(err);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}