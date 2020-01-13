import models from '../../models';
import slugGenerator from '../../helper/slugGenerator'
const { Event } = models;
export const createEventController = async (req, res) => {
  try {
    const {title, description, body, tagList, category, numberDays, eventImage } = req.body;
    const slug = slugGenerator(title)
    const newEvent = {
      slug,
      title, description, body, tagList, category, numberDays, eventImage
    }
    const response = await Event.create(newEvent);

    res.send(response)
    
  } catch (error) {
    console.log('error');
    
    res.status(500).send(error)
    
  }
  
};

