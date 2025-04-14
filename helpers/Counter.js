const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    sequence_value: {
        type: Number,
        required: true
    }
});

const Counter = mongoose.model('Counter', CounterSchema);

async function getNextSequenceValue(sequenceName) {
    const result = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true } // Create the document if it doesn't exist
    );
    return result.sequence_value;
}

module.exports = getNextSequenceValue;