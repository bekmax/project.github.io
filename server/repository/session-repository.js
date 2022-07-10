const Session = require('../model/session');
const userRepository = require('../repository/user-repository');

module.exports.createSession = function(username){
    return new Session(username);
}

module.exports.validateSession = function(session){
    try{
        let username = session.split(':')[0];
        let user = userRepository.getUserByUsername(username);
        return user ? true : false;
    } catch(e){
        return false;
    }
}

module.exports.getUserBySession = function(session){
    let username = session.split(':')[0];
    return userRepository.getUserByUsername(username);
}



