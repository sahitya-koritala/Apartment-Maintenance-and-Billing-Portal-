import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Users, AlertTriangle, IndianRupee, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      const getStats = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const res = await axios.get('http://localhost:5000/api/dashboard/stats', config);
          setStats(res.data);
        } catch (error) {
          console.error('Failed to fetch stats');
        }
      };
      getStats();
    }
  }, [user]);

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      {user?.role === 'admin' ? (
        stats ? (
          <div className="dashboard-stats-grid">
            <div className="glass-panel stat-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Users color="var(--accent-cyan)" size={32} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.totalResidents}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Total Residents</p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel stat-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <AlertTriangle color="var(--accent-purple)" size={32} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.pendingBillsCount}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Unpaid Bills</p>
                </div>
              </div>
            </div>

            <div className="glass-panel stat-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <IndianRupee color="var(--accent-warning)" size={32} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '2rem' }}>₹{stats.monthlyRevenue}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Revenue This Month</p>
                </div>
              </div>
            </div>

            <div className="glass-panel stat-card" style={{ borderLeft: '4px solid var(--accent-danger)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <AlertTriangle color="var(--accent-danger)" size={32} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--accent-danger)' }}>₹{stats.totalPendingAmount || 0}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Total Pending Dues</p>
                </div>
              </div>
            </div>

            <div className="glass-panel stat-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <TrendingUp color="var(--accent-success)" size={32} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.complaintsCount}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Pending Complaints</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading stats...</p>
        )
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
            <h2>Welcome to ApartmentPro!</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
              Your digital hub for seamless apartment living. Navigate using the sidebar to view your monthly maintenance bills, securely simulate payments, submit maintenance complaints directly to the management, or check the latest community notices.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
              <Users size={48} color="var(--accent-purple)" style={{ marginBottom: '1rem' }} />
              <h3>Community First</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Connect with your building administration easily.</p>
            </div>
            <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
              <AlertTriangle size={48} color="var(--accent-warning)" style={{ marginBottom: '1rem' }} />
              <h3>Instant Maintenance</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Report issues and track them to resolution.</p>
            </div>
          </div>
        </div>
      )}

      {/* Brand new Informational Sections for Everyone */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--accent-cyan)', paddingBottom: '0.5rem', display: 'inline-block' }}>Features & Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass-panel" style={{ borderTop: '3px solid var(--accent-purple)' }}>
            <h4 style={{ color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>Automated Billing</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Generate and track monthly maintenance, water, and electricity bills effortlessly with smart auto-calculations.</p>
          </div>
          <div className="glass-panel" style={{ borderTop: '3px solid var(--accent-warning)' }}>
            <h4 style={{ color: 'var(--accent-warning)', marginBottom: '0.5rem' }}>Issue Resolution</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Log maintenance tasks and community complaints. Track their status from pending to resolved with 100% transparency.</p>
          </div>
          <div className="glass-panel" style={{ borderTop: '3px solid var(--accent-success)' }}>
            <h4 style={{ color: 'var(--accent-success)', marginBottom: '0.5rem' }}>Notice Board</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Stay instantly updated with digital community broadcasts for water supply shifts, events, and essential alerts.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel">
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>About Us</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              ApartmentPro is dedicated to bringing seamless digital management to modern housing societies. 
              Our goal is to bridge the gap between building administration and residents, ensuring absolute 
              clarity in financials, swift maintenance responses, and a tightly-knit, well-informed community.
            </p>
          </div>

          <div className="glass-panel">
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>Contact Administration</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', lineHeight: '2' }}>
              <li><strong>Office Hours:</strong> 9:00 AM - 6:00 PM (Mon-Sat)</li>
              <li><strong>Email:</strong> admin@apartmentpro.com</li>
              <li><strong>Emergency Contact:</strong> +91 98765 43210</li>
              <li><strong>Security Desk:</strong> Ext. 100</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
