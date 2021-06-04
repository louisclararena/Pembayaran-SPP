const express = require("express")
const app = express()
app.use(express.json())

// call model for admin
const admin = require("../models/index").admin

// library md5
const md5 = require("md5")

// untuk mengambil token
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeItuAsik"

// middleware for alloww the request from body (agar bisa membaca data pada body)
app.use(express.urlencoded({extended:true}))

// post auth
app.post("/auth", async(req, res) => {
    let params = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    let result = await admin.findOne({where: params})
    if (result) {
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
            message: "Invalid username of password"
        })
    }
})

app.get("/", auth, async(req, res) => {
    admin.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", auth, async(req, res) => {
    // tampung data request yg akan dimasukkan
    let data = {
        nama_admin: req.body.nama_admin,
        username: req.body.username,
        password: md5(req.body.password)
    }

    // execute insert data
    admin.create(data)
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
})

app.put("/", auth, async(req, res) => {
    // key yg menunjukkan data yg akan diubah
    let param = {
        id_admin: req.body.id_admin
    }

    // tampung daya request yg akan diubah
    let data = {
        nama_admin: req.body.nama_admin,
        username: req.body.username,
        password: req.body.password
    }

    // execute update data
    admin.update(data, {where: param})
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

app.delete("/:id_admin", auth, async(req, res) => {
    let id_admin = req.params.id_admin
    let param = {
        id_admin: id_admin
    }

    // execute delete data
    admin.destroy({where : param})
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
})

module.exports = app