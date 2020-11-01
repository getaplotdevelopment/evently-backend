"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _googleMapsServicesJs = require("@googlemaps/google-maps-services-js");

var _httpError = require("../errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  GOOGLE_MAP_KEY
} = process.env;

exports.default = async address => {
  const client = new _googleMapsServicesJs.Client({});
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
  const {
    results,
    status
  } = locPayload.data;

  if (status !== 'ZERO_RESULTS' && status !== 'OK') {
    throw new _httpError2.default(422, `Google Map, ${locPayload.data.error_message}`);
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