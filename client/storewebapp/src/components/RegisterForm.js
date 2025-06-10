import React, { useState } from 'react';

const API_URL = 'http://localhost:5042/';

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    fetch(`${API_URL}api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(data => {
        onRegister(data.token, data.role, data.username);
        alert('Zarejestrowano pomyślnie');
      })
      .catch(err => {
        if (err.message.includes('User exists')) {
          alert('Konto o tej nazwie już istnieje');
        } else {
          alert('Rejestracja nieudana');
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        placeholder="Login"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Zarejestruj</button>
    </form>
  );
};

export default RegisterForm;
