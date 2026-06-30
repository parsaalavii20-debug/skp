/*======================================
KERMAN PART V4
Author : Parsa
======================================*/

const SETTINGS = {

PRICE_MULTIPLIER:1,

CURRENCY:"تومان",

PHONE:"09131989254",

WHATSAPP:"989131989254",

EMAIL:"parsaalavii10@gmail.com"

};

/*======================================
GLOBAL
======================================*/

const App={

products:[],

filteredProducts:[],

cart:JSON.parse(localStorage.getItem("cart")) || [],

currentProduct:null,

lastScroll:0,

elements:{}

};

/*======================================
CACHE DOM
======================================*/

App.cacheDOM=function(){
  

this.elements={

loader:document.getElementById("loader"),

header:document.getElementById("header"),

searchInput:document.getElementById("searchInput"),

searchButton:document.getElementById("searchButton"),

productsGrid:document.getElementById("productsGrid"),

categoryTrack:document.getElementById("categoryTrack"),

toast:document.getElementById("toast"),

toastText:document.getElementById("toastText"),

backTop:document.getElementById("backTop"),

cartButton:document.getElementById("cartButton"),

cartCount:document.getElementById("cartCount"),

cartOverlay:document.getElementById("cartOverlay"),

sideCart:document.getElementById("sideCart"),

cartItems:document.getElementById("cartItems"),

cartTotal:document.getElementById("cartTotal"),

closeCart:document.getElementById("closeCart"),

checkoutBtn:document.getElementById("checkoutBtn"),

menuButton:document.getElementById("menuButton"),

mobileMenu:document.getElementById("mobileMenu"),

searchToggle:document.getElementById("searchToggle"),

productModal:document.getElementById("productModal"),

closeModal:document.getElementById("closeModal"),

modalImage:document.getElementById("modalImage"),

modalCode:document.getElementById("modalCode"),

modalTitle:document.getElementById("modalTitle"),

modalInfo:document.getElementById("modalInfo"),

modalPrice:document.getElementById("modalPrice"),

quantityInput:document.getElementById("quantityInput"),

plusBtn:document.getElementById("plusBtn"),

minusBtn:document.getElementById("minusBtn"),

addToCartBtn:document.getElementById("addToCartBtn"),

customerModal:document.getElementById("customerModal"),

closeCustomerModal:document.getElementById("closeCustomerModal"),

customerName:document.getElementById("customerName"),

customerPhone:document.getElementById("customerPhone"),

customerAddress:document.getElementById("customerAddress"),

sendWhatsappBtn:document.getElementById("sendWhatsappBtn"),

sendEmailBtn:document.getElementById("sendEmailBtn")

};

};

/*======================================
LOAD PRODUCTS
======================================*/

App.loadProducts=function(){

this.products=(window.products || []).map(item=>{

return{

...item,

price:Math.round(item.price*SETTINGS.PRICE_MULTIPLIER)

};

});

this.filteredProducts=[...this.products];

};

/*======================================
FORMAT PRICE
======================================*/

App.price=function(number){

return number.toLocaleString("fa-IR")+" "+SETTINGS.CURRENCY;

};

/*======================================
TOAST
======================================*/

App.toast=function(text){

this.elements.toastText.textContent=text;

this.elements.toast.classList.add("show");

clearTimeout(this.toastTimer);

this.toastTimer=setTimeout(()=>{

this.elements.toast.classList.remove("show");

},2500);

};

/*======================================
LOADER
======================================*/

App.hideLoader=function(){

setTimeout(()=>{

this.elements.loader.style.opacity="0";

setTimeout(()=>{

this.elements.loader.remove();

},500);

},700);

};

/*======================================
INIT
======================================*/

App.init=function(){

this.cacheDOM();

this.loadProducts();

this.renderCategories();

this.renderProducts(this.products);

this.renderCart();

this.bindEvents();

this.hideLoader();

};

document.addEventListener(

"DOMContentLoaded",

()=>App.init()

);
/*======================================
RENDER CATEGORIES
======================================*/

