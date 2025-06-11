import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5042/';

const UserAdminPanel = ({ token, show }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}api/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => {});
  }, [token]);

    const changeRole = (id, newRole) => {
      fetch(`${API_URL}api/auth/updateRole/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      })
        .then(res => {
          if (res.status === 204) {
            // Sukces – ponownie pobierz użytkowników
            fetch(`${API_URL}api/auth/users`, {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(r => r.json())
              .then(data => setUsers(data))
              .catch(() => {});
            return {}; // Zwracamy pusty obiekt, aby nie parsować JSON
          } else if (!res.ok) {
            return res.text().then(text => {
              alert(text);
              throw new Error(text);
            });
          } else {
            return res.json();
          }
        })
        .catch(err => console.error(err));
    };

  return (
    <div className={`user-panel ${show ? 'open' : ''}`}>
      {users.map(u => (
        <div key={u.id} className="user-row">
          <span>{u.username}</span>
          <select
            value={u.role}
            onChange={e => changeRole(u.id, e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default UserAdminPanel;