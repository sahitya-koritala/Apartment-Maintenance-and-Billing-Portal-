const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes will be imported here
const authRoutes = require('./routes/auth');
const flatRoutes = require('./routes/flats');
const billRoutes = require('./routes/bills');
const paymentRoutes = require('./routes/payments');
const noticeRoutes = require('./routes/notices');
const complaintRoutes = require('./routes/complaints');
const dashboardRoutes = require('./routes/dashboard'); // For overview stats
const feedbackRoutes = require('./routes/feedback');

app.use('/api/auth', authRoutes);
app.use('/api/flats', flatRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
