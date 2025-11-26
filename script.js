// Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
    // Розділяємо всі куки на окремі частини
    const cookies = document.cookie.split(';');


    // Шукаємо куки з вказаним ім'ям
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Видаляємо зайві пробіли


        // Перевіряємо, чи починається поточне кукі з шуканого імені
        if (cookie.startsWith(cookieName + '=')) {
            // Якщо так, повертаємо значення кукі
            return cookie.substring(cookieName.length + 1); // +1 для пропуску символу "="
        }
    }
    // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок або можна повернути null
    return '';
}

// Отримуємо кнопку "Кошик"
const cartBtn = document.getElementById('cartBtn')


// Навішуємо обробник подій на клік кнопки "Кошик"
cartBtn.addEventListener("click", function () {
    // Переходимо на сторінку кошика
    window.location.assign('card.html')
})


// Отримуємо дані про товари з JSON файлу
async function getProducts() {
    let response = await fetch("store_db.json");
    let products = await response.json();
    return products;
};


// Генеруємо HTML-код для карточки товару
function getCardHTML(product) {
    // Створюємо JSON-строку з даними про товар і зберігаємо її в data-атрибуті
    let productData = JSON.stringify(product)


    return `


        <article class="product-card">
            <div class="product-card__image-wrap">
                <img src="${product.image}" alt="Модель Elegance">
            </div>
            <h3 class="product-card__name">Модель <span>${product.title}</span></h3>
            <p class="product-card__price">Price: <span>${product.price} грн.</span></p>
            <button type="button" class="cart-btn" data-product='${productData}'>
            <svg class="bell" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12.5 17h-6.5v-14h-2" /><path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
            Купити</button>
        </article>


    `;
}


// Відображаємо товари на сторінці
getProducts().then(function (products) {
    let productsList = document.querySelector('.products-list')
    if (productsList) {
        products.forEach(function (product) {
            productsList.innerHTML += getCardHTML(product)
        })
    }


    // Отримуємо всі кнопки "Купити" на сторінці
    let buyButtons = document.querySelectorAll('.products-list .cart-btn');
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart);
        });
    }
})






// Створення класу кошика
class ShoppingCart {
    constructor() {
        this.items = {};
        this.cartCounter = document.querySelector('.cart-counter');// отримуємо лічильник кількості товарів у кошику
        this.cartElement = document.querySelector('#cart-items');
        this.loadCartFromCookies(); // завантажуємо з кукі-файлів раніше додані в кошик товари
    }


    // Додавання товару до кошика
    addItem(item) {
        if (this.items[item.title]) {
            this.items[item.title].quantity += 1; // Якщо товар вже є, збільшуємо його кількість на одиницю
        } else {
            this.items[item.title] = item; // Якщо товару немає в кошику, додаємо його
            this.items[item.title].quantity = 1;
        }
        this.updateCounter(); // Оновлюємо лічильник товарів
        this.saveCartToCookies();
    }


    // Зміна кількості товарів товарів
    updateQuantity(itemTitle, newQuantity) {
        if (this.items[itemTitle]) {
            this.items[itemTitle].quantity = newQuantity;
            if (this.items[itemTitle].quantity == 0) {
                delete this.items[itemTitle];
            }
            this.updateCounter();
            this.saveCartToCookies();
        }
    }


    // Оновлення лічильника товарів
    updateCounter() {
        let count = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            count += this.items[key].quantity; // рахуємо кількість усіх товарів
        }
        this.cartCounter.innerHTML = count; // оновлюємо лічильник на сторінці
    }


    // Зберігання кошика в кукі
    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }


    // Завантаження кошика з кукі
    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
            this.updateCounter();
        }
    }
    // Обчислення загальної вартості товарів у кошику
    calculateTotal() {
        let total = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            total += this.items[key].price * this.items[key].quantity; // рахуємо вартість усіх товарів
        }
        return total;
    }
}


// Створення об'єкта кошика
let cart = new ShoppingCart();




// Функція для додавання товару до кошика при кліку на кнопку "Купити"
function addToCart(event) {
    // Отримуємо дані про товар з data-атрибута кнопки
    const productData = event.target.getAttribute('data-product');
    const product = JSON.parse(productData);


    // Додаємо товар до кошика
    cart.addItem(product);
    console.log(cart);
}




