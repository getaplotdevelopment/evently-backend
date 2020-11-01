"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _createFeaturedEvent = require("../../controllers/featuredEvents/createFeaturedEvent");

var _createFeaturedEvent2 = _interopRequireDefault(_createFeaturedEvent);

var _retrieveFeaturedEvents = require("../../controllers/featuredEvents/retrieveFeaturedEvents");

var _auth = require("../../middleware/users/auth");

var _auth2 = _interopRequireDefault(_auth);

var _checkToken = require("../../middleware/users/checkToken");

var _checkToken2 = _interopRequireDefault(_checkToken);

var _checkFeatured = require("../../middleware/featuredEvent/checkFeatured");

var _checkEvent = require("../../middleware/event/checkEvent");

var _asyncHandler = require("../../helpers/errorsHandler/asyncHandler");

var _asyncHandler2 = _interopRequireDefault(_asyncHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

const multPart = (0, _multer2.default)();
router.post('/featuredEvent/:slug', multPart.none(), (0, _asyncHandler2.default)(_checkToken2.default), (0, _asyncHandler2.default)(_auth2.default), (0, _asyncHandler2.default)(_checkFeatured.checkOrganizer), (0, _asyncHandler2.default)(_checkEvent.checkEvent), (0, _asyncHandler2.default)(_checkFeatured.checkDates), (0, _asyncHandler2.default)(_createFeaturedEvent2.default));
router.get('/featuredEvent/all', (0, _asyncHandler2.default)(_retrieveFeaturedEvents.retrieveFeaturedEvents));
router.get('/featuredEvent/:slug', (0, _asyncHandler2.default)(_checkFeatured.checkFeaturedEvent), (0, _asyncHandler2.default)(_retrieveFeaturedEvents.retrieveOneFeaturedEvent));
exports.default = router;