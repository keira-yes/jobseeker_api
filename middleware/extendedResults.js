const extendedResults = (model, populate) => async (req, res, next) => {
    const queryStr = { ...req.query };

    // Remove params from query string
    const removedParams = ['select', 'sort', 'page', 'limit'];
    removedParams.map(item => delete queryStr[item]);

    // Add $ to gt, gte, lt, lte, in for filtering
    const filters = JSON.stringify(queryStr).replace(/\b(gt|gte|lt|lte|in)\b/, str => `$${str}`);

    // Find by filters
    let list = model.find(JSON.parse(filters));

    // Populate
    if (populate) {
        list = list.populate(populate);
    }

    // Select fields to display
    if (req.query.select) {
        const selectedFields = req.query.select.split(',').join(' ');
        list = list.select(selectedFields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        list = list.sort(sortBy);
    } else {
        list = list.sort('-createdAt');
    }

    // Page and limit
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const prevItems = (page - 1) * limit;
    const nextItems = page * limit;
    const total = await model.countDocuments();
    list = list.skip(prevItems).limit(limit);

    const data = await list;

    // Pagination
    const pagination = {
        page,
        results: data.length
    };

    if (nextItems < total) {
        pagination.nextPage = page + 1;
    }

    if (prevItems > 0) {
        pagination.prevPage = page - 1;
    }

    res.extendedResults = {
        success: true,
        total,
        pagination,
        data
    }

    next();
}

module.exports = extendedResults;