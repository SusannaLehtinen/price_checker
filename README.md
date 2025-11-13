# Online Coffee Shop (PHP + MySQL + MVC)

Since we are talking about an **Online Coffee Shop** built with **PHP + MySQL (phpMyAdmin)** using the **MVC architecture**, here is the optimal **project structure** to keep everything logical and scalable.

---

## 📁 **Recommended PHP-MVC Project Structure**

```

coffee_shop/
│
├── app/
│   ├── config/
│   │   └── database.php         # Database connection
│   │
│   ├── controllers/
│   │   ├── HomeController.php   # Home page
│   │   ├── ProductController.php# Product display
│   │   ├── AuthController.php   # Login/Signup
│   │   └── AdminController.php  # Admin panel
│   │
│   ├── models/
│   │   ├── User.php             # User model
│   │   ├── Product.php          # Product model
│   │   └── Order.php            # Order model
│   │
│   ├── views/
│   │   ├── home.php             # Home page
│   │   ├── menu.php             # Header
│   │   ├── product.php          # Product page
│   │   ├── login.php            # Login page
│   │   ├── signup.php           # Signup page
│   │   └── admin/
│   │       ├── dashboard.php    # Admin dashboard
│   │       ├── products.php     # Manage products
│   │       └── orders.php       # Manage orders
│   │
│   └── core/
│       ├── App.php              # Main router (URL handling)
│       ├── Controller.php       # Base controller class
│       └── Model.php            # Base model class
│
├── public/
│   ├── index.php                # Entry point (Front Controller)
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
│       └── coffee/...
│
├── .env                         # Configuration (DB access, etc.)
├── .htaccess                    # URL redirect → public/index.php
└── README.md                    # Project documentation

```

---

## 🔍 **Brief Explanation**

* **app/** — contains all application logic.  
* **controllers/** — handle requests, process data, and pass it to the corresponding **view**.  
* **models/** — interact with the database (fetching, creating, updating data).  
* **views/** — HTML + PHP files for rendering pages.  
* **core/** — base classes that form the MVC core.  
* **public/** — everything visible to the user (CSS, JS, images, index.php).  
* **.htaccess** — makes URLs look clean and friendly (e.g., `/product/1` instead of `?controller=product&id=1`).  




