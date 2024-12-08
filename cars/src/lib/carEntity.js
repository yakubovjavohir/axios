const uuid = require("uuid")

class CarEntity {
    constructor(model, year, price = 0){
        this.id = uuid.v4()
        this.model = model
        this.year = year
        this.price = price
    }
}
module.exports = {CarEntity}