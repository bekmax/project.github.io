const User = require('../model/user');

let users = [];

module.exports.getUserByUsername = function(username){
    const user = users.findIndex(function(item){
        return item.username === username;
    });
    if(user != -1){
        return users[user];
    } else{
        throw Error('No such user in the system!');
    }
}



// Default users
users.push(new User('admin', '1111'));
users.push(new User('user', '0000'));