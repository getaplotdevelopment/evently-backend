import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';

const { TicketCategory } = models;

const checkCategory = async (req, res, next) => {
  const { ticketCategoryId } = req.params;
  const category = await TicketCategory.findOne({
    where: { id: ticketCategoryId }
  });

  if (!category) {
    throw new httpError(404, 'Category does not exist');
  }
  next();
};
const checkCategoryDesignation = async (req, res, next) => {
  const { designation } = req.body;
  const category = await TicketCategory.findOne({ where: { designation } });
  if (category) {
    throw new httpError(400, 'Category already exist');
  }
  next();
};

export { checkCategory, checkCategoryDesignation };
