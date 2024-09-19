const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.json({
    error: {
      status: "error",
      statusCode,
      message: err.message || "An unexpected error occurred",
    },
  });
};

module.exports = errorHandler;
