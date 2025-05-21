const express = require('express');
const path = require('path');
const { serve } = require('https-localhost');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start HTTPS server
const port = 3000;
serve(app, { port }).listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
});