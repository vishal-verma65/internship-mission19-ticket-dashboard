const express = require('express');
const cors = require('cors');
const origins = require('./config/origins');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

app.use(cors({ origin: origins }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/tickets', ticketRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;