App.renderCategories=function(){

const container=this.elements.categoryTrack;

container.innerHTML="";

const categories=[

"همه محصولات",

...new Set(this.products.map(item=>item.category))

];

categories.forEach(category=>{

const count=

category==="همه محصولات"

? this.products.length

: this.products.filter(item=>item.category===category).length;

const card=document.createElement("div");

card.className="category-card";

if(category==="همه محصولات"){

card.classList.add("active");

}

card.dataset.category=category;

card.innerHTML=`

<span class="category-name">${category}</span>

<span class="category-badge">${count}</span>

`;

card.onclick=()=>{

document
.querySelectorAll(".category-card")
.forEach(item=>item.classList.remove("active"));

card.classList.add("active");

this.elements.productsGrid.classList.add("loading");

if(category==="همه محصولات"){

this.filteredProducts=[...this.products];

}else{

this.filteredProducts=this.products.filter(
item=>item.category===category
);

}

this.renderProducts(this.filteredProducts);

setTimeout(()=>{

this.elements.productsGrid.classList.remove("loading");

},250);

};

container.appendChild(card);

});

};



/*======================================
SEARCH
======================================*/

App.searchProducts = function () {

const value = this.elements.searchInput.value
.trim()
.toLowerCase();

if (value === "") {

this.renderProducts(this.filteredProducts);

return;

}

const result = this.filteredProducts.filter(item => {

return (

item.title.toLowerCase().includes(value) ||

item.code.toString().includes(value) ||

item.category.toLowerCase().includes(value)

);

});

this.renderProducts(result);
setTimeout(()=>{

document.getElementById("productsSection").scrollIntoView({

behavior:"smooth",

block:"start"

});

},150);

// بعد از نمایش نتایج برو روی بخش محصولات
setTimeout(() => {

document.getElementById("productsSection").scrollIntoView({
    behavior: "smooth",
    block: "start"
});

}, 100);

};

/*======================================
PRODUCT CARD
======================================*/

App.productCard=function(product){

return`

<div class="product-card fade-up">

${product.badge ?

`<span class="product-badge badge-${product.badge.type}">

${product.badge.text}

</span>`

:""}

<div class="product-image">

<img

loading="lazy"

src="${product.image}"

alt="${product.title}">

</div>

<div class="product-info">

<div class="product-code">

کد : ${product.code}

</div>

<h3 class="product-title">

${product.title}

</h3>

<div class="product-price">

${this.price(product.price)}

</div>

<div class="product-actions">

<button class="quick-view" onclick="App.openProduct('${product.code}')">
    <img src="asset/shopping-cart.3.png" alt="">
    مشاهده و سفارش
</button>
${window.innerWidth>576?`



`:""}

</div>

</div>

</div>

`;

};

/*======================================
RENDER PRODUCTS
======================================*/

App.renderProducts=function(list) 
{

const grid=this.elements.productsGrid;


if(!list.length){

grid.innerHTML=`

<div class="empty-products">

محصولی پیدا نشد.

</div>

`;

return;


}

grid.innerHTML=list

.map(item=>this.productCard(item))

.join("");

this.observeCards();

};
/*======================================
OPEN PRODUCT
======================================*/

App.openProduct=function(code){

const product=this.products.find(

item=>String(item.code)===String(code)

);

if(!product) return;

this.currentProduct=product;

this.elements.modalImage.src=product.image;

this.elements.modalImage.alt=product.title;

this.elements.modalCode.textContent="کد : "+product.code;

this.elements.modalTitle.textContent=product.title;

this.elements.modalInfo.textContent=product.info;

this.elements.modalPrice.textContent=this.price(product.price);

this.elements.quantityInput.value=1;

this.elements.productModal.classList.add("active");

};

/*======================================
CLOSE PRODUCT
======================================*/

App.closeProduct=function(){

this.elements.productModal.classList.remove("active");

};

/*======================================
FAST ADD
======================================*/

