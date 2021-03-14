import models from '../../models/index';
import findOneHelper from '../../helpers/finOneHelper';
import finOneHelper from '../../helpers/finOneHelper';
import httError from '../../helpers/errorsHandler/httpError';
import getSingleEvent from '../../helpers/eventHelper/getSingleEvent';

const { Ticket, PaymentEvents } = models;

class VerifyTicketController {
  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */
  static async verifyTicket(req, res) {
    const { vCode } = req.body;
    const paidEvent = await findOneHelper(PaymentEvents, { vCode });
    const ticket = await finOneHelper(Ticket, { ticketNumber: paidEvent.ticketNo });
    await ticket.update(
      { isTicketVerified: true },
      { where: { ticketNumber: paidEvent.ticketNo }, returning: true, plain: true }
    );
    const newPaidEvent = await paidEvent.update(
      { isTicketVerified: true },
      { where: { vCode }, returning: true, plain: true }
    );
    return res.status(200).json({
      message: 'success, ticket is verified',
      ticket: newPaidEvent
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */

  static async unverifyTicket(req, res) {
    const { vCode } = req.body;
    const verifiedTicket = await findOneHelper(PaymentEvents, { vCode });
    const ticket = await finOneHelper(Ticket, { ticketNumber: verifiedTicket.ticketNo });

    await ticket.update(
      { isTicketVerified: false },
      { where: { ticketNumber: verifiedTicket.ticketNo }, returning: true, plain: true }
    );
    const unverifiedTicket = await verifiedTicket.update(
      { isTicketVerified: false },
      { where: { vCode }, returning: true, plain: true }
    );
    return res.status(200).json({
      message: 'success, ticket is unverified',
      ticket: unverifiedTicket
    });
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */

  static async getVerifiedTicketsByCustomerOrEvent(req, res) {
    const { customerId, slug } = req.query;
    const allVerifiedPayments = await PaymentEvents.findAll({
      where: { isTicketVerified: true }
    });
    const verifiedPaymentsByEvent = await allVerifiedPayments.filter(
      paymentEvent => paymentEvent.event === slug
    );

    let customer;
    let ticketCustomerId;

    const verifiedPaymentsByCustomer = await allVerifiedPayments.filter(
      paymentEvent => (
        paymentEvent.customer.id === parseInt(customerId),
        ((customer = paymentEvent.customer.name),
        (ticketCustomerId = paymentEvent.customer.id))
      )
    );

    if (ticketCustomerId === parseInt(customerId)) {
      return res.status(200).json({
        message: 'successful retrieved all verified tickets for this customer',
        customer,
        counts: verifiedPaymentsByCustomer.length,
        tickets: verifiedPaymentsByCustomer
      });
    } else if (verifiedPaymentsByEvent.length) {
      const eventName = await getSingleEvent(slug);
      return res.status(200).json({
        message: 'success retrieved all verified tickets for this event',
        event: eventName.dataValues.title,
        counts: verifiedPaymentsByEvent.length,
        tickets: verifiedPaymentsByEvent
      });
    } else {
      throw new httError(404, 'No tickets found');
    }
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */

  static async getAllVerifiedTickets(req, res) {
    const allVerifiedPayments = await PaymentEvents.findAll({
      where: { isTicketVerified: true }
    });
    if (allVerifiedPayments.length) {
      return res.status(200).json({
        message: 'successful retrieved all verified tickets',
        counts: allVerifiedPayments.length,
        tickets: allVerifiedPayments
      });
    } else {
      throw new httError(404, 'No tickets found');
    }
  }

  /**
   *
   * @param {Object} req - Requests from client
   * @param {Object} res - Response from db
   * @returns {Object} Response
   */

  static async customerTicketsWithEvent(req, res) {
    const { slug, customerId } = req.params;
    const verifiedPayments = await PaymentEvents.findAll({
      where: { isTicketVerified: true, event: slug }
    });

    const response = [];
    let customer;
    const eventName = await getSingleEvent(slug);
    verifiedPayments.forEach(verifiedPayment => {
      if (verifiedPayment.customer.id === parseInt(customerId)) {
        response.push(verifiedPayment);
        customer = verifiedPayment.customer.name;
      }
    });

    if (response.length) {
      return res.status(200).json({
        message: 'successful verified tickets for this customer',
        customer,
        event: eventName.dataValues.title,
        counts: response.length,
        tickets: response
      });
    } else {
      throw new httError(404, 'No tickets found');
    }
  }
}

export default VerifyTicketController;
