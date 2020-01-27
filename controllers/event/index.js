import models from '../../models';
import slugGenerator from '../../helpers/slugGenerator';
import eventStatuschecker from '../../helpers/eventHelper/eventStatuschecker';
import uploadCloudinary from '../../helpers/eventHelper/uploadCloudinary'

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
  let eventImage = req.file ? await uploadCloudinary(req.file.buffer): null
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

export const getOrganizerEvents = async(req, res) => {
  const { email } = req.organizer
  
  const data = await Event.findAll({where: {'organizer.email': email}})
  const count = data.length
  
  res.send({status: 200, count, data})

}
