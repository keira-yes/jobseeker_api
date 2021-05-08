const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true,
        maxlength: [60, 'No more than 60 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a job description']
    },
    positionType: {
        type: String,
        required: [true, 'Please add a job type']
    },
    salary: {
        type: Number,
        required: [true, 'Please add a salary']
    },
    level: {
        type: String,
        required: [true, 'Please add a job position level']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
        required: true
    }
});

module.exports = mongoose.model('Job', JobSchema);