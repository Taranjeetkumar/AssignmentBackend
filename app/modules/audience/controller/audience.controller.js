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
            if(conditionType == "and"){
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

            if(conditionType =='or'){
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

const updateDeliveryStatus = (logId) => {
    const status = Math.random() < 0.9 ? 'SENT' : 'FAILED'; // 90% SENT, 10% FAILED

    const logEntry = Communication.findById(logId);
    if (logEntry) {
        logEntry.deliveryStatus = status;
        Communication.findByIdAndUpdate(logId, logEntry);

    }
};

const sendPersonalizedMessage = (customerId, message, communicationId) => {
    const customer = Customer.findById(customerId);
    if (!customer) return null;

    // Replace [Name] placeholder in message
    const personalizedMessage = message.replace('[Name]', customer.name);
    // Create a new log entry in communications log
    const logEntry = {
        message: personalizedMessage,
        deliveryStatus: 'pending', // Initial status
    };

    // Add log entry to communications log
    Communication.findByIdAndUpdate(communicationId, logEntry);

    // Trigger delivery receipt to update status
    setTimeout(() => {
        updateDeliveryStatus(communicationId);
    }, 1000);

    return logEntry;
};

//@desc Send Text Message
//@routes POST/api/v1/audience/send/,essage
//@access Public 
exports.sendTextMessage = asyncHandler(async (req, res, next) => {
    const { audienceSegmentId, message } = req.body;

    let communicationRes = await Communication.findOne({ audienceSegmentId: audienceSegmentId });
    let allUsers = communicationRes?.users;
    console.log("all users ::  ", allUsers);

    const logEntries = allUsers.map((customerId) => sendPersonalizedMessage(customerId, message, communicationRes._id));

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