const express = require("express")
const app = express()
app.use(express.json())

// call model for petugas
const petugas = require("../models/index").petugas

// library md5
const md5 = require("md5")

// untuk memanggil auth
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
        cb(null, "./petugas_image")
    },
    filename: (req, file, cb) => {
        cb(null, "image-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})
// -------------------------------------------

// middleware for allow the request from body (agar bisa membaca data pada body)
app.use(express.urlencoded({extended:true}))

// post auth
app.post("/auth", async(req, res) => {
    let params = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    let result = await petugas.findOne({where: params})
    if (result) {
        let payload = JSON.stringify(result)

        // generate token
        let token = jwt.sign(payload, SECRET_KEY)
        res.json({
            logged: true,
            data: result,
            token: token
        })
    }
})

app.get("/", auth, async(req, res) => {
    petugas.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.get("/:id_petugas", auth, async(req, res) => {
    petugas.findOne({
        where: {id_petugas: req.params.id_petugas}
    })
    .then(petugas => {
        res.json(petugas)
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
        // tampung data request yg akan dimasukkan
        let data = {
            username: req.body.username,
            password: md5(req.body.password),
            nama_petugas: req.body.nama_petugas,
            level: req.body.level,
            image: req.file.filename
        }

        // execute insert data
        petugas.create(data)
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
        username: req.body.username,
        password: md5(req.body.password),
        nama_petugas: req.body.nama_petugas,
        level: req.body.level
    }

    // key yg menunjukkan data yg akan diubah
    let param = {
        id_petugas: req.body.id_petugas
    }

    if (req.file) {
        // get data by id
        const row = petugas.findOne({where: param})
        .then(result => {
            let oldFile = result.image

            // delete old file
            let dir = path.join(__dirname, "../petugas_image", oldFile)
            fs.unlink(dir, err => console.log(err))
        })
        .catch(error => {
            console.log(error.message);
        })
        
        // set new filename
        data.image = req.file.filename
    }

    // execute update data
    petugas.update(data, {where: param})
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

app.delete("/:id_petugas", auth, async(req, res) => {
    try {
        let id_petugas = req.params.id_petugas
        let param = {
            id_petugas: id_petugas
        }
        let result = await petugas.findOne({where: param})
        let oldFile = result.image

        // delete old file
        let dir = path.join(__dirname, "../petugas_image", oldFile)
        fs.unlink(dir, err => console.log(err))

        // execute delete data
        petugas.destroy({where: param})
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