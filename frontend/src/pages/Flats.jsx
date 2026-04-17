import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

const Flats = () => {
  const { user } = useContext(AuthContext);
  const [flats, setFlats] = useState([]);
  const [residents, setResidents] = useState([]);
  const [formData, setFormData] = useState({ flatNumber: '', block: '', floor: '' });
  const [error, setError] = useState('');

  const fetchFlatsAndResidents = async () => {
    try {
      const flatRes = await axios.get('http://localhost:5000/api/flats', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFlats(flatRes.data);

      if (user.role === 'admin') {
        const resRes = await axios.get('http://localhost:5000/api/auth/residents', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setResidents(resRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFlatsAndResidents();
  }, []);

  const handleAddFlat = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/flats', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFormData({ flatNumber: '', block: '', floor: '' });
      setError('');
      fetchFlatsAndResidents();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding flat');
    }
  };

  const handleAssignResident = async (flatId, ownerId) => {
    try {
      await axios.put(`http://localhost:5000/api/flats/${flatId}`, { ownerId }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchFlatsAndResidents();
    } catch (err) {
      console.error('Error assigning resident: ', err);
    }
  };

  const handleDeleteFlat = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flat?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/flats/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchFlatsAndResidents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}><Building2 style={{ display: 'inline', marginRight: '10px' }}/> Manage Flats</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-cyan)' }}>Add New Flat</h3>
          {error && <p style={{ color: 'var(--accent-danger)' }}>{error}</p>}
          <form onSubmit={handleAddFlat}>
            <div className="input-group">
              <label>Flat Number</label>
              <input required type="text" value={formData.flatNumber} onChange={e => setFormData({...formData, flatNumber: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Block</label>
              <input required type="text" value={formData.block} onChange={e => setFormData({...formData, block: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Floor</label>
              <input required type="number" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Add Flat</button>
          </form>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-cyan)' }}>All Flats</h3>
          {flats.length === 0 ? <p>No flats added yet.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {flats.map(flat => (
                <div key={flat._id} style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-cyan)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{flat.block} - {flat.flatNumber}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>Floor: {flat.floor}</span>
                  </div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div>
                      {flat.ownerId ? `Assigned to: ${flat.ownerId.name}` : (
                        user.role === 'admin' ? (
                          <select 
                            style={{ padding: '0.3rem', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-light)', borderRadius: '4px' }}
                            onChange={(e) => handleAssignResident(flat._id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Assign Resident</option>
                            {residents.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                          </select>
                        ) : 'Unassigned'
                      )}
                    </div>
                    {user.role === 'admin' && (
                      <button 
                        onClick={() => handleDeleteFlat(flat._id)}
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', background: 'var(--accent-danger)', color: 'white', borderRadius: '4px' }}
                      >
                        Delete Flat
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flats;
