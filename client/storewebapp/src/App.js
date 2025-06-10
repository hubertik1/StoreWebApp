import React, { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const App = () => {
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleAdded = () => {
    setRefresh(r => r + 1);
  };

  const handleAuth = (tok, rl) => {
    setToken(tok);
    setRole(rl);
    localStorage.setItem('token', tok);
    localStorage.setItem('role', rl);
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
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
        {token ? (
          <>
            <button onClick={handleLogout}>Wyloguj</button>
            <AddProductForm onAdd={handleAdded} token={token} />
          </>
        ) : (
          <>
            <LoginForm onLogin={handleAuth} />
            <RegisterForm onRegister={handleAuth} />
          </>
        )}
      </div>
      <ProductList search={search} refresh={refresh} token={token} isAdmin={role === 'Admin'} />
      <footer className="footer">
        <p>&copy; 2025 Sklep Wszystko i Nic. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
