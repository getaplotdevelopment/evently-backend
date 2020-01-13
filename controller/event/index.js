import models from '../../models';
import random from 'lodash.random'
import slugify from 'slugify'
const { Event } = models;
export const createEventController = async (req, res) => {
  const {title, description, body, tagList } = req.body;
  const slug = slugify(title) + '-' + random(10000, 20000)
  const newEvent = {
      slug,
    title, description, body, tagList 
  }
  try {
  const response = await Event.create(newEvent);
  
  if (!response){
    throw new Error('brr rrr')
  }
  res.send(response)
  
  } catch (error) {
    console.log('error');
    
    res.send(error)
    
  }
  
};

