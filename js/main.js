
const productsDiv = document.querySelector("#products");
const productCart = document.querySelector(".product-cart");

const noShoppingImage = document.querySelector(".no-shopping-image");
const carbonNeutral = document.querySelector(".carbon-neutral");
const confirmOrderButton = document.querySelector(".confirm-order");

let orderList = [];
let productNumbers = document.querySelector(".product-numbers");
let prodNums = 0;
let totalPrice = 0;


fetch('js/data.json')
  .then(response => response.json())
  .then(products => {
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productImageDiv = document.createElement("div");
        productImageDiv.classList.add("product-image");
        const imageAnchor = document.createElement("a");
        imageAnchor.href = "#";
        const productImage = document.createElement("img");
        productImage.src = product.image.desktop;
        productImage.alt = product.name;

        imageAnchor.append(productImage);
        productImageDiv.append(imageAnchor);
        productCard.append(productImageDiv);


        const productDetails = document.createElement("div");
        productDetails.classList.add("product-details");

        const productCategory = document.createElement("div");
        productCategory.classList.add("product-category");
        productCategory.classList.add("text-md");

        const category = document.createElement("span");
        category.textContent = product.name;

        productCategory.append(category);
        productDetails.append(productCategory);

        const productName = document.createElement("div");
        productName.classList.add("product-name");
        productName.classList.add("text-lg");

        const name = document.createElement("span");
        name.textContent = product.name;

        productName.append(name);
        productDetails.append(productName);

        const productPrice = document.createElement("div");
        productPrice.classList.add("product-price");
        productPrice.classList.add("text-lg");

        const price = document.createElement("span");
        price.textContent = "$" + product.price;

        productPrice.append(price);
        productDetails.append(productPrice);
        productCard.append(productDetails);

        // add-to-cart
        const addToCart = document.createElement("div");
        addToCart.classList.add("add-to-cart");
        const btn = document.createElement("button");
        btn.classList.add("add-to-cart-button");
        btn.type = "button";
        btn.classList.add("text-md")
        // btn.classList.add("hidden")

        const addCartIcon = document.createElement("img");
        addCartIcon.src = "assets/images/icon-add-to-cart.svg";
        addCartIcon.alt = "add to cart";

        const spanAddToCart = document.createElement("span");
        spanAddToCart.textContent = "Add To Cart";

        const firstAdd = document.createElement("div");
        firstAdd.classList.add("first-add");
        // firstAdd.classList.add("hidden");

        firstAdd.append(addCartIcon);
        firstAdd.append(spanAddToCart);
        
        btn.append(firstAdd);
        
        // Quantity Control
        const quantityControl = document.createElement("div");
        quantityControl.classList.add("quantity-control");
        quantityControl.id = "display-none";

        const incrementQuantity = document.createElement("div");
        incrementQuantity.classList.add("increment-product");
        incrementQuantity.classList.add("plus");

        const incrementImageIcon = document.createElement("img");
        incrementImageIcon.classList.add("plus-icon")
        incrementImageIcon.src = "assets/images/icon-increment-quantity.svg";
        incrementImageIcon.alt = "increment quantity";

        incrementQuantity.append(incrementImageIcon);
        quantityControl.append(incrementQuantity);

        // Quantity Value

        const productQuantityValue = document.createElement("div");
        productQuantityValue.classList.add("product-quantity-value");
        productQuantityValue.textContent = 1;

        quantityControl.append(productQuantityValue);

        // Decrement Quantity

        const decrementQuantity = document.createElement("div");
        decrementQuantity.classList.add("decrement-quantity");
        decrementQuantity.classList.add("minus");

        const decrementImageIcon = document.createElement("img");
        decrementImageIcon.classList.add("minus-icon")
        decrementImageIcon.src = "assets/images/icon-decrement-quantity.svg";
        decrementImageIcon.alt = "decrement quantity"

        decrementQuantity.appendChild(decrementImageIcon);
        quantityControl.append(decrementQuantity);

        btn.append(quantityControl);

        addToCart.append(btn);

        productCard.append(addToCart);

        // Append current product to products
        productsDiv.append(productCard);



        // Update interface after increment or decrement product quantity

        btn.addEventListener("click", (e) => {
            let quantityValue = Number(productQuantityValue.textContent);
            if (e.target.classList.contains("decrement-quantity") || e.target.classList.contains("minus-icon")) {
                if (quantityValue === 0) {
                    return;
                } else {
                    quantityValue--;    
					prodNums = parseInt(productNumbers.textContent);
					prodNums--;
					productNumbers.textContent = prodNums;
                }
                productQuantityValue.textContent = quantityValue;
            } else if (e.target.classList.contains("increment-product") || e.target.classList.contains("plus-icon")) {
					quantityValue++;
					prodNums = parseInt(productNumbers.textContent);
					prodNums++;
					productNumbers.textContent = prodNums;
					productQuantityValue.textContent = quantityValue;
            }
        })

        btn.addEventListener("click", (e) => {
            console.log(btn.querySelector(".first-add").style.display)
                if (getComputedStyle(btn.querySelector(".first-add")).display == "flex") {
                firstAdd.classList.add("hidden");
                btn.classList.add("reset-cart-btn");
                productImageDiv.classList.add("active");
                quantityControl.removeAttribute("id");

                const card = e.target.closest(".product-card");
                const productName = card.querySelector(".product-name span").textContent.trim();
                const productPrice = card.querySelector(".product-price span").textContent.trim().slice(1);
                const productEle = card.querySelector(".product-quantity-value");
                const quantity = parseInt(productEle.textContent);
                createOrder(productName, quantity, productPrice, productEle);
                prodNums = parseInt(productNumbers.textContent);
                prodNums++;
                productNumbers.textContent = prodNums;
            }
        })
    })

  });


