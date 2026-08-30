const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ msg: 'Unauthorized, role is missing' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                msg: `Forbidden: ${req.user.role} is not allowed to access this resource` 
            });
        }
        next();
    };
};

module.exports = authorizeRoles;
