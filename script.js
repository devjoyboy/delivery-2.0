const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')

let cart = []

// ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener('click', function() {
    updateCartModal()
    cartModal.style.display = 'flex'
})

// FECHAR O MODAL QUANDO CLICAR FORA
cartModal.addEventListener('click', function(e) {
    if(e.target === cartModal){
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener('click', function() {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', function(e) {
    // console.log(e.target)
    let parentButton = e.target.closest('.add-to-cart-btn')

    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        // ADICIONAR ITEM AO CARRINHO
        addToCart(name, price)  
    }
})

// FUNÇÃO PARA ADICIONAR AO CARRINHO
function addToCart(name, price){
    const existigItem = cart.find(item => item.name === name)

    if(existigItem){
        //SE O ITEM JÁ EXISTE, AUMENTA A QUANTIDADE + 1
        existigItem.quantity += 1
        Toastify({
            text: "Item adicionado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "green",
            }
          }).showToast()
    } else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
        Toastify({
            text: "Item adicionado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "green",
            }
          }).showToast()
    }

    updateCartModal()

}

//ATUALIZA CARRINHO
function updateCartModal(){
    cartItemsContainer.innerHTML = ''
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn bg-red-500 px-6 rounded" data-name="${item.name}">
                    <i class="fa-solid fa-trash-can text-lg text-white"></i>
                </button>
            </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length

}

// FUNÇÃO PARA REMOVER O ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function (e){
    let parentButton = e.target.closest(".remove-from-cart-btn")
        if(parentButton){
            const name = parentButton.getAttribute("data-name")

            removeItemCart(name)

            Toastify({
                text: "Item removido!",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                  background: "#ef4444",
                }
              }).showToast()
        }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1){
        const item = cart[index]
        
        if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal()
            return
        }
            
        cart.splice(index, 1)
        updateCartModal()

    }

}

addressInput.addEventListener("input", function(e){
    let inputValue = e.target.value

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        Toastify({
            text: "Restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#ef4444",
            }
          }).showToast()
        return
    }

    if(cart.length === 0) return

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    // ENVIAR PEDIDO PARA API WHATSAPP
    const cartItems = cart.map((item) => {
        return (
            `
            ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |
            `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+5581989377831"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()
})
// VERIFICAR A HORA E MANIPULAR O CARD HORÁRIO
function checkRestaurantOpen(){
    const date = new Date()
    const hour = date.getHours()
    return hour >= 18 && hour < 23.30
    // TRUE = RESTAURANTE ESTÁ ABERTO
}

const spanItem = document.getElementById("date-span")
const openRestaurant = document.getElementById("open-restaurant")
const closeRestaurant = document.getElementById("close-restaurant")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-[#EF3D4D]")
    spanItem.classList.add("bg-[#6AB70A]")
    openRestaurant.classList.remove("hidden")
    closeRestaurant.classList.add("hidden")
}else{
    spanItem.classList.remove("bg-[#6AB70A]")
    spanItem.classList.add("bg-[#EF3D4D]")
    openRestaurant.classList.add("hidden")
    closeRestaurant.classList.remove("hidden")
}