// Функція пошуку товарів
function searchProducts(event) {
    event.preventDefault(); // Запобігає перезавантаженню сторінки при відправці форми


    let query = document.querySelector('#searchForm input').value.toLowerCase();
    let productsList1 = document.querySelector('.products-list');
    let productsList2 = document.querySelector('.products-list-2');
   
    // Очищуємо списки товарів
    productsList1.innerHTML = '';
    productsList2.innerHTML = '';


    // Функція для відображення товарів
    function displayProducts(products, productsList) {
        products.forEach(function (product) {
            if (product.title.toLowerCase().includes(query)) {
                productsList.innerHTML += getCardHTML(product);
            }
        });
    }


    getProducts().then(function (products) {
        displayProducts(products, productsList1);


        let buyButtons = productsList1.querySelectorAll('.cart-btn');
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart);
        });
    });


    getProducts2().then(function (products) {
        displayProducts(products, productsList2);


        let buyButtons = productsList2.querySelectorAll('.cart-btn');
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart);
        });
    });
}








//Запусти функцію initCarousel, коли HTML сторінки повністю завантажиться
document.addEventListener("DOMContentLoaded", initCarousel)


function initCarousel() {
    // Основні елементи
    let trackContainer = document.querySelector(".carousel-track-container")
    let track = document.querySelector(".carousel-track")
    let slides = document.querySelectorAll(".review-slide")


    let prev = document.querySelector(".arrow.prev")
    let next = document.querySelector(".arrow.next")
    let dots = document.querySelectorAll(".dot")


    let index = 0; // поточний слайд


function update() {
    // Отримуємо реальну ширину контейнера, в якому рухаються слайди.
    // Це важливо, бо ширина змінюється на різних екранах.
    let width = trackContainer.offsetWidth;


    // Зсуваємо весь ряд слайдів на значення index * width.
    // Наприклад, якщо index = 2 — зсув на два розміри ширини (показує 3-й слайд).
    track.style.transform = "translateX(-" + (index * width) + "px)"


    // Оновлюємо стилі крапок (індикаторів):
    // Спочатку знімаємо клас active з усіх крапок,
    // щоб потім додати активну лише одній.
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active")
    }


    // Робимо активною крапку, що відповідає поточному слайду.
    dots[index].classList.add("active")
}


// ---------------- КНОПКА "НАЗАД" ----------------
prev.addEventListener("click", function () {


    // Якщо ми на першому слайді — при кліку назад
    // переходимо на останній (циклічна карусель).
    if (index === 0) index = slides.length - 1


    // Якщо НЕ перший — просто зменшуємо індекс на 1.
    else index--


    // Оновлюємо положення слайдів та індикаторів.
    update()
})


// ---------------- КНОПКА "ВПЕРЕД" ----------------
next.addEventListener("click", function () {


    // Якщо ми на останньому слайді — при кліку вперед
    // повертаємося на перший.
    if (index === slides.length - 1) index = 0


    // Якщо НЕ останній — переходимо до наступного.
    else index++


    // Оновлюємо відображення.
    update()
})


// ---------------- КЛІК ПО КРАПЦІ ----------------
for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener("click", function () {


        // Читаємо номер слайду з data-index у HTML.
        // Наприклад: <span class="dot" data-index="1"></span>
        index = Number(this.dataset.index)


        // Після вибору крапки — оновлюємо слайдер.
        update()
    })
}


// ---------------- ЗМІНА РОЗМІРУ ЕКРАНА ----------------
window.addEventListener("resize", update)
// Коли ширина контейнера змінюється, ширина слайда теж змінюється.
// Без цього слайди з'їжджали б у неправильне місце.


// ---------------- СТАРТ КАРУСЕЛІ ----------------
update()
// Викликаємо оновлення один раз, щоб встановити початковий стан:
// - перемістити слайди правильно,
// - підсвітити правильну крапку.
}


// Знаходимо перемикач теми
var themeToggle = document.getElementById("themeToggle");


// При зміні стану перемикача - міняємо тему
themeToggle.addEventListener("change", function () {


    if (themeToggle.checked === true) {
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
    }


});






