const url = 'http://localhost:3000';

window.onload = async function () {

    if (sessionStorage.getItem('session')) {
        initializeContentPage();
    } else {
        hideShopContent();
        hideLogoutContent();
    }

    document.getElementById('loginButton').onclick = login;
    document.getElementById('logoutButton').onclick = logout;
}

async function initializeContentPage() {
    showLogoutContent();
    showShopContent();
    getProducts();
    getCartItems();
    document.getElementById('welcome').value = sessionStorage.getItem('username');
    document.getElementById('orderButton').onclick = placeOrder;
}

function hideShopContent() {
    document.getElementById('welcomePage').style.display = 'block';
    document.getElementById('shopPage').style.display = 'none';
}

function showShopContent() {
    document.getElementById('welcomePage').style.display = 'none';
    document.getElementById('shopPage').style.display = 'block';
}

function hideLogoutContent() {
    document.getElementById('logout').className = '';
    document.getElementById('logout').style.display = 'none';
    document.getElementById('login').className = 'd-flex';
    document.getElementById('login').style.display = 'flex!important';
}

function showLogoutContent() {
    document.getElementById('login').className = '';
    document.getElementById('login').style.display = 'none';
    document.getElementById('logout').className = 'd-flex';
    document.getElementById('logout').style.display = 'flex!important';
}

function hideCartTable() {
    document.getElementById('emptyCart').style.visibility = 'visible';
    document.getElementById('emptyCart').style.display = 'inherit';
    document.getElementById('cart').style.display = 'none';
    document.getElementById('cart').style.visibility = 'visible';
    document.getElementById('orderButton').style.display = 'none';
    document.getElementById('orderButton').style.visibility = 'visible';
}

function showCartTable() {
    document.getElementById('emptyCart').style.visibility = 'hidden';
    document.getElementById('emptyCart').style.display = 'none';
    document.getElementById('cart').style.visibility = 'visible';
    document.getElementById('cart').style.display = 'table';
    document.getElementById('orderButton').style.display = '';
    document.getElementById('orderButton').style.visibility = 'visible';
}

function logout() {
    sessionStorage.clear();
    hideShopContent();
    hideLogoutContent();
    document.getElementById('products').innerHTML = '';
    document.getElementById('cartItems').innerHTML = '';
}

async function login(event) {
    event.preventDefault();

    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    if (!username || !password) {
        return;
    }

    const response = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    });

    const body = await response.json();

    if (response.ok) {
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('session', body.session);

        initializeContentPage();

        username.value = '';
        password.value = '';

    } else {
        window.alert(body.message);
    }
}

async function getProducts() {

    const response = await fetch(`${url}/products/`, {
        headers: {
            'session': sessionStorage.getItem('session')
        }
    });
    const products = await response.json();

    let html = document.getElementById('products').innerHTML;

    let availableProducts = products.filter(p => p.stock > 0);
    if(availableProducts.length > 0){
        availableProducts.forEach(item => {
            html += `
            <tr>
            <td><img class="product_image" src="${url}${item.image}"/></td>
                <td scope="row">${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.stock}</td>
                <td>
                    <button class="btn btn-outline-primary" onclick="addItem(${item.id})"> <i class="bi bi-cart"></i>
                        Add to cart</button>
                </td>
            </tr>
            `;
        });
    } else{
        html += 'Bike store is empty'
    }
    
    document.getElementById('products').innerHTML = html;
}


async function getCartItems() {
    const response = await fetch(`${url}/cart`, {
        headers: {
            'session': sessionStorage.getItem('session')
        }
    });

    const cart = await response.json();

    if (!cart || !cart.items || cart.items.length == 0) {
        hideCartTable();
        return;
    } else {
        showCartTable();
    }


    cart.items.forEach(item => {
        createCartItemRow(item);
    });

    createTotalPriceRow(cart);

}

async function increaseCount(productId) {
    const response = await fetch(`${url}/cart/item/${productId}/plus`, {
        method: 'PUT',
        headers: {
            'session': sessionStorage.getItem('session')
        }
    });

    if (response.ok) {
        const cartItem = await response.json();

        document.getElementById(`cartItemQuantity${cartItem.product.id}`).setAttribute('value', cartItem.count);
        document.getElementById(`cartItemTotal${cartItem.product.id}`).innerHTML = `$${cartItem.totalPrice}`;
        updateCartTotalPrice(false);

    } else {
        const status = response.status;
        const error = await response.json();
        alert(error.message);
    }
}

