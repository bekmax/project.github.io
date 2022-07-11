const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const loginRouter = require('./routes/login-router');
const productRouter = require('./routes/product-router');
const cartRouter = require('./routes/cart-router');

const authentication = require('./auth/authentication');
const auth = authentication.authenticate;

app.use(express.static('asset'));
app.use('/asset', express.static('img'));

app.use('/auth', loginRouter);
app.use('/products', auth, productRouter);
app.use('/cart', auth, cartRouter);





app.listen(port, () => {
    console.log(`Application is Running on ${port}`);
});