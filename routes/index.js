const express = require('express');
const router = express.Router();
const controller = require('../controller');

router.get('/', controller.main);
router.post('/check_login', controller.check_login);

module.exports = router;
