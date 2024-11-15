const express = require('express');
const router = express.Router();

const { orderCreate} = require('../controller/order.controller');
// const { protect, authorize } = require('../../../middleware/auth');

router.post('/create', orderCreate);


module.exports = router;
