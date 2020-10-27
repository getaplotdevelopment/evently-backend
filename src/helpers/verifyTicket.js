import moment from 'moment';
import models from '../models/index';
import httpError from './errorsHandler/httpError';
import findOneHelper from './finOneHelper';
import getSingleEvent from './eventHelper/getSingleEvent';
import { unixDateConverter } from './timeConverter';

const { Ticket, PaymentEvents } = models;

const verifyTicketHelper = async (req, res, next, value, message) => {
  const { vCode } = req.body;
  const { slug } = req.params;
  const event = await getSingleEvent(slug);
  const paidEvent = await findOneHelper(PaymentEvents, { vCode });
  if (paidEvent) {
    const dateToday = moment().unix();
    const eventFinishDate = unixDateConverter(event.finishDate);
    const ticket = await findOneHelper(Ticket, { id: paidEvent.ticketNo });

    if (event) {
      if (dateToday > eventFinishDate) {
        throw new httpError(400, 'This event has ended');
      }
      if (event.slug !== paidEvent.event) {
        throw new httpError(400, 'This Ticket does not belong to this event');
      }
      if (ticket.isTicketVerified === value) {
        throw new httpError(400, message);
      }
      next();
    } else {
      throw new httpError(404, 'Event does not exist');
    }
  } else {
    throw new httpError(404, 'Invalid vCode');
  }
};

export default verifyTicketHelper;
