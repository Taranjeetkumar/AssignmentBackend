const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: { type: String, required: true },
    audienceSegmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AudienceSegment' },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    startDate:{type:Date},
    endDate:{type:Date}
}, { timestamps: true });

module.exports = mongoose.model('Campaign', CampaignSchema);