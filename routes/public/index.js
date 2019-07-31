var express = require('express');
var router = express.Router();

var public_controller = require('../../controllers/public/publicController')

router.get('/',public_controller.index);

router.get('/test',public_controller.test);

module.exports = router;
