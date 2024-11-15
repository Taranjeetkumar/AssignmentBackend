const user_route = require('./app/modules/user/routes/user.route');
const order_route =require('./app/modules/order/routes/order.route');
const customer_route =require('./app/modules/customer/routes/customer.route');
const audience_route = require('./app/modules/audience/routes/audience.route');
const campaign_route =require('./app/modules/campaign/routes/campaign.route');

module.exports = [
    {
        path: '/api/v1/user',
        handler: user_route
    },
    {
        path: '/api/v1/campaign',
        handler: campaign_route
    },
    {
        path: '/api/v1/order',
        handler: order_route
    },
    {
        path: '/api/v1/customer',
        handler: customer_route
    },
    {
        path: '/api/v1/audience',
        handler: audience_route
    }
]