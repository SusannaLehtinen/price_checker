// 1. Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (!productId) {
  alert('No product ID provided');
}

// 2. Fetch product data
fetch(`/admin/products/${productId}`)
  .then(res => res.json())
  .then(product => {
    // 3. Fill the form fields
    document.getElementById('name').value = product.name;
    document.getElementById('description').value = product.description;
    document.getElementById('price').value = product.price;
    document.getElementById('image').value = product.image || '';
  })
  .catch(err => {
    console.error('Error loading product:', err);
    alert('Failed to load product data');
  });

document.getElementById('editProductForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const updatedProduct = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
    image: document.getElementById('image').value
  };

  fetch(`/admin/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedProduct)
  })
    .then(res => res.json())
    .then(data => {
      alert('Product updated successfully');
      window.location.href = '/admin_products.html';
    })
    .catch(err => {
      console.error('Update error:', err);
      alert('Failed to update product');
    });
});
