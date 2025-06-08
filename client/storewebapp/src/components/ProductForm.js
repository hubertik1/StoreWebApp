import React, { useState } from 'react';

const ProductForm = ({ initial, onSave, onCancel }) => {
  const [product, setProduct] = useState(initial);

  const handleChange = e => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(product);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <input
        name="title"
        value={product.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <input
        name="description"
        value={product.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="imageUrl"
        value={product.imageUrl}
        onChange={handleChange}
        placeholder="Image URL"
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default ProductForm;
