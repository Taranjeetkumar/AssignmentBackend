const mongoose = require('mongoose');

const AudienceSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: String,
    conditions: Array,
    audienceSize: Number,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref:'Customer' }]
}, { timestamps: true });

module.exports = mongoose.model('Audience', AudienceSchema);