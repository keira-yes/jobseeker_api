const mongoose = require('mongoose');
const slugify = require('slugify');

const CompanySchema = new mongoose.Schema({
   name: {
       type: String,
       required: [true, 'Please add a company name'],
       unique: true,
       trim: true,
       maxlength: [60, 'No more than 60 characters']
   },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a company description'],
        unique: true,
        trim: true,
        maxlength: [2000, 'No more than 2000 characters']
    },
    website: {
        type: String,
        match: [/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/, 'Please add a valid URL']
    },
    phone: {
        type: String,
        maxlength: [20, 'No more than 20 characters']
    },
    email: {
        type: String,
        match: [/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/, 'Please add a valid e-mail']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        // Using mongoose GeoJSON
        type: {
            type: String,
            enum: ['Point'],
            // required: true
        },
        coordinates: {
            type: [Number],
            // required: true,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
       type: [String],
        required: true
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating can not be more than 10']
    },
    averageSalary: Number,
    photo: {
        type: String,
        default: 'default-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
       type: Date,
        default: Date.now
    }
});

// Create company slug
CompanySchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

module.exports = mongoose.model('Company', CompanySchema);