const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

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
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
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

// Create company slug with slugify
CompanySchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Create company location with node-geocoder
CompanySchema.pre('save', async function(next) {
    const location = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [location[0].longitude, location[0].latitude],
        formattedAddress: location[0].formattedAddress,
        street: location[0].streetName,
        city: location[0].city,
        state: location[0].stateCode,
        zipcode: location[0].zipcode,
        country: location[0].countryCode
    }

    // Do not save address in DB
    this.address = undefined;
    next();
})

module.exports = mongoose.model('Company', CompanySchema);