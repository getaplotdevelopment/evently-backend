import models from '../../models';

const { Event } = models;
export const createEventController = async (req, res) => {
  const {slug, title, description, body, tagList } = req.body;
  const newEvent = {
      slug,
    title, description, body, tagList 
  }
  console.log(newEvent);
  

  const response = await Event.create(newEvent);
  console.log(response);
  
};

