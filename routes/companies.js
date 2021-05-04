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