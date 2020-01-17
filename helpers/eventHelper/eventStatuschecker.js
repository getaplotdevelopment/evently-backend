import httpError from '../errorsHandler/httpError';

export default eventStatusArray => {
  const requiredStatusType = ['draft', 'published', 'cancelled', 'unpublished'];
  const isrequiredStatusType = eventStatusArray.every(item =>
    requiredStatusType.includes(item)
  );
  if (!isrequiredStatusType) {
    throw new httpError(
      422,
      "Invalid eventType, try any from this array ['draft','published','cancelled','unpublished']"
    );
  }
};
