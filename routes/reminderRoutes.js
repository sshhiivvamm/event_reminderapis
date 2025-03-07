// routes/reminderRoutes.js
const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getReminderByDate,
  getReminderByDateRange,  
  saveReminder,
  allreminders,
  deleteReminderById,
} = require("../controllers/reminderController");

// Route to get reminders for a specific expiry date
router.get("/api/reminders/:date", getReminderByDate);

// Route to get reminders within a date range (start_date to end_date)
router.get("/api/reminders/:start_date/:end_date", getReminderByDateRange);

// Route to save a new reminder
router.post("/api/save-reminder", saveReminder);

// Route to get all reminders
router.get("/api/allreminders", allreminders);

// Route to delete the existing reminder
router.delete("/api/reminders/:id", deleteReminderById);

module.exports = router;
