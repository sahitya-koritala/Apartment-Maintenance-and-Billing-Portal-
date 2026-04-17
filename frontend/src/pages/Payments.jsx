import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Receipt, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Payments = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState({ show: false, payment: null });
  const [addModal, setAddModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ billId: '', amount: 0, paymentMode: 'Cash' });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/payments`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payments:', err.response?.data || err.message);
      alert('Failed to load payment history. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPayments();
    }
  }, [user]);

  const downloadReceipt = (payment) => {
    const doc = new jsPDF();
    doc.text(`ApartmentPro - Payment Receipt`, 14, 20);
    doc.setFontSize(12);
    
    doc.text(`Receipt ID: ${payment._id}`, 14, 30);
    doc.text(`Date of Payment: ${new Date(payment.paymentDate).toLocaleString()}`, 14, 40);
    doc.text(`Payment Mode: ${payment.paymentMode}`, 14, 50);

    if (payment.billId) {
      doc.text(`Billing Month: ${payment.billId.month}`, 14, 60);
      if (payment.billId.flatId) {
          doc.text(`Flat: Block ${payment.billId.flatId.block} - ${payment.billId.flatId.flatNumber}`, 14, 70);
      }
    }

    autoTable(doc, {
      startY: 80,
      head: [['Description', 'Amount Paid']],
      body: [
        ['Total Paid', `INR ${payment.amount}`]
      ],
    });

    doc.save(`Receipt_${payment._id}.pdf`);
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm('Delete this payment? The associated bill will revert to UNPAID. Ensure this is correct.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/payments/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Payment deleted and bill reverted.');
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert('Failed to delete payment');
    }
  };

  const openEditModal = (payment) => {
    setEditModal({ show: true, payment: { ...payment } });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/payments/${editModal.payment._id}`, { amount: editModal.payment.amount, paymentMode: editModal.payment.paymentMode }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Payment updated successfully');
      setEditModal({ show: false, payment: null });
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert('Failed to update payment');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/payments', newPayment, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Payment added successfully');
      setAddModal(false);
      setNewPayment({ billId: '', amount: 0, paymentMode: 'Cash' });
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add payment');
    }
  };

  if (user?.role !== 'admin') {
    return <div className="animate-fade-in glass-panel"><p>Not authorized to view entire payment history.</p></div>;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1><Receipt style={{ display: 'inline', marginRight: '10px' }}/> Payment History & Receipts</h1>
        <button className="btn-primary" onClick={() => setAddModal(true)}>+ Add Payment</button>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', borderTop: '4px solid var(--accent-purple)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Flat</th>
              <th style={{ padding: '1rem' }}>Billing Month</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Mode</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem' }}>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  {payment.billId?.flatId ? `Blk ${payment.billId.flatId.block} - ${payment.billId.flatId.flatNumber}` : 'N/A'}
                </td>
                <td style={{ padding: '1rem' }}>{payment.billId?.month || 'N/A'}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{payment.amount}</td>
                <td style={{ padding: '1rem' }}>{payment.paymentMode}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => downloadReceipt(payment)}
                    style={{ background: 'var(--accent-cyan)', padding: '0.4rem 0.8rem', borderRadius: '4px', border: 'none', color: 'white', display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <Download size={14} /> Receipt
                  </button>
                  <button 
                    onClick={() => openEditModal(payment)}
                    style={{ background: 'transparent', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePayment(payment._id)}
                    style={{ background: 'transparent', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && !loading && <p style={{ padding: '1rem', textAlign: 'center' }}>No payments found.</p>}
        {loading && <p style={{ padding: '1rem', textAlign: 'center' }}>Loading...</p>}
      </div>

      {editModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Edit Payment</h3>
            <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div className="input-group">
                <label>Amount (₹)</label>
                <input type="number" required value={editModal.payment.amount} onChange={e => setEditModal({ ...editModal, payment: { ...editModal.payment, amount: e.target.value } })} />
              </div>
              <div className="input-group">
                <label>Payment Mode</label>
                <select value={editModal.payment.paymentMode} onChange={e => setEditModal({ ...editModal, payment: { ...editModal.payment, paymentMode: e.target.value } })}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" onClick={() => setEditModal({ show: false, payment: null })} style={{ flex: 1, background: 'transparent', border: '1px solid gray', color: 'white', borderRadius: '8px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-success)' }}>Add Manual Payment</h3>
            <form onSubmit={handleAddSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div className="input-group">
                <label>Bill ID (Paste strictly from database)</label>
                <input type="text" required value={newPayment.billId} onChange={e => setNewPayment({ ...newPayment, billId: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Amount (₹)</label>
                <input type="number" required value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Payment Mode</label>
                <select value={newPayment.paymentMode} onChange={e => setNewPayment({ ...newPayment, paymentMode: e.target.value })}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, background: 'linear-gradient(135deg, var(--accent-success), #059669)' }}>Submit Payment</button>
                <button type="button" onClick={() => setAddModal(false)} style={{ flex: 1, background: 'transparent', border: '1px solid gray', color: 'white', borderRadius: '8px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
