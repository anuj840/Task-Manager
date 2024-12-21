 
 
module.exports = () => {
  return (req, res, next) => {
    const userRole = req.user.role;  // Assuming `req.user.role` is set during authentication

    // Check if the user's role is either 'manager' or 'admin'
    if (userRole !== 'manager' && userRole !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }

    next();  // Proceed if the role is either 'manager' or 'admin'
  };
};
