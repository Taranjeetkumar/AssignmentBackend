const mongoose = require('mongoose');

const CommunicationSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    audienceSegmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AudienceSegment' },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
    message: { type: String },
    deliveryStatus: {
        type: String, enum: ["pending", "sent"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model('Communication_log', CommunicationSchema);