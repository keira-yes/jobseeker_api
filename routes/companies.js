const express = require('express');
const router = express.Router();
const {
    getCompanies,
    getCompaniesWithinRadius,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany
} = require('../controllers/companies');

// Other resources routes
const jobsRouter = require('./jobs');

router.use('/:companyId/jobs', jobsRouter);

router
    .route('/radius/:zipcode/:distance')
    .get(getCompaniesWithinRadius);

router
    .route('/')
    .get(getCompanies)
    .post(createCompany);

router
    .route('/:id')
    .get(getCompany)
    .put(updateCompany)
    .delete(deleteCompany)

module.exports = router;