//   create Order Function (one order in the product cart executed for each product)


function createOrder(order_name, order_quantity, order_price, product_quantity_element) {

	

	// Delete order if order quantity === 0

		if (Number(order_quantity) === 0) {
			updateTotalPrice();
			return;
		}

    const orderItem = document.createElement("div");
    orderItem.classList.add("order-item");
	orderItem.classList.add(order_name.split(" ").join("_"));
	orderList.push(order_name.split(" ").join("_"));

    const orderName = document.createElement("div");
    orderName.classList.add("order-name");
    const orderNameHeading = document.createElement("h4");
    orderNameHeading.textContent = order_name;

    orderName.append(orderNameHeading);
    orderItem.append(orderName);

    // order details

    const orderDetails = document.createElement("div");
    orderDetails.classList.add("order-details");
    
    const orderQuantity = document.createElement("span");
    orderQuantity.classList.add("order-quantity");
    orderQuantity.textContent = `${order_quantity}×`;

    orderDetails.append(orderQuantity);

    const orderPrice = document.createElement("span");
    orderPrice.classList.add("order-price");
    orderPrice.textContent = `@ $${order_price}`;

    orderDetails.append(orderPrice);

    const orderTotalPrice = document.createElement("span");
    orderTotalPrice.classList.add("order-total-price");
    orderTotalPrice.textContent = `$${Number(order_quantity * order_price)}`;

    orderDetails.append(orderTotalPrice);
    orderItem.append(orderDetails);

    const deleteIcon = document.createElement("div");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.classList.add("delete-hover-effect")

    deleteIcon.addEventListener("mouseover", () => {
        deleteIcon.querySelector("img").style.display = "none";
    })

    deleteIcon.addEventListener("mouseleave", () => {
        deleteIcon.querySelector("img").style.display = "block";
    })

	// Delete order button event 

	deleteIcon.addEventListener("click", () => {
		deleteIcon.parentElement.remove();

		const productNameTest = order_name.split(" ").join("_");
		orderList = orderList.filter(order => order !== productNameTest);

		prodNums = parseInt(productNumbers.textContent);
		prodNums -= parseInt(order_quantity);
		productNumbers.textContent = prodNums;
		product_quantity_element.textContent = 0;

		updateTotalPrice();
		
	})

    const deleteImage = document.createElement("img");
    deleteImage.src = "assets/images/icon-remove-item.svg";
    deleteImage.alt = "remove item";

    deleteIcon.append(deleteImage);
    orderItem.append(deleteIcon);
	productCart.append(orderItem);
	updateTotalPrice();
}


// Detect which button is pressed + or -


