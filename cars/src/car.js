const express = require("express")
const cors = require("cors")
const axios = require("axios")
const path = require("node:path")
const {Repository} = require("./lib/repository")
const {ResData} = require("./lib/resData")
const {CarEntity} = require("./lib/carEntity")
const {UserEntity} = require("../../users/src/lib/userEntity")
const {schemaCars, schemaUser} = require("./schema")
const carsPath = path.resolve("database", "cars.json")
const carsRepo = new Repository(carsPath)

const app = express()
app.use(cors())
app.use(express.json())



app.get("/api/cars-getAll", async (req,res)=>{
    try {
        const readFile = await carsRepo.read()
        const resdataTrue = new ResData(200, "malumotlar olindi", readFile)
        res.status(resdataTrue.statusCode).json(resdataTrue)
    } catch (error) {
        const resDataFalse = new ResData(400, "error", error)
        res.status(resDataFalse.statusCode).json(resDataFalse)
    }
})


app.post("/api/cars-create", async (req, res)=>{
    try {
        const body = req.body
        const car = new CarEntity(body.model, body.year, body.price)
        const respone = await schemaCars.validate(car)
        await carsRepo.read()
        await carsRepo.writeAdd(respone.value)
        const resdataTrue = new ResData(201, "malumot qoshildi", respone.value)
        res.status(resdataTrue.statusCode).json(resdataTrue)
    } catch (error) {
        const resDataFalse = new ResData(400, "malumot kiritmadingiz", error)
        res.status(resDataFalse.statusCode).json(resDataFalse)
    }
})


app.delete("/api/cars-delete/:cars_id", async (req, res)=>{
    try {
        const id = req.params.cars_id
        const readFile = await carsRepo.read()
        const carsIndex = readFile.findIndex((el)=>{
            return el.id === id
        })
        console.log(carsIndex);
        
        if (!carsIndex === -1) {
            const resDataFalse = new ResData(400, "bunday id mavjud emas")
            res.status(resDataFalse.statusCode).json(resDataFalse)
        }
    
        const deleteCar = readFile.split(carsIndex, 1)
        await carsRepo.write(readFile)
        const resdataTrue = new ResData(200, "malumot delete qilindi", deleteCar)
        res.status(resdataTrue.statusCode).json(resdataTrue)
    } catch (error) {
        const resDataFalse = new ResData(500, "serverda xatolik", error)
        res.status(resDataFalse.statusCode).json(resDataFalse)
    }
})


app.get("/api/cars-getAll/:cars_id", async (req, res)=>{
    try {
        const id = req.params.cars_id
        const readFile = await carsRepo.read()
        const findId = readFile.find((el)=>{
            return el.id === id
        })

        if (findId) {
            const resdataTrue = new ResData(200, "malumot topildi", findId)
            res.status(resdataTrue.statusCode).json(resdataTrue)
        }
    } catch (error) {
        const resDataFalse = new ResData(404, "id li malumot topilmadi")
        res.status(resDataFalse.statusCode).json(resDataFalse)
    }
})


app.get("/api/user-getAll", async (req, res)=>{ 
    try {
        const response = await axios.get("http://localhost:3000/api/user-getAll")
        const resdataTrue = new ResData(200, "user malumotlari olindi", response.data)
        res.status(resdataTrue.statusCode).json(resdataTrue)
    } catch (error) {
        const resDataFalse = new ResData(404, "serverda xatolik", error)
        res.status(resDataFalse.statusCode).json(resDataFalse)
    }
})


app.post('/api/user-create', async (req, res) => {
    try {
        const { login, password, fullname } = req.body;
        const user = new UserEntity(login, password, fullname);
        const el = await schemaUser.validate(user)
        
        if (typeof el.value.login === "undefined" || typeof el.value.password === "undefined") {
            const resDataFalse = new ResData(400, "login yoki password kirtlmagan")
            res.status(resDataFalse.statusCode).json(resDataFalse)
        }
        
        const response = await axios.post('http://localhost:3000/api/user-create', user);

        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json({ message: error.response.data.message });
        }

        return res.status(500).json({ message: "serverda xatolik" });
    }
});


app.delete("/api/user-delete/:user_id", async (req, res)=>{
    try {
        const id = req.params.user_id
        
        const response = await axios.delete('http://localhost:3000/api/user-delete/' + id )

        res.status(response.status).json(response.data)
    } catch (error) {
        const resDataFalse = new ResData(400, "cars serverda xatolik..")
        res.status(resDataFalse.statusCode).json(resDataFalse)
    }
})


app.get("/api/user-getAll/:user_id", async (req, res) => {
    try {
        const id = req.params.user_id;
        const response = await axios.get(`http://localhost:3000/api/user-getAll/` + id);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Xatolik:", error.message);
        const resData = new ResData(500, "Serverda xatolik yuz berdi");
        res.status(resData.statusCode).json(resData);
    }
});




app.listen(7777, ()=>{
    console.log("car serveri ishga tushdi....");
    
})