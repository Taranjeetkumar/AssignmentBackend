// const { msg } = require('../../../../config/message');
const asyncHandler = require('../../../middleware/async');
const ErrorResponse = require('../../../helper/errorResponse');
const Order = require('../models/order.model');
const Customer = require('../../customer/models/customer.model');
const publishData = require('../../../redis/publisher');

//@desc Order Create
//@routes POST/api/v1/order/create
//@access Public 
exports.orderCreate = asyncHandler(async (req, res, next) => {
    let { customerId, items, totalAmount } = req.body;

    totalAmount = items.reduce((accumulator, item) => {
        return accumulator + item.quantity * item.price;
    }, 0);

    if (!customerId || !items || !totalAmount) {
        return res.status(400).json({ error: 'Customer ID, items, and total amount are required' });
    }
    const orderData = { customerId, items, totalAmount };
    const order = new Order(orderData);
    await order.save();


    let allUserOrders = await Order.find({ customerId: customerId });
    let spentTotal = allUserOrders.reduce((accumulator, item) => {
        return accumulator + item.totalAmount
    }, 0);

    console.log("vdhj:    ", spentTotal);
    await Customer.findByIdAndUpdate(customerId, { totalAmountSpent: spentTotal }, { new: true, runValidators: true })

    res.status(200).json({ success: true, message: 'Order data published' });
});


//@desc Order Listing
//@routes POST/api/v1/order/list
//@access Public 
exports.orderList = asyncHandler(async (req, res, next) => {
    const order = await Order.find({});

    res.status(200).json({
        success: true,
        order: order,
    });
});

//@desc Order details
//@routes POST/api/v1/order/details
//@access Public 
exports.orderDetails = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorResponse(`Order is not Found With id ${req.params.id}`, 401));
    }
    res.status(200).json({
        success: true,
        order: order,
    });
});

//@desc Order delete
//@routes POST/api/v1/order/delete
//@access Public 
exports.orderDelete = asyncHandler(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        order: "order Deleted",
    });
});

