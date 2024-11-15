const asyncHandler = require('../../../middleware/async');
const ErrorResponse = require('../../../helper/errorResponse');
const Customer = require('../models/customer.model');
const publishData = require('../../../redis/publisher');

//@desc Customer Create
//@routes POST/api/v1/customer/create
//@access Public 
exports.customerCreate = asyncHandler(async (req, res, next) => {

    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    const customerData = { name, email, phone, address, visits: Math.floor(Math.random() * 10) };
    const customer = new Customer(customerData);
    await customer.save();

    res.status(200).json({ success: true, message: 'Customer data published' });
});

//@desc Customer Listing
//@routes POST/api/v1/customer/list
//@access Public 
exports.customerList = asyncHandler(async (req, res, next) => {
    const customers = await Customer.find({});

    res.status(200).json({
        success: true,
        data: customers,
    });
});
