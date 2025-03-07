// controllers/reminderController.js
const Reminder = require("../models/remindermodel");

// Get reminder by specific expiry date
const getReminderByDate = async (req, res) => {
  const { date } = req.params;
  const [day, month, year] = date.split('-');

  // Ensure the date is in the correct ISO format: YYYY-MM-DD
  const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);

  if (isNaN(formattedDate)) {
    return res.status(400).json({ message: 'Invalid date format. Expected dd-MM-yyyy' });
  }

  try {
    const reminders = await Reminder.find({
      expiry_date: {
        $gte: formattedDate,
        $lt: new Date(formattedDate).setDate(formattedDate.getDate() + 1)
      }
    });

    if (reminders.length === 0) {
      return res.status(404).json({ message: 'No reminders found for this expiry date' });
    }

    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reminders', error });
  }
};


// Get reminders within a date range (start_date to end_date)
const getReminderByDateRange = async (req, res) => {
  const { start_date, end_date } = req.params;

  // Convert DD-MM-YYYY to YYYY-MM-DD
  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}T00:00:00Z`); // Return a valid Date object
  };

  const startDate = formatDate(start_date);
  const endDate = formatDate(end_date);

  // Check if the date parsing resulted in an invalid date
  if (isNaN(startDate) || isNaN(endDate)) {
    return res.status(400).json({ message: 'Invalid date format. Expected dd-MM-yyyy' });
  }

  try {
    const reminders = await Reminder.find({
      $or: [
        { issued_date: { $gte: startDate, $lte: endDate } },
        { expiry_date: { $gte: startDate, $lte: endDate } },
      ],
    });

    if (reminders.length === 0) {
      return res.status(404).json({ message: 'No reminders found for this date range' });
    }

    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reminders', error });
  }
};


const saveReminder = async (req, res) => {

  console.log('code got here ajay taj ------------')
  const {
    firm_name, firm_address, gst, certification_body, contact, reference,
    basic_amount, certificate, issued_date, expiry_date
  } = req.body;

  // Check for required fields
  if (!firm_name || !firm_address || !gst || !certification_body || !contact ||
    !reference || !basic_amount || !certificate || !issued_date || !expiry_date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Updated Date format validation (accepts YYYY-MM-DD format)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(issued_date) || !dateRegex.test(expiry_date)) {
    return res.status(400).json({
      success: false,
      message: "Dates must be in YYYY-MM-DD format",
    });
  }

  try {
    // Directly use the string in YYYY-MM-DD format to create Date objects
    const issuedDate = new Date(issued_date);  // JavaScript Date object
    const expiryDate = new Date(expiry_date);  // JavaScript Date object

    // Validate if the conversion results in valid Date objects
    if (isNaN(issuedDate) || isNaN(expiryDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format after conversion",
      });
    }

    // Create a new Reminder object
    const newReminder = new Reminder({
      firm_name,
      firm_address,
      gst,
      certification_body,
      contact,
      reference,
      basic_amount,
      certificate,
      issued_date: issuedDate,  // JavaScript Date object
      expiry_date: expiryDate,  // JavaScript Date object
    });

    // Save to the database
    await newReminder.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Reminder saved successfully",
      reminder: newReminder,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all reminders
const allreminders = async (req, res) => {
  try {
    const reminders = await Reminder.find();
    if (reminders.length === 0) {
      return res.status(404).json({ success: false, message: "No reminders found" });
    }

    res.status(200).json({ success: true, reminders });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//Delete the existing remiders
const deleteReminderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const deletedReminder = await Reminder.findByIdAndDelete(id);
    
    if (!deletedReminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    res.status(200).json({ success: true, message: 'Reminder deleted successfully', reminder: deletedReminder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

//Edit the existing reminders 



module.exports = {
  getReminderByDate,
  getReminderByDateRange,
  saveReminder,
  allreminders,
  deleteReminderById,
};
