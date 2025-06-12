import React, { useEffect, useRef, useState } from 'react';

const API_URL = 'http://localhost:5042/';

const EditProductForm = ({ product, token, onEdited, onCancel }) => {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    product.categories ? product.categories.map(c => c.id) : []
  );
  const fileInput = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}api/storewebapp/GetCategories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    selectedCategories.forEach(id => formData.append('categoryIds', id));
    if (image) formData.append('image', image);

    fetch(`${API_URL}api/storewebapp/EditProduct/${product.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        onEdited && onEdited(data);
        onCancel && onCancel();
      })
      .catch(() => {});
  };

  const handleFiles = files => {
    if (files && files[0]) {
      setImage(files[0]);
    }
  };

  const openDialog = () => {
    fileInput.current?.click();
  };

  const toggleCategory = id => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <div className="category-select">
        {categories.map(cat => (
          <div
            key={cat.id}
            className={`category-item ${
              selectedCategories.includes(cat.id) ? 'selected' : ''
            }`}
            onClick={() => toggleCategory(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </div>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <div className="drop-zone" onClick={openDialog}>
        {image ? image.name : 'Przeciągnij obraz tutaj lub kliknij, aby wybrać'}
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
      </div>
      <button type="submit">Zapisz</button>
      <button type="button" onClick={onCancel}>Anuluj</button>
    </form>
  );
};

export default EditProductForm;
