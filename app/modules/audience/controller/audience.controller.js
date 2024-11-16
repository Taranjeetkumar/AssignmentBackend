const asyncHandler = require('../../../middleware/async');
const ErrorResponse = require('../../../helper/errorResponse');
const Customer = require('../../customer/models/customer.model');
const AudienceSegment = require('../models/audience.model');
const Communication = require('../models/communication_log');

//@desc Calculate Audience
//@routes POST/api/v1/audience/calculate
//@access Public 
exports.calculateAudience = asyncHandler(async (req, res, next) => {
    const { conditions, conditionType } = req.body;
    let customers = await Customer.find({});

    const filteredCustomers = customers.filter((customer) => {
        // Apply the conditions to each customer (simple example)
        return conditions.every(condition => {
            if (condition?.conditionType == "and") {
                if (condition.field === 'totalSpending' && condition.operator === '>') {
                    return customer.totalAmountSpent > condition.value;
                }
                if (condition.field === 'visits' && condition.operator === '<=') {
                    return customer.visits <= condition.value;
                }
                if (condition.field === 'lastVisit' && condition.operator === 'not visited in last') {
                    const today = new Date();
                    const lastVisit = new Date(customer.lastVisit);
                    const monthsDiff = (today.getFullYear() - lastVisit.getFullYear()) * 12 + today.getMonth() - lastVisit.getMonth();
                    return monthsDiff >= condition.value;
                }
                return true;
            }

            if (condition?.conditionType == 'or') {
                if (condition.field === 'totalSpending' || condition.operator === '>') {
                    return customer.totalAmountSpent > condition.value;
                }
                if (condition.field === 'visits' || condition.operator === '<=') {
                    return customer.visits <= condition.value;
                }
                if (condition.field === 'lastVisit' || condition.operator === 'not visited in last') {
                    const today = new Date();
                    const lastVisit = new Date(customer.lastVisit);
                    const monthsDiff = (today.getFullYear() - lastVisit.getFullYear()) * 12 + today.getMonth() - lastVisit.getMonth();
                    return monthsDiff >= condition.value;
                }
                return true;
            }

        });
    }).map((user) => user._id);


    res.status(200).json({ success: true, audienceSize: filteredCustomers.length, users: filteredCustomers, message: 'fetched successfully' });
});

//@desc Audience Create
//@routes POST/api/v1/audience/create
//@access Public 
exports.audienceCreate = asyncHandler(async (req, res, next) => {
    const { name, conditions, audienceSize, users } = req.body;

    const segmentData = { name, conditions, audienceSize, users };
    const segment = new AudienceSegment(segmentData);
    await segment.save();

    res.status(200).json({ success: true, message: 'Audience created Successfully' });
});

//@desc Communication Create
//@routes POST/api/v1/audience/create
//@access Public 
exports.communicationCreate = asyncHandler(async (req, res, next) => {
    const { audienceSegmentId, users } = req.body;
    const segmentData = { audienceSegmentId, users };
    const campaign = new Communication(segmentData);
    await campaign.save();

    res.status(200).json({ success: true, message: 'Communication created Successfully' });
});

const sendPersonalizedMessage = async (customerId, message, communicationId, status) => {
    const customer = await Customer.findById(customerId);
    if (!customer) return null;

    // Replace [Name] placeholder in message
    const personalizedMessage = message.replace('[Name]', customer.name);
    // Create a new log entry in communications log
    const logEntry = {
        message: personalizedMessage,
        deliveryStatus: status, // Initial status
    };
    // Add log entry to communications log
    await Communication.findByIdAndUpdate(communicationId, logEntry);
    await Customer.findByIdAndUpdate(customerId, { messageStatus: status });

    return logEntry;
};

//@desc Send Text Message
//@routes POST/api/v1/audience/send/,essage
//@access Public 
exports.sendTextMessage = asyncHandler(async (req, res, next) => {
    const { audienceSegmentId, message } = req.body;

    let communicationRes = await Communication.findOne({ audienceSegmentId: audienceSegmentId });
    let allUsers = communicationRes?.users;
    const totalItems = allUsers.length;
    const sentCount = Math.floor(totalItems * 0.9); // Calculate 90%

    // Shuffle the array to randomize
    allUsers = [...allUsers].sort(() => Math.random() - 0.5);
    const logEntries = allUsers.map(async (customerId, index) => {
        if (index < sentCount) {
            await sendPersonalizedMessage(customerId, message, communicationRes._id, "sent")
        }
        else {
            await sendPersonalizedMessage(customerId, message, communicationRes._id, "pending")
        }
    });

    res.status(200).json({
        success: true, message: 'Messages sent to target audience',
        communications: logEntries,
    });
});

//@desc Audience Listing
//@routes POST/api/v1/audience/list
//@access Public 
exports.audienceList = asyncHandler(async (req, res, next) => {
    const audience = await AudienceSegment.find({}).populate('users', 'name email');

    res.status(200).json({
        success: true,
        data: audience,
    });
});