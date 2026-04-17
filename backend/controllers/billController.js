const Bill = require('../models/Bill');
const Flat = require('../models/Flat');

exports.generateBill = async (req, res) => {
  const { month, maintenance, water, electricity, parking, extraCharges } = req.body;
  
  try {
    const flats = await Flat.find();
    const bills = [];

    for (let flat of flats) {
      const totalAmount = Number(maintenance) + Number(water || 0) + Number(electricity || 0) + Number(parking || 0) + Number(extraCharges || 0);
      
      // Prevent duplicate bills for same month and flat
      const existingBill = await Bill.findOne({ flatId: flat._id, month });
      if (!existingBill) {
        const bill = await Bill.create({
          flatId: flat._id,
          month,
          maintenance,
          water,
          electricity,
          parking,
          extraCharges,
          dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5), // default due 5th next month
          totalAmount,
          status: 'unpaid'
        });
        bills.push(bill);
      }
    }
    
    if (bills.length === 0) {
      return res.status(200).json({ message: 'No bills generated. All flats may already be billed for this month, or zero flats exist.', bills });
    }
    
    res.status(201).json({ message: `${bills.length} bills generated successfully`, bills });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addSingleBill = async (req, res) => {
  const { flatId, month, maintenance, water, electricity, parking, extraCharges } = req.body;
  try {
    const existingBill = await Bill.findOne({ flatId, month });
    if (existingBill) {
      return res.status(400).json({ message: `Bill already exists for this flat for ${month}` });
    }

    const totalAmount = Number(maintenance) + Number(water || 0) + Number(electricity || 0) + Number(parking || 0) + Number(extraCharges || 0);

    const bill = await Bill.create({
      flatId,
      month,
      maintenance,
      water,
      electricity,
      parking,
      extraCharges,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5),
      totalAmount,
      status: 'unpaid'
    });

    res.status(201).json({ message: 'Bill added successfully', bill });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserBills = async (req, res) => {
  try {
    // If Admin asks for all, we can pass a special param or just check role
    // For now we assume userId refers to ownerId of the flat
    const flats = await Flat.find({ ownerId: req.params.userId });
    const flatIds = flats.map(f => f._id);
    
    const bills = await Bill.find({ flatId: { $in: flatIds } }).populate('flatId', 'flatNumber block');
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate('flatId', 'flatNumber block floor');
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.payBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    bill.status = 'paid';
    await bill.save();

    res.json({ message: 'Bill marked as paid', bill });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBill = async (req, res) => {
  try {
    const { maintenance, water, electricity, parking, extraCharges, lateFee } = req.body;
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    
    if (maintenance !== undefined) bill.maintenance = Number(maintenance);
    if (water !== undefined) bill.water = Number(water);
    if (electricity !== undefined) bill.electricity = Number(electricity);
    if (parking !== undefined) bill.parking = Number(parking);
    if (extraCharges !== undefined) bill.extraCharges = Number(extraCharges);
    if (lateFee !== undefined) bill.lateFee = Number(lateFee);

    bill.totalAmount = Number(bill.maintenance) + Number(bill.water) + Number(bill.electricity) + Number(bill.parking) + Number(bill.extraCharges) + Number(bill.lateFee || 0);
    
    await bill.save();
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.applyLateFee = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    if (bill.status === 'paid') return res.status(400).json({ message: 'Cannot apply late fee to paid bill' });
    
    // Calculate 10% late fee
    const baseTotal = Number(bill.maintenance) + Number(bill.water) + Number(bill.electricity) + Number(bill.parking) + Number(bill.extraCharges);
    bill.lateFee = Math.round(baseTotal * 0.10);
    bill.totalAmount = baseTotal + bill.lateFee;
    
    await bill.save();
    res.json({ message: 'Late fee applied successfully', bill });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
