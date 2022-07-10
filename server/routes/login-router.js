const router = require('express').Router();
const loginController = require('../controller/login-controller')

router.post('/login', loginController.login);

module.exports = router;

