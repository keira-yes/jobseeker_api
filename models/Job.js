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

// Static method of model to calculate average salary
JobSchema.statics.calculateAverageSalary = async function(companyId) {
    const salary = await this.aggregate([
        {
            $match: { company: companyId }
        },
        {
            $group: {
                _id: '$company',
                averageSalary: { $avg: '$salary' }
            }
        }
    ]);

    try {
      await this.model('Company').findByIdAndUpdate(companyId, {
          averageSalary: Math.ceil(salary[0].averageSalary / 10) * 10
      });
    } catch(err) {
        console.error(err);
    }
}

// Calculate average salary after save
JobSchema.post('save', function() {
    this.constructor.calculateAverageSalary(this.company);
});

// Calculate average salary before remove
JobSchema.pre('remove', function() {
    this.constructor.calculateAverageSalary(this.company);
});

module.exports = mongoose.model('Job', JobSchema);