document.addEventListener("click", function (e) {

    const plus = e.target.closest(".increment-product");
    const minus = e.target.closest(".decrement-quantity");

    const target = plus ? plus : minus;
    let card = null;

    if (target) {
        card = target.closest(".product-card");
        
		// current product details

        const productName = card.querySelector(".product-name span").textContent.trim();
		const productPrice = card.querySelector(".product-price span").textContent.trim().slice(1);
        const productEle = card.querySelector(".product-quantity-value");
        let quantity = parseInt(productEle.textContent);

		const productNameTest = productName.split(" ").join("_");
		orderList = orderList.filter(order => order !== productNameTest);
		
		if (document.querySelector(`.${productNameTest}`)) {
			document.querySelector(`.${productNameTest}`).remove();
		}
        
		createOrder(productName, quantity, productPrice, productEle);

    }

})

// Create Total price Function

function createTotalPrice (price) {

	if (document.querySelector("#total-price")) {
		document.querySelector("#total-price").remove();
	}

	const orderTotal = document.createElement("div");
	orderTotal.classList.add("order-total");
	orderTotal.setAttribute("id", "total-price");

	const orderTotalHead = document.createElement("h4");
	orderTotalHead.textContent = "Order Total";

	orderTotal.append(orderTotalHead);

	const totalPrice = document.createElement("div");
	totalPrice.classList.add("total-price");
	totalPrice.classList.add("text-xl");
	totalPrice.textContent = `$${price}`;

	orderTotal.append(totalPrice);
	productCart.append(orderTotal);
}

// Update price function

function updateTotalPrice() {
    let total = 0;
    const allOrders = document.querySelectorAll(".order-item");
	
    allOrders.forEach(order => {
        const price = parseFloat(order.querySelector(".order-price").textContent.slice(3));
        const quantity = parseInt(order.querySelector(".order-quantity").textContent);
        total += price * quantity;
    });
	
    totalPrice = total;
    createTotalPrice(total);
}

const confirmButton = document.querySelector("#confirm-btn");
const orders = document.querySelector("#orderss");

confirmButton.addEventListener("click", () => {

	if (totalPrice > 0) {
            document.querySelectorAll(".order-item").forEach(order => {
            const orderCopy = order.cloneNode(true);
            const deleteIcon = orderCopy.querySelector(".delete-icon");
            deleteIcon.innerHTML = "";
            deleteIcon.style.border = "none";
            deleteIcon.style.fontWeight = "600";

            const totalPrice = orderCopy.querySelector(".order-total-price").cloneNode(true);
            orderCopy.querySelector(".delete-icon").append(totalPrice);

            orderCopy.querySelector(".order-total-price").remove();

            orders.append(orderCopy);

        })
        const totalPrice = document.querySelector("#total-price");
        const confirmMessageTotalPrice = document.querySelector("#confirm-message-total-price");
        console.log(confirmMessageTotalPrice);
        confirmMessageTotalPrice.append(totalPrice);
        console.log(totalPrice)

        const confirmMessageSection = document.querySelector(".confirm-message-section");

        confirmMessageSection.style.display = "flex";
        document.body.style.overflow = "hidden";

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

})

// Start new ordre button

const startNewOrder = document.querySelector("#new-order-btn");

    startNewOrder.addEventListener("click", () => {

        document.querySelector(".confirm-message-section").style.display = "none";
        document.body.style.overflow = "auto";

        document.querySelectorAll(".first-add").forEach(first_Add => {
            first_Add.classList.remove("hidden");
        })

        document.querySelectorAll(".quantity-control").forEach(control => {
            control.setAttribute("id", "display-none");
        })

        document.querySelectorAll(".add-to-cart-button").forEach(btn => {
            btn.classList.remove("reset-cart-btn");
        })

        document.querySelectorAll(".product-image").forEach(img => {
            img.classList.remove("active");
        })

        document.querySelectorAll(".order-item").forEach(order => {
            order.remove();
        })

        document.querySelectorAll(".product-quantity-value").forEach(quantity => {
            quantity.textContent = 1;
        })

        orderList = [];
        prodNums = 0;
        productNumbers.textContent = 0;
        totalPrice = 0;

        noShoppingImage.style.display = "flex";
        carbonNeutral.style.display = "none";
        confirmOrderButton.style.display = "none";
        
    })

    // no shopping image

    

    noShoppingImage.style.display = "flex";
    carbonNeutral.style.display = "none";
    confirmOrderButton.style.display = "none";


    document.addEventListener("click", () => {
        const ordersNumber = document.querySelectorAll(".order-item");
        if (ordersNumber.length >= 1) {
            noShoppingImage.style.display = "none";
            carbonNeutral.style.display = "flex";
            confirmOrderButton.style.display = "flex";
        }
    })
