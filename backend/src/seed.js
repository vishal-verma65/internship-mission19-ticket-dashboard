require('dotenv').config();
const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');

const samples = [
  { title: 'Payment gateway timeout', description: 'Checkout fails intermittently', priority: 'high' },
  { title: 'Password reset email delayed', description: 'Emails arrive after 10+ minutes', priority: 'medium' },
  { title: 'Update FAQ page', description: 'Add refund policy section', priority: 'low' },
  { title: 'Dashboard shows wrong totals', description: 'Monthly totals off by one day', priority: 'high' },
  { title: 'Broken link in footer', description: 'Terms page returns 404', priority: 'low' },
  { title: 'Slow search results', description: 'Queries take over 3 seconds', priority: 'medium' },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Ticket.deleteMany({});
  await Ticket.insertMany(samples);
  console.log(`Seeded ${samples.length} tickets`);
  await mongoose.disconnect();
})();
