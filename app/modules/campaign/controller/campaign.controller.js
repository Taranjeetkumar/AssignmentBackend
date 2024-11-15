const asyncHandler = require('../../../middleware/async');
const ErrorResponse = require('../../../helper/errorResponse');
const Customer = require('../../customer/models/customer.model');
const Campaign = require('../models/campaign.model');

//@desc Campaign Create
//@routes POST/api/v1/campaign/create
//@access Public 
exports.campaignCreate = asyncHandler(async (req, res, next) => {
    const { name, audienceSegmentId, message, startDate, endDate } = req.body;
    const segmentData = { name, audienceSegmentId, message, startDate, endDate };
    const campaign = new Campaign(segmentData);
    await campaign.save();

    res.status(200).json({ success: true, message: 'Campaign created Successfully' });
});

//@desc Campaign Listing
//@routes POST/api/v1/campaign/list
//@access Public 
exports.campaignList = asyncHandler(async (req, res, next) => {
    const audience = await Campaign.find({}).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: audience,
    });
});