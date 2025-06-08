import React, { useEffect, useState } from 'react';
import ProductForm from './ProductForm';

const API_URL = 'http://localhost:5042/';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchProducts = () => {
    fetch(`${API_URL}api/storewebapp/GetProducts`)
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(fetchProducts, []);

  const saveProduct = product => {
    const method = product.id ? 'PUT' : 'POST';
    const url = product.id
      ? `${API_URL}api/storewebapp/UpdateProduct/${product.id}`
      : `${API_URL}api/storewebapp/AddProduct`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }).then(() => {
      setEditing(null);
      fetchProducts();
    });
  };

  const deleteProduct = id => {
    fetch(`${API_URL}api/storewebapp/DeleteProduct/${id}`, {
      method: 'POST',
    }).then(() => fetchProducts());
  };

  return (
    <div className="manage-products">
      {editing && (
        <ProductForm
          initial={editing}
          onSave={saveProduct}
          onCancel={() => setEditing(null)}
        />
      )}
      {!editing && (
        <button onClick={() => setEditing({ title: '', description: '', imageUrl: '' })}>
          Add Product
        </button>
      )}
      <ul>
        {products.map(p => (
          <li key={p.id} data-testid="manage-item">
            {p.title}
            <button onClick={() => setEditing(p)}>Edit</button>
            <button onClick={() => deleteProduct(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProducts;
