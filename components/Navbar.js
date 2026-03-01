'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import '@/styles/navbar.css';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Set current date
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('progress');
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <h2 className="navbar-logo">🛡️ SecureOps Training</h2>
          <span className="navbar-date">{currentDate}</span>
        </div>

        <div className="navbar-right">
          {user && (
            <>
              <div className="navbar-user">
                <div className="user-avatar">{user.name.charAt(0)}</div>
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p className="user-role">{user.role}</p>
                </div>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
