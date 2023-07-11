// const rolesArr = require('../config/role_list')
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles) return res.setStatus(401)
        const rolesArr = [...allowedRoles];
        const result = req.roles.map(role => rolesArr.includes(role)).find(val => val)
        if(!result) return res.sendStatus(401)
        next()
    }
}

module.exports = verifyRoles