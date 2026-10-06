const router = require('express').Router();
const { getTickets, createTicket } = require('../controllers/ticketController');

router.route('/').get(getTickets).post(createTicket);

module.exports = router;
