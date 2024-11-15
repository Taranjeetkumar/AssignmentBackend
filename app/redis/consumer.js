const redis = require('redis');
const Customer = require('../modules/customer/models/customer.model');
const Order = require('../modules/order/models/order.model');

const consumer = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

consumer.subscribe('customer-data');
consumer.subscribe('order-data');

consumer.on('message', async (channel, message) => {
    const data = JSON.parse(message);
console.log("datata :" , data, "dhgf : : ", channel)
    if (channel === 'customer-data') {
        const customer = new Customer(data);
        await customer.save();
        console.log('Customer saved:', customer);
    } else if (channel === 'order-data') {
        const order = new Order(data);
        await order.save();
        console.log('Order saved:', order);
    }
});

module.exports = consumer;
