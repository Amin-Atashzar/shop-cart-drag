const animated = { value: "animated", isAnimate: true };
let cart = [];
const products = [
  {
    id: 1,
    title: "XS Red",
    price: 1000,
    imageSrc: "./images/xs-red.jpg",
    inStock: 3
  },
  {
    id: 2,
    title: "Note 9",
    price: 800,
    imageSrc: "./images/note9.jpg",
    inStock: 4
  },
  {
    id: 3,
    title: "S 9",
    price: 700,
    imageSrc: "./images/s9.jpg",
    inStock: 6
  },
  {
    id: 4,
    title: "Mate X",
    price: 600,
    imageSrc: "./images/huawey-mateX.jpg",
    inStock: 10
  }
];

const listenDragStart = () => {
  document.addEventListener("dragstart", function(e) {
    const id = e.target.dataset["productId"];
    e.dataTransfer.setData("srcId", e.srcElement.parentNode.id);
    e.dataTransfer.setData("id", id);
  });
};

const listenDragOver = () => {
  document.addEventListener("dragover", function(e) {
    e.preventDefault();
  });
};

const listenDrop = () => {
  document.addEventListener("drop", function(e) {
    const targetId = e.dataTransfer.getData("srcId");
    const id = e.dataTransfer.getData("id");
    if (e.target.id === "drop") {
      buy(Number(id));
    } else if (e.target.id === "delete" && targetId !== "products") {
      deleteProduct(Number(id));
    }

    e.preventDefault();
  });
};

const addToCart = (product, cart) => {
  const productInCart = cart.find(i => i.id === product.id);
  if (productInCart) {
    productInCart.count++;
  } else {
    const cartItem = { ...product, count: 1 };
    delete cartItem.inStock;
    cart.push(cartItem);
  }
};

const validateCart = (cart, products) =>
  cart.reduce((c, item) => {
    if (item.count > products.find(p => p.id === item.id).inStock) {
      c = false;
    }
    return c;
  }, true);

const setInvoiceClass = () => {
  const element = document.getElementById("invoice");
  if (cart.length > 0) {
    element.classList.remove("empty");
    element.classList.add("fill");
  } else {
    element.classList.remove("fill");
    element.classList.add("empty");
  }
};

const printProducts = () => {
  let root = document.getElementById("products");
  root.innerHTML = "";
  products
    .map(product => ({
      ...product,
      inStock:
        product.inStock -
        cart.filter(i => i.id === product.id).reduce((c, item) => item.count, 0)
    }))
    .filter(item => item.inStock > 0)
    .forEach(product => {
      const { title, imageSrc, inStock, price, id } = product;
      const element = `<div class="cart ${
        animated.value
      }" draggable="true" data-product-id='${id}'>
        <div class="image">
          <img draggable="false" src="${imageSrc}" alt="${title}" />
        </div>
        <div class="details">
          <ul>
            <li>
              <span>Title :</span>
              <p>${title}</p>
            </li>
            <li>
              <span>price :</span>
              <p>${price}$</p>
            </li>
            <li>
              <span>inStock :</span>
              <p>${inStock}</p>
            </li>
          </ul>
        </div>
      </div>`;
      root.innerHTML += element;
    });
  setAnimation(animated);
};

const printInvoice = () => {
  setInvoiceClass();
  const ul = document.getElementById("printInvoice");
  ul.innerHTML = "";
  cart
    .filter(i => i.count > 0)
    .forEach(item => {
      const { price, count, title, imageSrc, id } = item;
      const element = `<li>
  <div class="cart" draggable="true" data-product-id="${id}">
    <div class="image">
      <img
        draggable="false"
        src="${imageSrc}"
        alt="${title}"
      />
    </div>
    <div class="details">
      <ul>
        <li>
          <span>Title :</span>
          <p>${title}</p>
        </li>
        <li>
          <span>price :</span>
          <p>${price}$</p>
        </li>
        <li>
          <span>count :</span>
          <p>${count}</p>
        </li>
      </ul>
    </div>
    <div class="total">
      <p><span>Total :</span>${price * count}</p>
    </div>
  </div>
</li>`;
      ul.innerHTML += element;
    });
};

const deleteProduct = id => {
  const draftCart = cart.map(item => ({ ...item }));
  draftCart.find(i => i.id === id).count--;
  cart = draftCart.filter(i => i.count > 0);
  printProducts();
  printInvoice();
};

const buy = id => {
  const draftCart = cart.map(item => ({ ...item }));
  addToCart(products.find(p => p.id === id), draftCart);
  if (validateCart(draftCart, products)) {
    cart = draftCart;
    printProducts();
    printInvoice();
  } else {
    alert();
  }
};

const setAnimation = anim => {
  if (anim.isAnimate) {
    anim.isAnimate = false;
    anim.value = "";
  }
};

printProducts();
listenDragStart();
listenDrop();
listenDragOver();
