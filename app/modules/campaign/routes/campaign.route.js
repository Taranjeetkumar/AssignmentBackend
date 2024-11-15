const express = require('express');
const router = express.Router();
const { campaignCreate, campaignList } = require('../controller/campaign.controller');

router.post('/create',campaignCreate);
router.get('/', campaignList);

module.exports = router;
