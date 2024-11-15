const express = require('express');
const router = express.Router();

const { customerCreate, customerList} = require('../controller/customer.controller');

router.post('/create', customerCreate);
router.get('/', customerList);


module.exports = router;
