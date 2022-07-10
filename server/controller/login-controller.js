const userRepository = require('../repository/user-repository');
const sessionRepository = require('../repository/session-repository');

module.exports.login = function (request, response, next) {
    const username = request.body.username;
    const password = request.body.password;
    
    try {
        let user = userRepository.getUserByUsername(username);
        if (user.password === password) {
            const newSession = sessionRepository.createSession(user.username);
            response.status(201).json(newSession);
        } else {
            response.status(403).json({ message: 'Password does not match' });
        }
    } catch (e) {
        response.status(404).json({ message: e.message });
    }
};