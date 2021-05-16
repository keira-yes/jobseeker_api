const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getJobs
} = require('../controllers/jobs');

router
    .route('/')
    .get(getJobs);

module.exports = router;