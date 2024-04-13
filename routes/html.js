const path = require('path');
const express = require('express');
const router = express.Router();

// Route for serving the notes.html file
router.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/notes.html'), (err) => {
    if (err) {
      console.error('Error sending notes.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Wildcard route to serve index.html for all other routes
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'), (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

module.exports = router;
