
const mongoose = require('mongoose');

// Reminder Schema
const reminderSchema = new mongoose.Schema({
  firm_name: { type: String, required: true },
  firm_address: { type: String, required: true },
  gst: { type: String, required: true },
  certification_body: { type: String, required: true },
  contact: { type: Number, required: true },
  basic_amount: { type: Number, required: true },
  reference: { type: String, required: true },
  
  // Using Date type for issued_date and expiry_date
  issued_date: { 
    type: Date, 
    required: true,
    get: (date) => date ? date.toISOString().split('T')[0] : undefined,  // Convert to YYYY-MM-DD format when retrieving
  },
  
  expiry_date: { 
    type: Date, 
    required: true,
    get: (date) => date ? date.toISOString().split('T')[0] : undefined,  // Convert to YYYY-MM-DD format when retrieving
  },
  
  certificate: { type: String, required: true },
});

// Ensure the Date is formatted in YYYY-MM-DD format when converting to JSON
reminderSchema.set('toJSON', {
  getters: true,  // Use the getters defined in the schema
  virtuals: false, // Optionally, prevent virtuals from being included in the output
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;

