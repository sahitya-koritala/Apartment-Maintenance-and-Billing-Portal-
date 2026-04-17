import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Receipt, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Bills = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [flats, setFlats] = useState([]);
  const [formData, setFormData] = useState({ month: '', maintenance: 0, water: 0, electricity: 0, parking: 0, extraCharges: 0 });
  const [singleBillForm, setSingleBillForm] = useState({ flatId: '', month: '', maintenance: 0, water: 0, electricity: 0, parking: 0, extraCharges: 0 });
  const [editModal, setEditModal] = useState({ show: false, bill: null });

  const fetchBills = async () => {
    try {
      const endpoint = user.role === 'admin' ? '/all' : `/${user._id}`;
      const res = await axios.get(`http://localhost:5000/api/bills${endpoint}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBills(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFlats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/flats', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFlats(res.data);
      if (res.data.length > 0) {
        setSingleBillForm(prev => ({ ...prev, flatId: res.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBills();
    if (user.role === 'admin') fetchFlats();
  }, [user]);

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bills/generate-bill', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Bills generated successfully!');
      fetchBills();
      setFormData({ month: '', maintenance: 0, water: 0, electricity: 0, parking: 0, extraCharges: 0 });
    } catch (err) {
      console.error(err);
      alert('Failed to generate bills.');
    }
  };

  const handleAddSingleBill = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bills/add', singleBillForm, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Single bill added successfully!');
      fetchBills();
      setSingleBillForm({ ...singleBillForm, month: '', maintenance: 0, water: 0, electricity: 0, parking: 0, extraCharges: 0 });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add single bill');
    }
  };

  const handlePayBill = async (billId, amount) => {
    const paymentMode = prompt("Enter Payment Mode (Cash, UPI, Card):", "UPI");
    if (!['Cash', 'UPI', 'Card'].includes(paymentMode)) return alert("Invalid mode");

    try {
      await axios.post(`http://localhost:5000/api/payments`, 
        { billId, amount, paymentMode }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Payment successful!');
      fetchBills();
    } catch (err) {
      console.error(err);
      alert('Payment failed');
    }
  };

  const handleDeleteBill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/bills/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchBills();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (bill) => {
    setEditModal({ show: true, bill: { ...bill } });
  };

  const closeEditModal = () => {
    setEditModal({ show: false, bill: null });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/bills/${editModal.bill._id}`, editModal.bill, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Bill updated successfully');
      setEditModal({ show: false, bill: null });
      fetchBills();
    } catch (err) {
      console.error(err);
      alert('Failed to update bill');
    }
  };

  const applyLateFee = async (id) => {
    if (!window.confirm('Add 10% late fee to this bill?')) return;
    try {
      await axios.put(`http://localhost:5000/api/bills/late-fee/${id}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchBills();
      alert('Late fee applied!');
    } catch (err) {
      console.error(err);
      alert('Failed to apply late fee');
    }
  };

  const downloadPDF = (bill) => {
    const doc = new jsPDF();
    doc.text(`ApartmentPro - Maintenance Bill`, 14, 20);
    doc.setFontSize(12);
    if (bill.flatId) {
      doc.text(`Flat: Block ${bill.flatId.block} - ${bill.flatId.flatNumber}`, 14, 30);
    }
    doc.text(`Billing Month: ${bill.month}`, 14, 40);
    doc.text(`Status: ${bill.status.toUpperCase()}`, 14, 50);

    autoTable(doc, {
      startY: 60,
      head: [['Description', 'Amount (INR)']],
      body: [
        ['Base Maintenance', bill.maintenance],
        ['Water Charge', bill.water || 0],
        ['Electricity Charge', bill.electricity || 0],
        ['Parking Fee', bill.parking || 0],
        ['Extra Charges', bill.extraCharges || 0],
      ],
      foot: [['Total Payable', bill.totalAmount]],
    });

    doc.save(`Bill_${bill.month.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}><Receipt style={{ display: 'inline', marginRight: '10px' }}/> Billing & Payments</h1>

      {user.role === 'admin' && (
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-success)' }}>Generate Monthly Bill for All Flats</h3>
          <form onSubmit={handleGenerateBill} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Month & Year</label>
              <input required type="text" placeholder="e.g. March 2026" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Base Maintenance (₹)</label>
              <input required type="number" value={formData.maintenance} onChange={e => setFormData({...formData, maintenance: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Water Bill (₹)</label>
              <input type="number" value={formData.water} onChange={e => setFormData({...formData, water: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Electricity Bill (Optional)</label>
              <input type="number" value={formData.electricity} onChange={e => setFormData({...formData, electricity: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Parking Fee (₹)</label>
              <input type="number" value={formData.parking} onChange={e => setFormData({...formData, parking: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Extra Charges (₹)</label>
              <input type="number" value={formData.extraCharges} onChange={e => setFormData({...formData, extraCharges: e.target.value})} />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent-success), #059669)' }}>
                Generate Bills
              </button>
            </div>
          </form>
        </div>
      )}

      {user.role === 'admin' && (
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>Add Manual Single Bill</h3>
          <form onSubmit={handleAddSingleBill} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Select Flat</label>
              <select required value={singleBillForm.flatId} onChange={e => setSingleBillForm({...singleBillForm, flatId: e.target.value})}>
                {flats.map(flat => (
                  <option key={flat._id} value={flat._id}>Block {flat.block} - {flat.flatNumber}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Month & Year</label>
              <input required type="text" placeholder="e.g. March 2026" value={singleBillForm.month} onChange={e => setSingleBillForm({...singleBillForm, month: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Base Maintenance (₹)</label>
              <input required type="number" value={singleBillForm.maintenance} onChange={e => setSingleBillForm({...singleBillForm, maintenance: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Water (₹)</label>
              <input type="number" value={singleBillForm.water} onChange={e => setSingleBillForm({...singleBillForm, water: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Electricity (₹)</label>
              <input type="number" value={singleBillForm.electricity} onChange={e => setSingleBillForm({...singleBillForm, electricity: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Parking & Extra (₹)</label>
              <input type="number" value={singleBillForm.extraCharges} onChange={e => setSingleBillForm({...singleBillForm, extraCharges: e.target.value})} />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent-purple), #5b21b6)' }}>
                Add Single Bill
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {bills.map(bill => (
          <div key={bill._id} className="glass-panel" style={{ borderTop: `4px solid ${bill.status === 'paid' ? 'var(--accent-success)' : 'var(--accent-danger)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{bill.month}</h3>
              <span style={{ 
                background: bill.status === 'paid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: bill.status === 'paid' ? 'var(--accent-success)' : 'var(--accent-danger)',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {bill.status.toUpperCase()}
              </span>
            </div>
            
            {user.role === 'admin' && bill.flatId && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Flat: Block {bill.flatId.block} - {bill.flatId.flatNumber}</p>
            )}

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Maintenance:</span>
                <span>₹{bill.maintenance}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Water:</span>
                <span>₹{bill.water || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Electricity:</span>
                <span>₹{bill.electricity || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Parking:</span>
                <span>₹{bill.parking || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Extra Charges:</span>
                <span>₹{bill.extraCharges || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>
                <span>Total:</span>
                <span>₹{bill.totalAmount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
              <button 
                onClick={() => downloadPDF(bill)}
                className="btn-primary" 
                style={{ width: '100%', background: 'linear-gradient(135deg, #1e293b, #334155)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                <Download size={18} /> Download PDF
              </button>
              
              {bill.status === 'unpaid' && user.role === 'resident' && (
                <button 
                  onClick={() => handlePayBill(bill._id, bill.totalAmount)}
                  className="btn-primary" 
                  style={{ width: '100%' }}
                >
                  Pay Now
                </button>
              )}
              
              {user.role === 'admin' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
                   <button onClick={() => applyLateFee(bill._id)} style={{ background: 'transparent', border: '1px solid var(--accent-warning)', color: 'var(--accent-warning)', padding: '0.5rem', borderRadius: '8px' }}>
                    + Late Fee
                  </button>
                  <button onClick={() => openEditModal(bill)} style={{ background: 'transparent', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', padding: '0.5rem', borderRadius: '8px' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteBill(bill._id)} style={{ gridColumn: '1 / -1', background: 'transparent', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.5rem', borderRadius: '8px' }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {bills.length === 0 && <p className="glass-panel" style={{ gridColumn: '1/-1' }}>No bills found. Go generation them!</p>}
      </div>

      {editModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Edit Bill - {editModal.bill.month}</h3>
            <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div className="input-group">
                <label>Maintenance (₹)</label>
                <input type="number" value={editModal.bill.maintenance} onChange={e => setEditModal({ ...editModal, bill: { ...editModal.bill, maintenance: e.target.value } })} />
              </div>
              <div className="input-group">
                <label>Water (₹)</label>
                <input type="number" value={editModal.bill.water} onChange={e => setEditModal({ ...editModal, bill: { ...editModal.bill, water: e.target.value } })} />
              </div>
              <div className="input-group">
                <label>Electricity (₹)</label>
                <input type="number" value={editModal.bill.electricity} onChange={e => setEditModal({ ...editModal, bill: { ...editModal.bill, electricity: e.target.value } })} />
              </div>
              <div className="input-group">
                <label>Parking (₹)</label>
                <input type="number" value={editModal.bill.parking} onChange={e => setEditModal({ ...editModal, bill: { ...editModal.bill, parking: e.target.value } })} />
              </div>
              <div className="input-group">
                <label>Extra Charges (₹)</label>
                <input type="number" value={editModal.bill.extraCharges} onChange={e => setEditModal({ ...editModal, bill: { ...editModal.bill, extraCharges: e.target.value } })} />
              </div>
               <div className="input-group">
                <label>Late Fee (₹)</label>
                <input type="number" value={editModal.bill.lateFee || 0} onChange={e => setEditModal({ ...editModal, bill: { ...editModal.bill, lateFee: e.target.value } })} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" onClick={closeEditModal} style={{ flex: 1, background: 'transparent', border: '1px solid gray', color: 'white', borderRadius: '8px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
