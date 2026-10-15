// Rute tidak ada
export const notFound = (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

// Handler error
export const errorHandler = (err, req, res, next) => {
  let status = res.statusCode !== 200 ? res.statusCode : err.status || 500;
  let message = err.message || "Internal Server Error";

  // ID tidak valid
  if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Data duplikat
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} sudah dipakai`;
  }

  // Validasi schema
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  if (status >= 500) console.error(err);

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== "production" && status >= 500 ? { stack: err.stack } : {}),
  });
};
