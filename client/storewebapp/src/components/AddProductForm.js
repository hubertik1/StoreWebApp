import React, { useEffect, useRef, useState } from 'react';

const API_URL = 'http://localhost:5042/';

const AddProductForm = ({ onAdd, token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [drag, setDrag] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
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
    selectedCategories.forEach(id => {
      formData.append('categoryIds', id);
    });
    if (image) formData.append('image', image);

    fetch(`${API_URL}api/storewebapp/UploadProduct`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        onAdd && onAdd(data);
        setTitle('');
        setDescription('');
        setImage(null);
        setSelectedCategories([]);
      })
      .catch(() => {});
  };

  const handleFiles = files => {
    if (files && files[0]) {
      setImage(files[0]);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    setDrag(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = e => {
    e.preventDefault();
    setDrag(true);
  };

  const handleDragLeave = () => setDrag(false);

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
        placeholder="Nazwa produktu"
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
        placeholder="Opis produktu"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <div
        className={`drop-zone ${drag ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openDialog}
      >
        {image ? image.name : 'Przeciągnij obraz tutaj lub kliknij, aby wybrać'}
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
      </div>
      <button type="submit">Dodaj</button>
    </form>
  );
};

export default AddProductForm;
