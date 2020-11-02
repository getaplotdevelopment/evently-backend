import { Client } from '@googlemaps/google-maps-services-js';
import httpError from '../errorsHandler/httpError';

const { GOOGLE_MAP_KEY } = process.env;
export default async address => {
  const client = new Client({});
  const emptyLocation = {
    address: null,
    country: null,
    place_id: null,
    locations: {
      lat: 0,
      lng: 0
    }
  };
  if (!address) {
    return emptyLocation;
  }
  const locPayload = await client.geocode({
    params: {
      address,
      key: GOOGLE_MAP_KEY
    }
  });
  const { results, status } = locPayload.data;
  if (status !== 'ZERO_RESULTS' && status !== 'OK') {
    throw new httpError(422, `Google Map, ${locPayload.data.error_message}`);
  }
  if (results.length === 0) {
    return emptyLocation;
  }
  const locationArray = results[0].formatted_address.split(',');
  const country = locationArray[locationArray.length - 1].trim();  
  const locationObj = {
    address: results[0].formatted_address,
    country,
    place_id: results[0].place_id,
    locations: results[0].geometry.location
  };
  return locationObj;
};
