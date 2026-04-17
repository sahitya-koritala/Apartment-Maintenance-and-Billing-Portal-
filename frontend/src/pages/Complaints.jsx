import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Frown } from 'lucide-react';

const Complaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFormData({ title: '', description: '' });
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'var(--accent-success)';
      case 'In Progress': return 'var(--accent-warning)';
      default: return 'var(--accent-danger)';
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}><Frown style={{ display: 'inline', marginRight: '10px' }}/> Complaint Management</h1>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-warning)' }}>Raise a Complaint</h3>
          <form onSubmit={handleCreateComplaint}>
            <div className="input-group">
              <label>Issue Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent-warning), #d97706)' }}>Submit Complaint</button>
          </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {complaints.map(complaint => (
          <div key={complaint._id} className="glass-panel" style={{ borderLeft: `4px solid ${getStatusColor(complaint.status)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{complaint.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Reported on: {new Date(complaint.createdAt).toLocaleDateString()}
                  {user.role === 'admin' && complaint.userId?.name && ` | By: ${complaint.userId.name}`}
                  {complaint.userId?.flatId && ` | Flat: Block ${complaint.userId.flatId.block} - ${complaint.userId.flatId.flatNumber}`}
                </p>
                <p>{complaint.description}</p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  display: 'inline-block', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold', 
                  backgroundColor: `${getStatusColor(complaint.status)}20`, 
                  color: getStatusColor(complaint.status) 
                }}>
                  {complaint.status}
                </div>
                
                {user.role === 'admin' && complaint.status !== 'Resolved' && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {complaint.status === 'Pending' && (
                      <button onClick={() => updateStatus(complaint._id, 'In Progress')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--accent-warning)', color: 'white' }}>
                        Mark In Progress
                      </button>
                    )}
                    <button onClick={() => updateStatus(complaint._id, 'Resolved')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--accent-success)', color: 'white' }}>
                      Mark Resolved
                    </button>
                  </div>
                )}
                
                {(user.role === 'admin' || complaint.userId?._id === user._id || complaint.userId === user._id) && (
                  <button 
                    onClick={() => handleDeleteComplaint(complaint._id)} 
                    style={{ marginTop: '0.5rem', background: 'transparent', color: 'var(--accent-danger)', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    Delete Complaint
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {complaints.length === 0 && <p className="glass-panel">No complaints found.</p>}
      </div>
    </div>
  );
};

export default Complaints;
