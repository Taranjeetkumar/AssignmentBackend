const redis = require('redis');
const publisher = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

const publishData = (channel, data) => {
    console.log("publisgh : : ", publisher);
    publisher.publish(channel, JSON.stringify(data));
};

module.exports = publishData;
