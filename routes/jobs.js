const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
} = require('../controllers/jobs');
const Job = require('../models/Job');
const extendedResults = require('../middleware/extendedResults');

router
    .route('/')
    .get(extendedResults(Job, {
        path: 'company',
        select: 'name website'
    }), getJobs)
    .post(createJob);

router
    .route('/:id')
    .get(getJob)
    .put(updateJob)
    .delete(deleteJob);

module.exports = router;