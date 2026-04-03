module.exports = (roles = []) => {
  return (req, res, next) => {
    // Roles list ekak pass karanna (e.g. ['admin', 'teacher'])
    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Forbidden: Access limited to " + roles.join(", "));
    }
    next();
  };
};
