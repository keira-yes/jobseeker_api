const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getJobs,
    getJob,
    createJob,
    updateJob
} = require('../controllers/jobs');

router
    .route('/')
    .get(getJobs)
    .post(createJob);

router
    .route('/:id')
    .get(getJob)
    .put(updateJob);

module.exports = router;