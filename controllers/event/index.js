import models from '../../models';
import slugGenerator from '../../helpers/slugGenerator';
import eventStatuschecker from '../../helpers/eventHelper/eventStatuschecker';
import uploadCloudinary from '../../helpers/eventHelper/uploadCloudinary';

const { Event } = models;

export const createEventController = async (req, res) => {
  const {
    title,
    description,
    body,
    tagList,
    category,
    numberDays,
    startDate,
    finishDate,
    startTime,
    eventStatus,
    eventType
  } = req.body;
  const eventImage = req.file ? await uploadCloudinary(req.file.buffer) : null;
  if (eventStatus) {
    await eventStatuschecker(eventStatus.split(','));
  }
  const {
    id,
    firstName,
    lastName,
    userName,
    email,
    avatar,
    isOrganizer
  } = req.organizer;
  const slug = slugGenerator(title);
  const newEvent = {
    slug,
    title,
    description,
    body,
    tagList: tagList.split(','),
    category,
    numberDays,
    eventImage,
    startDate,
    finishDate,
    startTime,
    eventStatus,
    eventType,
    organizer: {
      id,
      firstName,
      lastName,
      userName,
      email,
      avatar,
      isOrganizer
    }
  };
  const data = await Event.create(newEvent);
  res.send({ status: 201, data });
};

export const getOrganizerEvents = async (req, res) => {
  const { email } = req.organizer;
  const limit = 25;
  const currentPage = req.query.page || 1;
  const offset = limit * currentPage - limit;

  const { count: countAll, rows: data } = await Event.findAndCountAll({
    where: { 'organizer.email': email },
    limit,
    offset
  });
  const pages = Math.ceil(countAll / limit);
  const count = data.length;

  res.send({ status: 200, pages, count, data });
};
