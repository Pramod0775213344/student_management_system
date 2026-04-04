module.exports = (roles = []) => {
  // roles parameter eka string ekak nam eka array ekakata convert karanawa
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    // req.user.role eka allowedRoles array eke thiyenawada balanawa
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).send("Forbidden: Access limited to " + allowedRoles.join(", "));
    }
    next();
  };
};
