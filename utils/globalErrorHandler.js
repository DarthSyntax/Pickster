module.exports = (res, req, next, err) => {
  res.status(err.status || 500);
  res.json({
    error: err.message,
    stack: err.stack,
  });
};
