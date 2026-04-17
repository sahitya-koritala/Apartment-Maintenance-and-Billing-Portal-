import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Star, MessageSquare } from 'lucide-react';

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({ rating: 5, review: '' });

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedback', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/feedback', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFormData({ rating: 5, review: '' });
      fetchFeedbacks();
      alert('Feedback submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback.');
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={18} fill={i < count ? 'var(--accent-warning)' : 'none'} color={i < count ? 'var(--accent-warning)' : 'gray'} />
    ));
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}><MessageSquare style={{ display: 'inline', marginRight: '10px' }}/> Feedback & Reviews</h1>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-success)' }}>Leave Feedback</h3>
        <form onSubmit={handleSubmitFeedback}>
          <div className="input-group">
            <label>Rating (1-5)</label>
            <select required value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})}>
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Very Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Terrible</option>
            </select>
          </div>
          <div className="input-group">
            <label>Your Review</label>
            <textarea required rows="3" value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})} placeholder="Tell us about your experience..."></textarea>
          </div>
          <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent-success), #10b981)' }}>Submit Feedback</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {feedbacks.map(fb => (
          <div key={fb._id} className="glass-panel" style={{ borderTop: '4px solid var(--accent-success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '4px' }}>{renderStars(fb.rating)}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {new Date(fb.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>"{fb.review}"</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  By: {fb.userId?.name || 'Unknown User'} 
                  {fb.userId?.flatId && <><br/>Block {fb.userId.flatId.block} - {fb.userId.flatId.flatNumber}</>}
               </div>
               {(user.role === 'admin' || fb.userId?._id === user._id || fb.userId === user._id) && (
                 <button 
                   onClick={() => handleDeleteFeedback(fb._id)}
                   style={{ background: 'transparent', color: 'var(--accent-danger)', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                 >
                   Delete
                 </button>
               )}
            </div>
          </div>
        ))}
        {feedbacks.length === 0 && <p className="glass-panel" style={{ gridColumn: '1/-1' }}>No feedback available yet.</p>}
      </div>
    </div>
  );
};

export default Feedback;
