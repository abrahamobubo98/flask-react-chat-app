import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Chat from './Chat';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || 'User';
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <>
      <Navbar />
      <Sidebar 
        currentUserId={location.state?.userId}
        currentUsername={username}
        onSelectUser={handleUserSelect}
      />
      <div className="dashboard">
        <Chat 
          selectedUser={selectedUser}
          currentUserId={location.state?.userId}
        />
      </div>
    </>
  );
}

export default Dashboard; 