const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apartment-management')
  .then(async () => {
    const Bill = require('./models/Bill');
    const bills = await Bill.find();
    console.log("Bills in DB:", bills.length);
    console.log(bills);
    process.exit(0);
  })
  .catch(err => console.log(err));
