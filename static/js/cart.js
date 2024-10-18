console.log('Data from Local Storage')

var updateBtns = document.getElementsByClassName('update-cart')

for (i = 0; i < updateBtns.length; i++) {
    updateBtns[i].addEventListener('click', function () {
        var productId = this.dataset.product
        var action = this.dataset.action
        console.log('productId:', productId, 'Action:', action)

        console.log('USER:', user)
        if (user === 'AnonymousUser') {
            console.log('User is not authenticated --------')
            console.log(productId, action)
            addCookieItem(productId, action)
            console.log("Passes this Test")
        } else {
            updateUserOrder(productId, action)
        }
    })
}

function updateUserOrder(productId, action) {
    console.log('User is authenticated, sending data...')

    var url = '/update_item/'

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'productId': productId, 'action': action})
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log('Data:', data)
            location.reload()
        });
}

function addCookieItem(productId, action) {
    console.log('User is not authenticated', productId, action);

    var cart = JSON.parse(localStorage.getItem('cart')) || {}; // Initialize cart

    if (action === 'add') {
        if (cart[productId] === undefined) {
            cart[productId] = {'quantity': 1};
        } else {
            cart[productId]['quantity'] += 1;
        }
    }

    if (action === 'remove') {
        if (cart[productId] && cart[productId]['quantity'] > 0) {
            cart[productId]['quantity'] -= 1;

            if (cart[productId]['quantity'] <= 0) {
                console.log('Item should be deleted');
                delete cart[productId];
            }
        } else {
            console.log('Cannot remove item, it does not exist in the cart');
        }
    }

    console.log('CART:', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    document.cookie = `cart=${JSON.stringify(cart)};path=/`;
    location.reload();
}
