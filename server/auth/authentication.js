const user = require('../model/user');
const sessionRepository = require('../repository/session-repository');

module.exports.authenticate = function (request, response, next) {
    if (!request.headers.session) {
        response.status(401).json({ message: 'Unauthorized session' });
        return;
    }
    if (!sessionRepository.validateSession(request.headers.session)) {
        response.status(401).json({ message: 'Unauthorized session' });
        return;
    }
    next();
}