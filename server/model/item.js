module.exports = class Item{
    constructor(product, count){
        this.product = product;
        this.count = count;
        this.totalPrice = product.price;
    }

    static create(product){
        return new Item(product, 1);
    }
}