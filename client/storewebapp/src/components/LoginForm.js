import React, { useState } from 'react';

const API_URL = 'http://localhost:5042/';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    fetch(`${API_URL}api/auth/login`, {
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
        onLogin(data.token, data.role, data.username);
        alert('Logged in');
      })
      .catch(err => {
        if (err.message.includes('User not found')) {
          alert('This account does not exist. Please register');
        } else if (err.message.includes('Wrong password')) {
          alert('Incorrect password');
        } else {
          alert('Login failed');
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
      <button type="submit">Zaloguj</button>
    </form>
  );
};

export default LoginForm;
