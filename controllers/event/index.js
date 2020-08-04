import { Op, Sequelize } from 'sequelize';
import eventStatuschecker from '../../helpers/eventHelper/eventStatuschecker';
import getEvents from '../../helpers/eventHelper/getEvent';
import handleLikeUnlike from '../../helpers/eventHelper/handleLikeUnlike';
import uploadCloudinary from '../../helpers/eventHelper/uploadCloudinary';
import geocode from '../../helpers/googleMap/goecode';
import slugGenerator from '../../helpers/slugGenerator';
import nearByCity from '../../helpers/googleMap/nearByCity';
import models from '../../models';
import getSingleEvent from '../../helpers/eventHelper/getSingleEvent';
import sendEmail from '../../helpers/sendEmail/callMailer';
import { getRole } from '../../helpers/sendEmail/emailTemplates';

const { Event, Likes, Ticket, TicketCategory } = models;

const includeTicket = () => {
  return [
    {
      model: Ticket,
      include: [{ model: TicketCategory, as: 'ticketCategory' }]
    }
  ];
};
export const createEventController = async (req, res) => {
  const {
    title,
    description,
    tagList,
    category,
    numberDays,
    startDate,
    finishDate,
    startTime,
    currentMode,
    eventType,
    location,
    availableTickets
  } = req.body;
  const eventImage = req.file
    ? await uploadCloudinary(req.file.buffer)
    : req.body.eventImage;
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
  const formatted_address = await geocode(location);
  const newEvent = {
    slug,
    title,
    description,
    tagList: tagList.split(','),
    category,
    numberDays,
    eventImage,
    startDate,
    finishDate,
    startTime,
    currentMode,
    eventType,
    location: formatted_address,
    organizer: email,
    availableTickets
  };
  const data = await Event.create(newEvent);
  res.status(201).send({ status: 201, data });
};

export const getOrganizerEvents = async (req, res) => {
  const { email } = req.organizer;
  const searchParams = req.query;
  const filterBy = { organizer: email };
  const { pages, count, data } = await getEvents(
    searchParams,
    filterBy,
    Event,
    includeTicket()
  );

  res.send({ status: 200, pages, count, data });
};

export const getAllEvents = async (req, res) => {
  const searchParams = req.query;
  const { pages, count, data } = await getEvents(
    searchParams,
    searchParams,
    Event,
    includeTicket()
  );
  res.send({ status: 200, pages, count, data });
};

export const updateEvents = async (req, res) => {
  const { email } = req.organizer;
  const { slug } = req.params;
  const updateTo = JSON.parse(JSON.stringify(req.body));
  if (updateTo.currentMode) {
    await eventStatuschecker(updateTo.currentMode.split(','));
  }
  const { dataValues } = await Event.findOne({
    where: { slug }
  });

  if (email !== dataValues.organizer) {
    return res.status(403).send({
      status: 403,
      message: 'Unauthorized to perform this action'
    });
  }

  const eventImage = req.file ? await uploadCloudinary(req.file.buffer) : null;
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

export const likedEvent = async (req, res) => {
  const { email } = req.user;
  const searchParams = req.query;
  searchParams.sort = 'updatedAt:desc';
  const filterBy = { email, isLiked: true };
  const { pages, count, data: liked } = await getEvents(
    searchParams,
    filterBy,
    Likes,
    null
  );
  const jsonObj = JSON.parse(JSON.stringify(liked));

  const mapResponse = Promise.all(
    jsonObj.map(async item => {
      const { slug } = item;
      const event = await Event.findAll({
        where: { slug }
      });
      item.event = event[0];
      return item;
    })
  );
  const data = await mapResponse;
  res.send({ status: 200, pages, count, data });
};

export const getSimilarEvents = async (req, res) => {
  const { slug } = req.params;
  const queryParams = req.query;
  queryParams.sort = 'updatedAt:desc';
  const event = await getSingleEvent(slug);
  const { location, category } = event;
  const filterBy = {
    category,
    'location.country': location.country,
    finishDate: { [Op.gte]: new Date().toISOString() }
  };
  const { pages, count, data } = await getEvents(
    queryParams,
    filterBy,
    Event,
    includeTicket()
  );
  res.send({ status: 200, pages, count, data });
};

export const getEventsNearCities = async (req, res) => {
  const { slug } = req.params;
  const event = await getSingleEvent(slug);
  const { location } = event;
  const origins = [location.locations];
  if (origins[0].lat == 0 && origins[0].lng == 0) {
    return res.send({
      status: 200,
      data: []
    });
  }
  const queryParams = {};
  const filterBy = {
    'location.country': location.country,
    finishDate: { [Op.gte]: new Date().toISOString() }
  };
  const { pages, count, data } = await getEvents(
    queryParams,
    filterBy,
    Event,
    includeTicket()
  );
  const eventsNearCity = [];
  for (const event of data) {
    const destinations = [event.location.locations];
    const response = await nearByCity(origins, destinations);
    if (response.status) {
      event.dataValues.distance = response.distance;
      event.dataValues.duration = response.duration;
      eventsNearCity.push(event);
    }
  }
  res.send({ status: 200, data: eventsNearCity });
};

export const cancelFreeEvent = async (req, res) => {
  const { slug } = req.params;
  const condition = { slug, eventType: false };
  const eventStatus = 'canceled';
  const cancelEvent = await Event.update(
    {
      eventStatus
    },
    {
      where: condition
    }
  );
  if (cancelEvent[0] == 1) {
    res.status(200).json({
      status: 200,
      message: 'Event successfuly canceled'
    });
  }
};
export const cancelPaidEvent = async (req, res) => {
  const { slug } = req.params;
  const condition = { slug, eventType: true };
  const eventStatus = 'canceled';
  const cancelEvent = await Event.update(
    {
      eventStatus
    },
    {
      where: condition
    }
  );
  if (cancelEvent[0] == 1) {
    res.status(200).json({
      status: 200,
      message: 'Event successfuly canceled'
    });
  }
};
