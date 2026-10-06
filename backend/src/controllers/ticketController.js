const Ticket = require('../models/Ticket');

const getTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const ticket = await Ticket.create({ title, description, priority });
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTickets, createTicket };
