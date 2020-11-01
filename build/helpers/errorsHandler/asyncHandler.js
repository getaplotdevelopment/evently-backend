"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const asyncHandler = callback => async (req, res, next) => {
  try {
    await callback(req, res, next);
  } catch (err) {
    const errStatus = err.kind === 'ObjectId' ? 404 : err.statusCode || 500;
    const errMsg = errStatus === 500 ? `Something failed: ${err.message} try again after` : err.message;
    return res.status(errStatus).send({
      status: errStatus,
      error: errMsg
    });
  }
};

exports.default = asyncHandler;