const express = require('express');
const router = express.Router();

const { calculateAudience, audienceCreate, audienceList,communicationCreate, sendTextMessage } = require('../controller/audience.controller');
// const { protect, authorize } = require('../../../middleware/auth');

router.post('/calculate', calculateAudience);
router.post('/create',audienceCreate);
router.post('/communication/create', communicationCreate);
router.post('/send/text', sendTextMessage);
router.get('/', audienceList);

module.exports = router;
