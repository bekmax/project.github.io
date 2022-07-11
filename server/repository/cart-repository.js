const Cart = require('../model/cart');
const Item = require('../model/item');

let carts = [];

module.exports.getCart = function (user) {
    return carts.find(function (cart) {
        return cart.user.username === user.username;
    });
}

module.exports.getCartItem = function(user, product){
    let cart = carts.find(function(cart){
        return cart.user.username === user.username;
    });
    if(cart){
        return cart.items.find(function(item){
            return item.product.id === product.id;
        });
    }
    return null;
    
}
module.exports.removeCart = function(cart){
    const index = carts.findIndex(function(elem){
        return elem.user.username == cart.user.username;
    });
    if(index >= 0){
        carts.splice(index, 1);
    }
}

module.exports.addItem = function (user, product) {
    let cart = carts.find(function (cart) {
        return cart.user.username === user.username;
    });
    let cartItem = Item.create(product);
    if (cart) {
        const index = cart.items.findIndex(function (item) {
            return item.product.id == cartItem.product.id;
        });
        if (index >= 0) {
            cartItem = cart.items[index];
            cartItem.count++;
        } else {
            cart.items.push(cartItem);
        }
    } else {
        const items = [];
        items.push(cartItem);
        cart = new Cart(user, items);
        carts.push(cart);
    }
    totalItemsPrice(cartItem);
    return cartItem;
}

module.exports.increaseQuantity = function (user, product) {
    let cart = carts.find(function (cart) {
        return cart.user.username === user.username;
    });
    if (!cart) {
        throw Error('Cart does not exist');
    }
    const index = cart.items.findIndex(function (item) {
        return item.product.id == product.id
    });
    if (index >= 0) {
        cart.items[index].count++;
        totalItemsPrice(cart.items[index]);
        return cart.items[index];
    } else {
        throw Error('Item not found in the cart');
    }
}

module.exports.decreaseQuantity = function (user, product) {
    let cart = carts.find(function (cart) {
        return cart.user.username === user.username;
    });

    if (!cart) {
        throw Error('Cart does not exist');
    }
    const index = cart.items.findIndex(function (item) {
        return item.product.id == product.id
    });
    if (index >= 0) {
        cart.items[index].count--;
        totalItemsPrice(cart.items[index]);
        if (cart.items[index].count <= 0) {
            cart.items.splice(index, 1);
            return {};
        }
        return cart.items[index];
    } else {
        throw Error('Item not found in the cart');
    }
}

module.exports.totalCartPrice = function (cart) {
    cart.totalPrice = cart.items.reduce(function (prev, elem) {
        return prev + elem.totalPrice;
    }, 0);
}

function totalItemsPrice(item) {
    item.totalPrice = item.product.price * item.count;
}
