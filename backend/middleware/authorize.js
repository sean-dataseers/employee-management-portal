


const authorize = (allowedLevels) => {
    return (req, res, next) => {
         const user_permissions = req.user.permission_level;
         allowedLevels.includes(user_permissions) ? next() : res.status(403).json({message: 'You do not have permission to do this.'})
    }


}

module.exports = authorize;