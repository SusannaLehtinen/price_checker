fetch('/admin/products')
  .then(res => res.json())
  .then(products => {

    console.log("API returned", products);



    const tbody = document.getElementById('productTableBody');

    products.forEach(product => {
      const tr = document.createElement('tr');

tr.innerHTML = `
  <td>${product.name}</td>
  <td>${product.description}</td>
  <td>€${product.price}</td>
  <td>${product.image || ''}</td>
  <td>
    <button class="edit-btn" data-id="${product.id}">Edit</button>
    <button class="delete-btn" data-id="${product.id}">Delete</button>  
  </td>
`;


    tbody.appendChild(tr);
    });
  })
  .catch(err => {
    console.error('Error loading products:', err);
  });

 document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;
    deleteProduct(id);
  }
});

// Edit click listener
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.dataset.id;
    window.location.href = `/admin_editproduct.html?id=${id}`;
  }
});

function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return; // User canceled
  }

  fetch(`/admin/products/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      location.reload(); // Refresh the page to update the table
    })
    .catch(err => {
      console.error("Delete error:", err);
    });
}
