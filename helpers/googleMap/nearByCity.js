import { Client } from '@googlemaps/google-maps-services-js';
const { GOOGLE_MAP_KEY } = process.env;

export const isInCityRange = async ({ distance, duration }) => {
  const { text } = distance;
  const kilometer = text.split(' ')[0];
  const averageCityDistance = 15; //km
  const maxCityDistance = 60; //km
  if (maxCityDistance >= kilometer && kilometer >= averageCityDistance) {
    return { distance, duration, status: true };
  }
  return { status: false };
};

export default async (origins, destinations) => {
  const client = new Client({});
  const locPayload = await client.distancematrix({
    params: {
      key: GOOGLE_MAP_KEY,
      origins,
      destinations
    }
  });
  const { status, rows } = locPayload.data;
  const distanceInKm = rows[0].elements[0];
  return isInCityRange(distanceInKm);
};