App.fastAdd=function(code){

const product=this.products.find(

item=>String(item.code)===String(code)

);

if(!product) return;

const exist=this.cart.find(

item=>item.code===product.code

);

if(exist){

exist.quantity++;

}else{

this.cart.push({

...product,

quantity:1

});

}

this.saveCart();

this.renderCart();

this.toast("محصول به سبد خرید اضافه شد");

};

/*======================================
ADD FROM MODAL
======================================*/

App.addToCart=function(){

if(!this.currentProduct) return;

const qty=parseInt(

this.elements.quantityInput.value

);

const exist=this.cart.find(

item=>item.code===this.currentProduct.code

);

if(exist){

exist.quantity+=qty;

}else{

this.cart.push({

...this.currentProduct,

quantity:qty

});

}

this.saveCart();

this.renderCart();

this.toast("محصول به سبد خرید اضافه شد");

this.closeProduct();

};

/*======================================
SAVE CART
======================================*/

App.saveCart=function(){

localStorage.setItem(

"cart",

JSON.stringify(this.cart)

);

};

/*======================================
REMOVE ITEM
======================================*/

App.removeItem=function(code){

this.cart=this.cart.filter(

item=>item.code!==code

);

this.saveCart();

this.renderCart();

};

/*======================================
CHANGE QTY
======================================*/

App.changeQty=function(code,value){

const item=this.cart.find(

p=>p.code===code

);

if(!item) return;

item.quantity+=value;

if(item.quantity<=0){

this.removeItem(code);

return;

}

this.saveCart();

this.renderCart();

};

/*======================================
RENDER CART
======================================*/

App.renderCart=function(){

let html="";

let total=0;

let count=0;

this.cart.forEach(item=>{

count+=item.quantity;

total+=item.price*item.quantity;

html+=`

<div class="cart-item">

<img

src="${item.image}"

alt="${item.title}">

<div class="cart-item-info">

<div class="cart-item-title">

${item.title}

</div>

<div class="cart-item-price">

${this.price(item.price)}

</div>

<div class="cart-item-actions">

<button

onclick="App.changeQty('${item.code}',1)">

+

</button>

<span>

${item.quantity}

</span>

<button

onclick="App.changeQty('${item.code}',-1)">

-

</button>

<button

class="remove-item"

onclick="App.removeItem('${item.code}')">

🗑

</button>

</div>

</div>

</div>

`;

});

if(!html){

html=`

<div class="empty-products">

سبد خرید خالی است.

</div>

`;

}

this.elements.cartItems.innerHTML=html;

this.elements.cartTotal.textContent=

this.price(total);

this.elements.cartCount.textContent=count;

};
/*======================================
OPEN / CLOSE CART
======================================*/

App.openCart=function(){

this.elements.sideCart.classList.add("active");

this.elements.cartOverlay.classList.add("active");

};

App.closeCart=function(){

this.elements.sideCart.classList.remove("active");

this.elements.cartOverlay.classList.remove("active");

};

/*======================================
QUANTITY
======================================*/

App.plus=function(){

this.elements.quantityInput.value++;

};

App.minus=function(){

if(this.elements.quantityInput.value>1){

this.elements.quantityInput.value--;

}

};

/*======================================
HEADER
======================================*/

App.headerScroll=function(){

const current=window.scrollY;

if(current>120){

this.elements.header.classList.toggle(

"hide",

current>this.lastScroll

);

}else{

this.elements.header.classList.remove("hide");

}

this.lastScroll=current;

};

/*======================================
BACK TOP
======================================*/

App.backTop=function(){

this.elements.backTop.classList.toggle(

"show",

window.scrollY>500

);

};

/*======================================
ANIMATION
======================================*/

App.observeCards=function(){

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{

threshold:.15

});

document

.querySelectorAll(".fade-up")

.forEach(card=>observer.observe(card));

};

/*======================================
WHATSAPP
======================================*/

