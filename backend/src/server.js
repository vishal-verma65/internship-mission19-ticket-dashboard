require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initSockets = require('./sockets');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  const httpServer = http.createServer(app);
  initSockets(httpServer);
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
