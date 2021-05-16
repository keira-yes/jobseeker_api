const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getJobs,
    getJob
} = require('../controllers/jobs');

router
    .route('/')
    .get(getJobs);

router
    .route('/:id')
    .get(getJob);

module.exports = router;