App.sendWhatsapp=function(){

const name=this.elements.customerName.value.trim();

const phone=this.elements.customerPhone.value.trim();

const address=this.elements.customerAddress.value.trim();

if(!name||!phone||!address){

this.toast("اطلاعات را کامل کنید");

return;

}

let message=`🛒 سفارش جدید

👤 ${name}

📞 ${phone}

📍 ${address}

--------------------

`;

let total=0;

this.cart.forEach(item=>{

const sum=item.price*item.quantity;

total+=sum;

message+=`${item.title}

تعداد : ${item.quantity}

${this.price(sum)}

--------------------

`;

});

message+=`جمع کل :

${this.price(total)}`;

window.open(

`https://wa.me/${SETTINGS.WHATSAPP}?text=${encodeURIComponent(message)}`,

"_blank"

);

};


/*======================================
EMAILJS
======================================*/

App.sendEmail = function () {

const customerName = this.elements.customerName.value.trim();
const customerPhone = this.elements.customerPhone.value.trim();
const customerAddress = this.elements.customerAddress.value.trim();

if(!customerName || !customerPhone || !customerAddress){

this.toast("لطفاً اطلاعات مشتری را کامل وارد کنید.");

return;

}

const products = this.cart.map(item=>{

return `• ${item.title}
کد: ${item.code}
تعداد: ${item.quantity}
قیمت: ${this.price(item.price)}
`;

}).join("\n");

const total = this.price(

this.cart.reduce((sum,item)=>sum+(item.price*item.quantity),0)

);

const params={

name:customerName,

phone:customerPhone,

address:customerAddress,

message:products,

total:total,

time:new Date().toLocaleString("fa-IR")

};

emailjs.send(

"service_uh00hul",

"template_k32aaed",

params

).then(()=>{

this.toast("✅ سفارش با موفقیت به ایمیل ارسال شد.");

this.elements.customerModal.classList.remove("active");

}).catch((error)=>{

console.log(error);

alert(JSON.stringify(error));

console.error(error);

this.toast("❌ ارسال ایمیل با خطا مواجه شد.");

});
};

/*======================================
EVENTS
======================================*/

App.bindEvents=function(){

// جستجو با دکمه
this.elements.searchButton.onclick=()=>{

this.searchProducts();

setTimeout(()=>{

document.getElementById("productsSection").scrollIntoView({

behavior:"smooth",

block:"start"

});

},150);

};

// جستجو با Enter
this.elements.searchInput.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

this.searchProducts();

setTimeout(()=>{

document.getElementById("productsSection").scrollIntoView({

behavior:"smooth",

block:"start"

});

},150);

}

});

this.elements.cartButton.onclick=()=>this.openCart();

this.elements.closeCart.onclick=()=>this.closeCart();

this.elements.cartOverlay.onclick=()=>this.closeCart();

this.elements.menuButton.onclick=()=>{

this.elements.mobileMenu.classList.toggle("active");

};

this.elements.closeModal.onclick=()=>this.closeProduct();

this.elements.addToCartBtn.onclick=()=>this.addToCart();

this.elements.plusBtn.onclick=()=>this.plus();

this.elements.minusBtn.onclick=()=>this.minus();

this.elements.checkoutBtn.onclick=()=>{

this.elements.customerModal.classList.add("active");

};

this.elements.closeCustomerModal.onclick=()=>{

this.elements.customerModal.classList.remove("active");

};

this.elements.sendWhatsappBtn.onclick=()=>this.sendWhatsapp();

this.elements.sendEmailBtn.onclick=()=>this.sendEmail();

this.elements.backTop.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

window.addEventListener("scroll",()=>{

this.headerScroll();

this.backTop();

});

document.addEventListener("keydown",e=>{

if(e.key==="Escape"){

this.closeProduct();

this.closeCart();

this.elements.customerModal.classList.remove("active");

}

});

this.elements.productModal.addEventListener("click",e=>{

if(e.target===this.elements.productModal){

this.closeProduct();

}

});

this.elements.customerModal.addEventListener("click",e=>{

if(e.target===this.elements.customerModal){

this.elements.customerModal.classList.remove("active");

}

});

};

/*======================================
END
======================================*/