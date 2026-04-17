const mongoose = require('mongoose');
const Bill = require('./models/Bill');
const Payment = require('./models/Payment');
const Notice = require('./models/Notice');

mongoose.connect('mongodb://127.0.0.1:27017/apartment-management')
  .then(async () => {
    console.log("Connected to DB");
    const bills = await Bill.find();
    console.log(`Bills count: ${bills.length}`);
    const payments = await Payment.find();
    console.log(`Payments count: ${payments.length}`);
    const notices = await Notice.find();
    console.log(`Notices count: ${notices.length}`);
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
