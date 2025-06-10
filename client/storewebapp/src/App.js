import React, { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';

const App = () => {
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(0);

  const handleAdded = () => {
    setRefresh(r => r + 1);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Sklep Wszystko i Nic</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Szukaj produktu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>
      <div className="container">
        <AddProductForm onAdd={handleAdded} />
      </div>
      <ProductList search={search} refresh={refresh} />
      <footer className="footer">
        <p>&copy; 2025 Sklep Wszystko i Nic. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
