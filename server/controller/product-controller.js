const productRepository = require('../repository/product-repository')

module.exports.getProducts = function (request, response, next) {
    response.json(productRepository.getProducts());
};

module.exports.getProductById = function(request, response, next){
    let id = request.params.id;
    let product = productRepository.getProductById(id);
    if(product){
        response.json(product);
    } else{
        response.status(404).json({message: 'Product not found'});
    }   
}

