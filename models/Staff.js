const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    staffID: {
        type: Number,
        required: true,
        // autoincrement: true,
        unique: true
    },
    staffName: {
        type: String,
        required: true
    },
    shiftID: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Manager', 'Chef', 'Waiter'], // Example roles
        default: 'Waiter'
    }
});

const Staff = mongoose.model('Staff', StaffSchema);
module.exports = Staff;