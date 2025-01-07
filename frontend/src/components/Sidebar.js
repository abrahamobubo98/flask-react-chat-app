import React, { useState, useEffect } from 'react';

function Sidebar({ currentUserId, currentUsername, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentUserId]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/users?current_user_id=${currentUserId}`);
      const data = await response.json();
      setUsers(data.filter(user => user.id !== currentUserId));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user.id);
    onSelectUser(user);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Conversations</h2>
      </div>
      <div className="users-list">
        {users.map(user => (
          <div
            key={user.id}
            className={`user-item ${selectedUser === user.id ? 'selected' : ''}`}
            onClick={() => handleUserSelect(user)}
          >
            <div className="user-item-content">
              <span className="user-name">{user.username}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="profile-section">
        <div className="profile-content">
          <span className="profile-icon">👤</span>
          <span className="profile-name">{currentUsername}</span>
        </div>
        <div className="profile-label">My Profile</div>
      </div>
    </div>
  );
}

export default Sidebar; 