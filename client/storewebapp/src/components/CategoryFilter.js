import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5042/';

const CategoryFilter = ({ selected = [], onChange }) => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}api/storewebapp/GetCategories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  const toggle = id => {
    if (selected.includes(String(id))) {
      onChange(selected.filter(s => s !== String(id)));
    } else {
      onChange([...selected, String(id)]);
    }
  };

  return (
    <div className="category-filter">
      <div className="category-label" onClick={() => setOpen(o => !o)}>
        Categories
      </div>
      <div className={`category-menu ${open ? 'open' : ''}`}>
        {categories.map(cat => (
          <div
            key={cat.id}
            className={`category-item ${
              selected.includes(String(cat.id)) ? 'selected' : ''
            }`}
            onClick={() => toggle(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
