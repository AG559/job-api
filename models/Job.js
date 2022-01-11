const mongoose = require('mongoose');
const JobSchema = mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Please provide the company'],
        },
        status: {
            type: String,
            enum: ['pending', 'interview'],
            default: 'pending'
        },
        position: {
            type: String,
            required: [true, 'Please provide the position']
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide createdBy']
        },
    }, {
    timestamps: true
}
)

module.exports.Job = mongoose.model('Job', JobSchema);