const cartModal = document.getElementById('s-modal');
const menu = document.getElementById('cart-menu');
const btnModal = document.querySelector('.c-btn__footer');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.querySelector('.c-total');
const btnCheckout = document.getElementById('checkout');
const btnCloseModal = document.getElementById('close-modal');
const cartCounter = document.querySelector('.cart-count');
const addressInput = document.getElementById('c-address');
const addressWarn = document.getElementById('address-warn');
const nameInput = document.getElementById('c-nome');
const inputWarn = document.querySelector('.incorrect')
let cart = [];
btnModal.addEventListener('click', function () {
  updateCart();
  cartModal.style.display = 'flex';
});
cartModal.addEventListener('click', function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = 'none';
  }
});
btnCloseModal.addEventListener('click', function () {
  cartModal.style.display = 'none';
});

menu.addEventListener('click', function (event) {
  let parentButton = event.target.closest('.c-cart');
  if (parentButton) {
    let name = parentButton.getAttribute('data-name');
    let price = parseFloat(parentButton.getAttribute('data-price'));
    addToCart(name, price);
  }
});
function addToCart(name, price) {
  const existingItem = cart.find((el) => el.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updateCart();
}

function updateCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  cart.forEach((item) => {
    const cartItem = document.createElement('div');

    cartItem.innerHTML = `
            <div class="c-order">
                <div class="info">
                    <h3>${item.name}</h3>
                    <p>Quantidade: <span id="order__amount">${item.quantity}</span></p>
                    <p>
                        <small>R$</small>
                        <span>${item.price}</span>
                    </p>
                </div>
                <button class="remove-item-modal" data-name="${item.name}">Remover</button>
            </div>
        `;
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItem);
  });
  cartTotal.textContent = total.toLocaleString('pt-Br', {
    style: 'currency',
    currency: 'BRL',
  });
  cartCounter.innerHTML = cart.length;
}

// remove item do cart modal

cartItemsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('remove-item-modal')) {
    const name = event.target.getAttribute('data-name');

    removeItem(name);
  }
});

function removeItem(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCart();
      return;
    }
    cart.splice(index, 1);
    updateCart();
  }
}

addressInput.addEventListener('input', function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    inputWarn.style.display = 'none';
    addressWarn.style.display = "none";
    addressInput.style.borderColor = '#0000007b';
    nameInput.style.borderColor = "#0000007b";
  }
});

// finalizar pedidos 
btnCheckout.addEventListener('click', function () {
  const isOpen = checkAssadosOpen();
  if (!isOpen) {
    alert("DU ASSADOS FECHADO NO MOMENTO")
    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === '' || nameInput.value === '') {
    inputWarn.style.display = 'flex';
    addressWarn.style.display = "flex";
    addressInput.style.borderColor = 'red';
    nameInput.style.borderColor = "red";
    return;
  }

  // enviar pedido para o whats
  const mapItems = cart.map((item) => {
    return `
      ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |
    `
  }).join("")

  const message = encodeURIComponent(mapItems)
  const phone = "4484498935"

  window.open(`https://wa.me/${phone}?text=${message} Cliente: ${nameInput.value} | Endereço: ${addressInput.value}`, "_blank")
  cart = [];
  updateCart();
});

// verificar a hora de atendimento
function checkAssadosOpen() {
  const data = new Date();
  const hour = data.getHours();
  const day = data.getDay();
  return (hour >= 9 && hour <= 23) && (day > 1 && day <= 7) 
}

const spanItem = document.getElementById("data-span")
const isOpen = checkAssadosOpen();
if(isOpen) {
  spanItem.style.backgroundColor = "#41ec63";
} else {
  spanItem.style.backgroundColor = "gray";
}