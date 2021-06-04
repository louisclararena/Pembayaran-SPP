const express = require("express")
const app = express()

// call model for kelas
const kelas = require("../models/index").kelas

// call auth
const auth = require("../auth")
app.use(auth)

// middleware for allow the request from body (agar bisa membaca data yg dibody)
app.use(express.urlencoded({extended:true}))

app.get("/", async(req, res) => {
    kelas.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.get("/:id_kelas", async(req, res) => {
    kelas.findOne({where: {id_kelas: req.params.id_kelas}})
    .then(kelas => {
        res.json(kelas)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", async(req, res) => {
    // tampung data request yg akan dimasukkan
    let data = {
        nama_kelas: req.body.nama_kelas,
        kompetensi_keahlian: req.body.kompetensi_keahlian
    }

    // execute insert data
    kelas.create(data)
    .then(result => {
        res.json({
            message: "data has been inserted",
            data:result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.put("/", async(req, res) => {
    // key yg menunjukkan data yg akan diubah
    let param = {
        id_kelas: req.body.id_kelas
    }

    // tampung data request yg akan diubah
    let data = {
        nama_kelas: req.body.nama_kelas,
        kompetensi_keahlian: req.body.kompetensi_keahlian
    }

    // execute update data
    kelas.update(data, {where: param})
    .then(result => {
        res.json({
            message: "data has been updated",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete("/:id_kelas", async(req, res) => {
    // variable
    let id_kelas = req.params.id_kelas

    // object
    let param = {
        id_kelas: id_kelas
    }

    // execute delete data
    kelas.destroy({where: param})
    .then(result => {
        res.json({
            message: "data has been deleted"
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

module.exports = app