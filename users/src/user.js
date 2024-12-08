const express = require("express")
const cors = require("cors")
const path = require("node:path")
const {Repository} = require("./lib/repository")
const {ResData} = require("./lib/resData")

const userPath = path.resolve("database", "user.json")
const userRepo = new Repository(userPath)

const app = express()
app.use(cors())
app.use(express.json())



app.get("/api/user-getAll", async (req,res)=>{
    try {
        const readFile = await userRepo.read()
        res.json(readFile)
    } catch (error) {
        const resDataFalse = new ResData(400, "error", error)
        res.status(resDataFalse.statusCode).json(resDataFalse)
    }
})


app.post("/api/user-create", async (req, res)=>{
    try {
        const body = req.body
        await userRepo.writeAdd(body)
        const resdataTrue = new ResData(201, "user ga malumot qoshildi", body)
        res.status(resdataTrue.statusCode).json(resdataTrue)
    } catch (error) {
        const resDataFalse = new ResData(400, "malumot kiritmadingiz", error)   
        res.status(resDataFalse.statusCode).json(resDataFalse)
    }
})


app.delete("/api/user-delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const readFile = await userRepo.read();
        const userIndex = readFile.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            const resDataFalse = new ResData(404, "Bunday foydalanuvchi mavjud emas");
            return res.status(resDataFalse.statusCode).json(resDataFalse);
        }

        const deletedUser = readFile.splice(userIndex, 1)
        await userRepo.write(readFile);
        const resDataTrue = new ResData(200, "Foydalanuvchi muvaffaqiyatli o'chirildi", deletedUser);
        return res.status(resDataTrue.statusCode).json(resDataTrue);
    } catch (error) {
        console.error("Server xatoligi:", error);
        const resDataFalse = new ResData(500, "Serverda xatolik yuz berdi", error.message);
        return res.status(resDataFalse.statusCode).json(resDataFalse);
    }
});


app.get("/api/user-getAll/:user_id", async (req, res)=>{
    try {
        const id = req.params.user_id
        const readFile = await userRepo.read()
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


app.listen(3000, ()=>{
    console.log("user serveri ishga tushdi....");
    
})