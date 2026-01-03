// src/middleware/roleMiddleware.js
// Accepts array of allowed roles
module.exports = function allowedRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }
    next();
  };
};
