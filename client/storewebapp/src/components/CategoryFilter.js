import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5042/';

const CategoryFilter = ({ selected = [], onChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}api/storewebapp/GetCategories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  return (
    <div className="category-filter">
      <select
        multiple
        value={selected}
        onChange={e =>
          onChange(Array.from(e.target.selectedOptions, o => o.value))
        }
      >
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
