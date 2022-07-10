const Product = require('../model/product');

let products = [];

module.exports.getProducts = function(){
    return products;
} 

module.exports.getProductById = function(id){
    const product = products.find(function(product){
        return product.id == id;
    });
    return product;
}


// Added boilerplate data for testing purposes
products.push(new Product(1, "Honda", 1.0, 'image', 1));
products.push(new Product(2, "Yamaha", 1.0, 'image', 2));
products.push(new Product(3, "Suzuki", 1.0, 'image', 3));
products.push(new Product(4, "Kawasaki", 1.0, 'image', 4));
products.push(new Product(5, "BMW", 1.0, 'image', 5));
products.push(new Product(6, "Ducati", 1.0, 'image', 6));
products.push(new Product(7, "Triumph", 1.0, 'image', 7));
products.push(new Product(8, "KTM", 1.0, 'image', 8));
products.push(new Product(9, "Harley-Davidson", 1.0, 'image', 9));

