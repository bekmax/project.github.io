module.exports = class Session{
    constructor(username){
        this.session = username+':'+Date.now();
    }
}
