document.addEventListener('DOMContentLoaded', () => {
    // --- DECODE TOKEN ---
    function decodeToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Failed to decode token:", e);
            return null;
        }
    }

    // --- LOGOUT FUNCTION ---
    function logout() {
        localStorage.removeItem('token');
        // Redirect to login page to reflect logged-out state
        window.location.href = '/login.html';
    }

    // --- UPDATE NAVBAR ---
    function updateNavbar() {
        const navbar = document.querySelector('nav.navbar');
        if (!navbar) return;

        const token = localStorage.getItem('token');
        const loginLink = navbar.querySelector('a[href="login.html"]');
        const cartLink = navbar.querySelector('a[href="cart.html"]');

        // Remove any dynamically added links first to avoid duplicates
        navbar.querySelectorAll('.dynamic-link').forEach(link => link.remove());

        if (token) {
            // --- USER IS LOGGED IN ---
            if (loginLink) loginLink.style.display = 'none'; // Hide original login link

            // Add "Log Out" button
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.textContent = 'Logout';
            logoutBtn.classList.add('dynamic-link'); // Mark as dynamic
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
            navbar.insertBefore(logoutBtn, null); // Insert as last item

            // Add "Admin Panel" link if admin
            const decoded = decodeToken(token);
            if (decoded && decoded.role === 'admin') {
                const adminLink = document.createElement('a');
                adminLink.href = 'admin.html';
                adminLink.textContent = 'Admin Panel';
                adminLink.classList.add('dynamic-link'); // Mark as dynamic
                navbar.insertBefore(adminLink, logoutBtn); // Insert before logout button
            }
        } else {
            // --- USER IS LOGGED OUT ---
            if (loginLink) loginLink.style.display = ''; // Show original login link
        }
    }

    // --- INITIALIZE NAVBAR ---
    function initializeNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            fetch('navbar.html')
                .then(response => {
                    if (!response.ok) throw new Error('Navbar not found');
                    return response.text();
                })
                .then(data => {
                    navbarContainer.innerHTML = data;
                    updateNavbar(); // Update navbar AFTER it has been loaded
                })
                .catch(error => console.error("Error loading navbar:", error));
        }
    }

    // --- LOGIN FORM ---
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/index.html';
                } else {
                    alert(data.error || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please try again.');
            }
        });
    }

    // --- INITIALIZE PAGE ---
    initializeNavbar();

    // --- Additional logic for admin page ---
    if (window.location.pathname.endsWith('admin.html')) {
        const addProductFormContainer = document.getElementById('add-product-form-container');
        if (addProductFormContainer) {
            fetch('add_product_form.html')
                .then(response => response.text())
                .then(data => {
                    addProductFormContainer.innerHTML = data;
                    // --- AFTER loading the form, attach the event listener ---
                    const addProductForm = document.getElementById('addProductForm');
                    if (addProductForm) {
                        addProductForm.addEventListener('submit', handleAddProductSubmit);
                    }
                });
        }
    }

    // --- Handler for submitting the new product form ---
    async function handleAddProductSubmit(event) {
        event.preventDefault(); // Prevent default form submission (page reload)

        const form = event.target;
        const formData = new FormData(form);
        const productData = Object.fromEntries(formData.entries());

        // Ensure price is a number
        productData.price = parseFloat(productData.price);

        const token = localStorage.getItem('token'); // Get token from localStorage

        if (!token) {
            alert('Authentication error: You are not logged in.');
            window.location.href = '/login.html'; // Redirect to login
            return;
        }

        try {
            const response = await fetch('/admin/add-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add the Authorization header
                },
                body: JSON.stringify(productData)
            });

            const responseData = await response.json();
            if (response.ok) {
                alert('Product added successfully!');
                form.reset(); // Clear the form
            } else {
                alert(`Failed to add product: ${responseData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while adding the product. Please check the console for details.');
        }
    }
});
