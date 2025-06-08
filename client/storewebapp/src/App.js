import React from 'react';
import './App.css';
import ProductList from './components/ProductList';

const App = () => {
  return (
    <div className="App">
      <header className="header">
        <h1>Sklep Wszystko i Nic</h1>
      </header>
      <ProductList />
      <footer className="footer">
        <p>&copy; 2025 Sklep Wszystko i Nic. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
