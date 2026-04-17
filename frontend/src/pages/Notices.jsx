import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileText } from 'lucide-react';

const Notices = () => {
  const { user } = useContext(AuthContext);
  const [notices, setNotices] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editModal, setEditModal] = useState({ show: false, notice: null });

  const fetchNotices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notices', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotices(res.data);
    } catch (err) {
      console.error('Error fetching notices:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/notices', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFormData({ title: '', description: '' });
      fetchNotices();
    } catch (err) {
      console.error('Error creating notice:', err.response?.data || err.message);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/notices/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (notice) => {
    setEditModal({ show: true, notice: { ...notice } });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/notices/${editModal.notice._id}`, { title: editModal.notice.title, description: editModal.notice.description }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Notice updated successfully');
      setEditModal({ show: false, notice: null });
      fetchNotices();
    } catch (err) {
      console.error(err);
      alert('Failed to update notice');
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}><FileText style={{ display: 'inline', marginRight: '10px' }}/> Notice Board</h1>

      {user.role === 'admin' && (
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>Post a Notice</h3>
          <form onSubmit={handleCreateNotice}>
            <div className="input-group">
              <label>Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
            <button type="submit" className="btn-primary">Broadcast Notice</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notices.map(notice => (
          <div key={notice._id} className="glass-panel" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{notice.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {new Date(notice.date).toLocaleDateString()}
                </p>
              </div>
              {user.role === 'admin' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => openEditModal(notice)}
                    style={{ background: 'transparent', color: 'var(--accent-cyan)', padding: '0.5rem', border: '1px solid var(--accent-cyan)', borderRadius: '4px' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteNotice(notice._id)}
                    style={{ background: 'transparent', color: 'var(--accent-danger)', padding: '0.5rem', border: '1px solid var(--accent-danger)', borderRadius: '4px' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p>{notice.description}</p>
          </div>
        ))}
        {notices.length === 0 && <p className="glass-panel">No notices have been posted yet.</p>}
      </div>

      {editModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>Edit Notice</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="input-group">
                <label>Title</label>
                <input required type="text" value={editModal.notice.title} onChange={e => setEditModal({...editModal, notice: {...editModal.notice, title: e.target.value}})} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea required rows="3" value={editModal.notice.description} onChange={e => setEditModal({...editModal, notice: {...editModal.notice, description: e.target.value}})}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" onClick={() => setEditModal({ show: false, notice: null })} style={{ flex: 1, background: 'transparent', border: '1px solid gray', color: 'white', borderRadius: '8px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
