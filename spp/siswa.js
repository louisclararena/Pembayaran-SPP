const express = require("express")
const app = express()
app.use(express.json())

// call model of siswa
const siswa = require("../models/index").siswa

// library md5
const md5 = require("md5")

// library untuk mendapat token
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeItuAsik"

// -------- library untuk upload file ---------
// multer -> untuk membaca data request dari form-data
const multer = require("multer")
// path -> untuk manage alamat direktori file
const path = require("path")
// fs -> untuk manage file
const fs = require("fs")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image")
    },
    filename: (req, file, cb) => {
        cb(null, "image-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})
// -------------------------------------------
// middleware for allow the request from body (agar bisa membaca data pada body)
app.use(express.urlencoded({extended: true}))

// post auth
app.post("/auth", async(req, res) => {
    let params = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    let result = await siswa.findOne({where: params})
    if(result) {
        let payload = JSON.stringify(result)

        // generate token
        let token = jwt.sign(payload, SECRET_KEY)
        res.json({
            logged: true,
            data: result,
            token: token
        })
    } else {
        res.json({
            logged: false,
            message: "Invalid username or password"
        })
    }
})

app.get("/", auth, async(req, res) => {
    siswa.findAll({
        include: ["kelas", "spp"]
    })
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.get("/:nisn", auth, (req, res) => {
    siswa.findOne({
        where: {nisn: req.params.nisn}
    })
    .then(siswa => {
        res.json(siswa)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", upload.single("image"), async(req, res) => {
    if (!req.file) {
        res.json({
            message: "No uploaded file"
        })
    } else {
        // tampung data yg akan dimasukkan
        let data = {
            nisn: req.body.nisn,
            nis: req.body.nis,
            nama: req.body.nama,
            id_kelas: req.body.id_kelas,
            alamat: req.body.alamat,
            no_telp: req.body.no_telp,
            id_spp: req.body.id_spp,
            username: req.body.username,
            password: md5(req.body.password),
            image: req.file.filename
        }

        // execute insert data
        siswa.create(data)
        .then(result => {
            res.json({
                message: "Data has been inserted",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    }
})

app.put("/", upload.single("image"), async(req, res) => {
    // tampung data request yg akan diubah
    let data = {
        nis: req.body.nis,
        nama: req.body.nama,
        id_kelas: req.body.id_kelas,
        alamat: req.body.alamat,
        no_telp: req.body.no_telp,
        id_spp: req.body.id_spp,
        username: req.body.username,

    }

    // key yg menunjukkan data yang akan diubah
    let param = {
        nisn: req.body.nisn
    }

    if (req.file){
        // get data by nisn
        const row = siswa.findOne({where: param})
        .then(result => {
            let oldImage = result.image

            // delete old file
            let pathFile = path.join(__dirname, "../image", oldImage)
            fs.unlink(pathFile, err => console.log(err))
        })
        .catch(error => {
            console.log(eror.message);
        })
        // set new filename
        data.image = req.file.filename
    }

    // execute updated data
    siswa.update(data, {where: param})
    .then(result => {
        res.json({
            message: "Data has been updated",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete("/:nisn", auth, async(req, res) => {
    try {
        let param = {
            nisn: req.params.nisn
        }
        let result = await siswa.findOne({where: param})
        let oldFileName = result.image

        // delete old file
        let dir = path.join(__dirname, "../image", oldFileName)
        fs.unlink(dir, err => console.log(err))
    
        // execute delete data
        siswa.destroy({where: param})
        .then(result => {
            res.json({
                message: "Data has been destroyed",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })

    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

module.exports = app