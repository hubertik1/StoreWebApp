import React, { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';

const App = () => {
  const [search, setSearch] = useState('');

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
      <ProductList search={search} />
      <footer className="footer">
        <p>&copy; 2025 Sklep Wszystko i Nic. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
