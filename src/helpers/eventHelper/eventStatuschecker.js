import httpError from '../errorsHandler/httpError';

export default eventStatusArray => {
  let newTemplate;
  const template = {
    cancelled: 'freeEventCancellation',
    published: 'freeEventLive',
    postponed: 'freeEventPostponed',
    paused: 'freeEventPaused'
  };
  const requiredStatusType = [
    'draft',
    'published',
    'cancelled',
    'unpublished',
    'postponed',
    'paused'
  ];
  const isrequiredStatusType = eventStatusArray.every(item =>
    requiredStatusType.includes(item)
  );
  if (!isrequiredStatusType) {
    throw new httpError(
      422,
      "Invalid eventType, try any from this array ['draft','published','cancelled','unpublished']"
    );
  }
  Object.keys(template).map(temp => {
    if (temp === eventStatusArray[0]) {
      newTemplate = template[temp];
    }
  });

  return newTemplate;
};
