import models from '../../models';
import slugGenerator from '../../helpers/slugGenerator';
import eventStatuschecker from '../../helpers/eventHelper/eventStatuschecker';
import uploadCloudinary from '../../helpers/eventHelper/uploadCloudinary';
import getEvents from '../../helpers/eventHelper/getEvent';
import handleLikeUnlike from '../../helpers/eventHelper/handleLikeUnlike';
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
    currentMode,
    eventType,
    location
  } = req.body;
  let eventImage = req.file ? await uploadCloudinary(req.file.buffer) : null;
  if (currentMode) {
    await eventStatuschecker(currentMode.split(','));
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
    currentMode,
    eventType,
    location,
    organizer: email
  };
  const data = await Event.create(newEvent);
  res.send({ status: 201, data });
};

export const getOrganizerEvents = async (req, res) => {
  const { email } = req.organizer;
  const searchParams = req.query;
  const filterBy = { organizer: email };
  const { pages, count, data } = await getEvents(searchParams, filterBy);

  res.send({ status: 200, pages, count, data });
};

export const getAllEvents = async (req, res) => {
  const searchParams = req.query;
  const { pages, count, data } = await getEvents(searchParams, searchParams);
  res.send({ status: 200, pages, count, data });
};

export const updateEvents = async (req, res) => {
  const { email } = req.organizer;
  const { slug } = req.params;
  const updateTo = JSON.parse(JSON.stringify(req.body));
  if (email !== dataValues.organizer.email) {
    return res.status(403).send({
      status: 403,
      message: 'Unathorized to perform this action'
    });
  }

  let eventImage = req.file ? await uploadCloudinary(req.file.buffer) : null;
  if (req.file) {
    updateTo.eventImage = eventImage;
  }
  const [result, [data]] = await Event.update(updateTo, {
    where: { slug },
    returning: true
  });

  res.send({
    status: 200,
    message: 'Successfully Updated',
    data
  });
};

export const likeUnlikeEvent = async (req, res) => {
  const { email } = req.user;
  const { slug } = req.params;
  const { data, isLiked, likedBy } = await handleLikeUnlike(email, slug);
  res.send({ status: 200, isLiked, data, likedBy });
};
