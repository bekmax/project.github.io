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

const dirImg = '/img/';

// Added boilerplate data for testing purposes
products.push(new Product(1, "Honda CBR1000RR", 16499, `${dirImg}honda.png`, 5));
products.push(new Product(2, "Yamaha YZF R1", 17599, `${dirImg}yamaha.png`, 5));
products.push(new Product(3, "Suzuki GSX-S1000", 11299, `${dirImg}suzuki.png`, 5));
products.push(new Product(4, "Kawasaki NINJA H2", 27500, `${dirImg}kawasaki.png`, 5));
products.push(new Product(5, "BMW K1600 GT", 23895, `${dirImg}bmw.png`, 5));
products.push(new Product(6, "Ducati Streetfighter V2", 16995, `${dirImg}ducati.png`, 5));
products.push(new Product(9, "Harley-Davidson FAT BOY 114", 19530, `${dirImg}harleydavidson.png`, 5));

