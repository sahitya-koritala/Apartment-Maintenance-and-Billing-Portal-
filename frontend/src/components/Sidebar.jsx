import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Receipt, FileText, Frown, LogOut, MessageSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent-cyan)' }}>ApartmentPro</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Welcome, {user?.name}</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/flats" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <Building2 size={20} />
            <span>Flats</span>
          </NavLink>
        )}
        <NavLink to="/bills" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <Receipt size={20} />
          <span>Bills & Payments</span>
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/payments" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <Receipt size={20} />
            <span>Payment History</span>
          </NavLink>
        )}
        <NavLink to="/notices" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          <span>Notices</span>
        </NavLink>
        <NavLink to="/complaints" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <Frown size={20} />
          <span>Complaints</span>
        </NavLink>
        <NavLink to="/feedback" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <MessageSquare size={20} />
          <span>Feedback</span>
        </NavLink>
      </nav>

      <button onClick={logout} className="sidebar-nav-item" style={{ background: 'transparent', color: 'var(--accent-danger)' }}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
