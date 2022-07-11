const Product = require('../model/product');
const cartRepository = require('../repository/cart-repository');
const productRepository = require('../repository/product-repository');
const sessionRepository = require('../repository/session-repository');

module.exports.getCart = function (request, response) {
    const user = sessionRepository.getUserBySession(request.headers.session);
    const cart = cartRepository.getCart(user);

    if (cart) {
        cartRepository.totalCartPrice(cart);
        response.json(JSON.parse(JSON.stringify(cart, (key, value) => {
            if (key == 'user') { return undefined; }
            return value;
        })));
    } else {
        response.json({ items: [] });
    }
}

module.exports.addItem = function (request, response) {
    const user = sessionRepository.getUserBySession(request.headers.session);
    if (!request.body || !request.body.id) {
        response.status(400).json({ message: 'Validation error', fields: ['id'] });
        return;
    }
    const item = productRepository.getProductById(request.body.id);
    if (!item) {
        response.status(404).json({ message: 'Product not found!' });
        return;
    }
    if (item.stock <= 0) {
        response.status(400).json({ message: 'Product not available' });
        return;
    }
    const cartItem = cartRepository.addItem(user, item);

    response.status(201).json(JSON.parse(JSON.stringify(cartItem, (key, value) => {
        if (key == 'user') {
            return undefined;
        }
        return value;
    })));
}

module.exports.increaseQuantity = function (request, response) {
    const user = sessionRepository.getUserBySession(request.headers.session);
    if (!request.params || !request.params.id) {
        response.status(400).json({ message: 'Validation error', fields: ['id'] });
        return;
    }
    const item = productRepository.getProductById(request.params.id);
    if (!item) {
        res.status(404).json({ message: 'Product not found!' });
        return;
    }
    if (item.stock <= 0) {
        response.status(400).json({ message: 'Out of stock' });
        return;
    }
    try {
        let cartItem = cartRepository.increaseQuantity(user, item);
        response.json(cartItem);
    } catch (e) {
        response.status(404).json({ message: e.message });
    }
}

module.exports.decreaseQuantity = function (request, response) {
    const user = sessionRepository.getUserBySession(request.headers.session);
    if (!request.params || !request.params.id) {
        response.status(400).json({ message: 'Validation error', fields: ['id'] });
        return;
    }
    const item = productRepository.getProductById(request.params.id);
    if (!item) {
        res.status(404).json({ message: 'Product not found!' });
        return;
    }
    try {
        let cartItem = cartRepository.decreaseQuantity(user, item);
        response.json(cartItem);
    } catch (e) {
        response.status(404).json({ message: e.message });
    }
}

module.exports.placeOrder = function (request, response) {
    const user = sessionRepository.getUserBySession(request.headers.session);
    const cart = cartRepository.getCart(user);
    let valid = true;
    if (!cart) {
        response.status(404).json({ message: 'Cart is not available' });
    }

    if (!cart.items || cart.items.length == 0) {
        response.status(400).json({ message: 'Cart is empty' });
    }

    cart.items.forEach(function (item) {
        const product = productRepository.getProductById(item.product.id);
        if (product.stock < item.count) {
            response.status(400).json({ message: `Not enough stock for ${product.name}` });
            valid = false;
            return;
        }
    });

    if(!valid){
        return;
    }
    cart.items.forEach(function (item) {
        const product = productRepository.getProductById(item.product.id);
        product.stock -= item.count;
    });

    cartRepository.removeCart(cart);
    response.json({ items: [] });
}

