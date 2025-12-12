# ☕ Online Coffee Shop

A web application for an online coffee shop where users can browse coffee products, view details, add items to the cart, and place orders. The project includes user registration/login and an admin panel for managing products and orders.

---

## 📁 Project Structure

```

coffee_shop/
│
├── public/                     # Front-end (static files)
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   └── coffee/              # coffee images
│   ├── js/
│   │   ├── cart.js
│   │   ├── loadNavbar.js
│   │   ├── login.js
│   │   ├── main.js
│   │   ├── menu.js
│   │   ├── product.js
│   │   └── signup.js
│   ├── cart.html
│   ├── index.html
│   ├── login.html
│   ├── menu.html
│   ├── navbar.html
│   ├── product.html
│   └── signup.html
│
├── src/                         # Back-end (server-side)
│   ├── controllers/
│   │   ├── orderControllers.js
│   │   ├── productControllers.js
│   │   └── userControllers.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   └── routes/
│       ├── orderRoutes.js
│       ├── productRoutes.js
│       └── userRoutes.js
│
├── .env                         # Environment configuration
├── package.json                 # Node.js dependencies and scripts
└── server.js                    # Express server entry point

````

---

## ⚙️ Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/Artur-Nayman/coffee_shop.git  
   cd coffee_shop  
   ````

2. Install dependencies:

   ```bash
   npm install  
   ```

3. Create a `.env` file with your MySQL configuration:

   ```env
   DB_HOST=localhost  
   DB_USER=root  
   DB_PASS=your_password  
   DB_NAME=coffee_shop  
   PORT=3000  
   ```

4. Start the server:

   ```bash
   node server.js  
   ```

5. Open in your browser:

   ```
   http://localhost:3000  
   ```

---

## 💡 Features & Notes

* Registration / Login: logic is located in `src/controllers/userControllers.js`, and the frontend in `public/login.html` and `public/signup.html`.
* Navbar is loaded via `public/navbar.html` and `js/loadNavbar.js` to keep consistency across all pages.
* MySQL database: uses tables like `user`, `products`, `orders`, and `order_items`.
* Shopping cart: logic is implemented in `public/cart.html` and `js/cart.js`.
* Authentication middleware: `src/middleware/authMiddleware.js`.

---

## 🛠 Technologies

* Backend: **Node.js**, **Express**
* Database: **MySQL**
* Frontend: HTML, CSS, JavaScript (Fetch API)
* Authentication and CRUD operations for products and orders

---

## 🔧 Development

* Backend built with Express and route/controller structure
* Models located in `src/models`
* Services handle products, users, and orders logic
* Frontend is built without frameworks and communicates using Fetch API

---

## ℹ️ About the Project

This is an online coffee shop web application where customers can browse available products, add them to the cart, and place orders. An administrator can manage products and orders through an admin panel.

---
