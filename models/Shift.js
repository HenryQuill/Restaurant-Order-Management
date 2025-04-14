const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
    shiftID: {
        type: Number,
        required: true,
        // autoincrement: true,
        unique: true
    },
    shiftName: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
});

const Shift = mongoose.model('Shift', ShiftSchema);
module.exports = Shift;