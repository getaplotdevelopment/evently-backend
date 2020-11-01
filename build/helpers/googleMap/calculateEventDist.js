"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userLocationEvents = exports.nearByCity = exports.isInCityRange = undefined;

var _googleMapsServicesJs = require("@googlemaps/google-maps-services-js");

const {
  GOOGLE_MAP_KEY
} = process.env;

const isInCityRange = exports.isInCityRange = async ({
  distance,
  duration
}) => {
  const {
    text
  } = distance;
  const kilometer = text.split(' ')[0];
  const averageCityDistance = 15; // km

  const maxCityDistance = 60; // km

  if (maxCityDistance >= kilometer && kilometer >= averageCityDistance) {
    return {
      distance,
      duration,
      status: true
    };
  }

  return {
    status: false
  };
};

const nearByCity = exports.nearByCity = async (origins, destinations) => {
  const client = new _googleMapsServicesJs.Client({});
  const locPayload = await client.distancematrix({
    params: {
      key: GOOGLE_MAP_KEY,
      origins,
      destinations
    }
  });
  const {
    status,
    rows
  } = locPayload.data;
  const distanceInKm = rows[0].elements[0];
  return isInCityRange(distanceInKm);
};

const userLocationEvents = exports.userLocationEvents = async (origins, destinations) => {
  const client = new _googleMapsServicesJs.Client({});
  const locPayload = await client.distancematrix({
    params: {
      key: GOOGLE_MAP_KEY,
      origins,
      destinations
    }
  });
  const {
    status,
    rows
  } = locPayload.data;
  const {
    distance,
    duration
  } = rows[0].elements[0];

  if (!distance) {
    return {
      status: false
    };
  }

  const {
    text
  } = distance;
  const eventDistance = text.split(' ')[0];
  const averageCityDistance = 15; // km

  if (eventDistance <= averageCityDistance) {
    return {
      distance,
      duration,
      status: true
    };
  }

  return {
    status: false
  };
};