// // netlify-functions/server.js
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const serverless = require('serverless-http');
// const bodyParser = require('body-parser');

// const app = express();

// // Connect to the database
// mongoose.connect(process.env.DATABASE_URL) 
//   .then(() => {
//     console.log('Connected to Database');
//   })
//   .catch((error) => {
//     console.error('Error connecting to the database:', error);
//   });

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

// // Import routes
// const remindersRouter = require('./routes/reminderRoutes');
// app.use('/api', remindersRouter);

// // Handle serverless
// module.exports.handler = serverless(app);


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to the database
mongoose.connect(process.env.DATABASE_URL) 
  .then(() => {
    console.log('Connected to Database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Import routes
const remindersRouter = require('./routes/reminderRoutes');
app.use('/api', remindersRouter);

// Get the port from the environment variable, fallback to 3000 if not set
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
