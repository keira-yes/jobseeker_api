const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getJobs,
    getJob,
    createJob
} = require('../controllers/jobs');

router
    .route('/')
    .get(getJobs)
    .post(createJob);

router
    .route('/:id')
    .get(getJob);

module.exports = router;