async function decreaseCount(productId) {
    const response = await fetch(`${url}/cart/item/${productId}/minus`, {
        method: 'PUT',
        headers: {
            'session': sessionStorage.getItem('session')
        }
    });

    if (response.ok) {
        const cartItem = await response.json();

        if (cartItem.count) {
            document.getElementById(`cartItemQuantity${cartItem.product.id}`).setAttribute('value', cartItem.count);
            document.getElementById(`cartItemTotal${cartItem.product.id}`).innerHTML = `$${cartItem.totalPrice}`;
            updateCartTotalPrice(false);
        } else {
            const row = document.getElementById(`cartItemRow${productId}`)
            row.parentNode.removeChild(row);

            if (document.getElementById("cartItems").children.length <= 1) {
                document.getElementById("cartItems").removeChild(document.getElementById("totalPriceRow"));
                hideCartTable();
            }
        }

    } else {
        const status = response.status;
        const error = await response.json();
        alert(error.message)
    }
}

async function addItem(productId) {
    const response = await fetch(`${url}/cart/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'session': sessionStorage.getItem('session')
        },
        body: JSON.stringify({ id: productId })
    });

    if (response.ok) {
        const cartItem = await response.json();
        showCartTable();
        if (document.getElementById(`cartItemRow${cartItem.product.id}`)) {
            document.getElementById(`cartItemQuantity${cartItem.product.id}`).setAttribute('value', cartItem.count);
            document.getElementById(`cartItemTotal${cartItem.product.id}`).innerHTML = `$${cartItem.totalPrice}`;
            updateCartTotalPrice(false);
        } else {
            document.getElementById("cartItems").deleteRow(document.getElementById("cartItems").children.length - 1);
            createCartItemRow(cartItem);
            updateCartTotalPrice(true);
        }

    } else {
        const status = await response.status;
        const error = await response.json();
        alert(error.message);
    }
}


function createCartItemRow(item) {

    let html = document.getElementById("cartItems").innerHTML;
    html += `
    <tr id="cartItemRow${item.product.id}">
            <th scope="row">${item.product.name}</th>
            <td>$${item.product.price}</td>
            <td id="cartItemTotal${item.product.id}">$${item.totalPrice}</td>
            <td>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-warning" onclick="decreaseCount(${item.product.id})">-</button>
                    <input type="text" value="${item.count}" size="5" class="text-center" readonly id="cartItemQuantity${item.product.id}">
                    <button type="button" class="btn btn-success" onclick="increaseCount(${item.product.id})">+</button>
                </div>
            </td>
        </tr>
    `;

    document.getElementById('cartItems').innerHTML = html;
}

async function updateCartTotalPrice(addRow) {
    const response = await fetch(`${url}/cart`, {
        headers: {
            'session': sessionStorage.getItem('session')
        }
    });

    const cart = await response.json();

    if (!cart || !cart.items || cart.items.length == 0) {
        hideCartTable();
        return;
    } else {
        showCartTable();
    }

    if (addRow) {
        createTotalPriceRow(cart);
    } else {
        document.getElementById("totalPrice").innerHTML = `Total: $${cart.totalPrice}`;
    }

}

function createTotalPriceRow(cart) {
    let html = document.getElementById("cartItems").innerHTML;

    html += `

    <tr id="totalPriceRow">
     <td colspan="4" class="text-end" id="totalPrice">
         Total: $${cart.totalPrice}
     </td>
    </tr>

    `;

    document.getElementById("cartItems").innerHTML = html;
}

async function placeOrder(event) {
    event.preventDefault();

    const response = await fetch(`${url}/cart/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'session': sessionStorage.getItem('session')
        }
    });

    if (response.ok) {
        await window.alert("Order placed successfully");

        const table = document.getElementById("cartItems");
        for (let i = 0; i < table.children.length; i++) {
            document.getElementById("cartItems").deleteRow(i);
        }
        hideCartTable();

        document.getElementById('products').innerHTML = '';
        getProducts();

    } else {
        const error = await response.json();
        alert(error.message);
    }

}