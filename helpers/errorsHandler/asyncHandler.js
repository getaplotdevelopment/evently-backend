const asyncHandler = callback => async (req, res, next) => {
  try {
    await callback(req, res, next);
  } catch (err) {
    // console.log('err', err);
    const errStatus = err.kind === 'ObjectId' ? 404 : err.statusCode || 500;
    const errMsg =
      errStatus === 500
        ? `Something failed: ${err.message} try again after`
        : err.message;
    res.status(errStatus).send({
      status: errStatus,
      error: errMsg
    });
  }
};
export default asyncHandler;
