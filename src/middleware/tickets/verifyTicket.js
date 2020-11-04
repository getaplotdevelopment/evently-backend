import verifyTicketHelper from '../../helpers/verifyTicket';

class VerifyTicketMiddleware {
  static async verifyTicket(req, res, next) {
    await verifyTicketHelper(
      req,
      res,
      next,
      true,
      'Ticket is already verified'
    );
  }

  static async unverifyTicket(req, res, next) {
    await verifyTicketHelper(
      req,
      res,
      next,
      false,
      'Ticket is already unverified'
    );
  }
}

export default VerifyTicketMiddleware;
