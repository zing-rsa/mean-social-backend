const { authorizeAny, authorizeAll } = require('./authorize.mw')
const authenticate = require('./authenticate.mw')

module.exports = {
    authenticate,
    authorizeAll,
    authorizeAny
}