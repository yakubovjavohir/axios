const uuid = require("uuid")

class UserEntity {
    constructor(login, password, fullname){
        this.id = uuid.v4()
        this.login = login
        this.password = password
        this.fullname = fullname
    }
}
module.exports = {UserEntity}