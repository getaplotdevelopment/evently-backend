import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';

const { Ticket } = models;

const checkTicketExist = async (req, res, next) => {
  const { category } = req.body;
  const { slug } = req.params;
  const ticket = await Ticket.findOne({
    where: { event: slug, category }
  });
  if (ticket) {
    throw new httpError(
      404,
      'Ticket with this category has already being added, select a new category'
    );
  }
  next();
};

const checkTicket = async (req, res, next) => {
  const { ticketId } = req.params;
  const ticket = await Ticket.findOne({
    where: { ticketNumber: ticketId }
  });
  if (!ticket) {
    throw new httpError(404, 'Ticket not found');
  }
  next();
};

const checkTicketEvent = async (req, res, next) => {
  const { slug } = req.params;
  const { ticket_id } = req.body;
  const ticket = await Ticket.findOne({
    where: { ticketNumber: ticket_id, event: slug }
  });
  if (!ticket) {
    throw new httpError(404, 'Ticket not found');
  }
  next();
};

const checkAccessTicket = async (req, res, next) => {
  const { id } = req.organizer;

  const ticket = await Ticket.findOne({
    where: { organizer: id }
  });

  if (!ticket) {
    throw new httpError(
      409,
      'Un-authorized, you do not own this ticket, you can not update it'
    );
  }
  next();
};

export { checkTicketExist, checkTicket, checkAccessTicket, checkTicketEvent };
