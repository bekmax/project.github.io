const router = require('express').Router();
const cartController = require('../controller/cart-controller');

router.get('/', cartController.getCart);
router.post('/', cartController.addItem);

router.put('/item/:id/plus', cartController.increaseQuantity);
router.put('/item/:id/minus', cartController.decreaseQuantity);

router.post('/order', cartController.placeOrder);

module.exports = router;