import models from '../../models';
import slugGenerator from '../../helpers/slugGenerator';
import eventStatuschecker from '../../helpers/eventHelper/eventStatuschecker';
import uploadCloudinary from '../../helpers/eventHelper/uploadCloudinary';
import getEvents from '../../helpers/eventHelper/getEvent';
import handleLikeUnlike from '../../helpers/eventHelper/handleLikeUnlike';
const { Event, Likes, Ticket, TicketCategory } = models;

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
  let eventImage = req.file
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
  const formatted_address = await geocode(location)
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
    location: formatted_address,
    organizer: email
  };
  const data = await Event.create(newEvent);
  res.send({ status: 201, data });
};

export const getOrganizerEvents = async (req, res) => {
  const { email } = req.organizer;
  const searchParams = req.query;
  const filterBy = { organizer: email };
  const include = [
      {
        model: Ticket,
        include: [{ model: TicketCategory, as: 'ticketCategory' }]
      }
    ]
  const { pages, count, data } = await getEvents(searchParams, filterBy, Event, include);

  res.send({ status: 200, pages, count, data });
};

export const getAllEvents = async (req, res) => {
  const searchParams = req.query;
  const include = [
      {
        model: Ticket,
        include: [{ model: TicketCategory, as: 'ticketCategory' }]
      }
    ]
  const { pages, count, data } = await getEvents(
    searchParams,
    searchParams,
    Event,
    include
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
  const { slug } = req.params
  
  const event = await Event.findOne({
    where: { slug:'title1-is-to-good-also-12621' }
  })
  const { location, category, startDate } = event 

  console.log(startDate.getTime() - new Date().getTime())
  
  
  const allEvents = await Event.findAll({
    where: { category, 'location.country': location.country }
  })
  
  res.send(allEvents)
}
