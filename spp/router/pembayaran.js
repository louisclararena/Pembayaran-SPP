const express = require("express")
const app = express()
app.use(express.json())

// call model
const pembayaran = require("../models/index").pembayaran
const petugas = require("../models/index").petugas
const siswa = require("../models/index").siswa
const spp = require("../models/index").spp

// library moment -> untuk tanggal
const moment = require("moment")

// call auth
const auth = require("../auth")
app.use(auth)

// middleware for allow the request from body (agar dapat membaca data yg di body)
app.use(express.urlencoded({extended:true}))

app.get("/", async(req, res) => {
    pembayaran.findAll({
        include: ["petugas", "siswa", "spp"]
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

app.post("/", async(req, res) => {
    // ambil nisn
    const nisn = {
        nisn: req.body.nisn
    }

    // ambil id_petugas
    const idPetugas = {
        id_petugas: req.body.id_petugas
    }

    // ambil id_spp
    const idSpp = {
        id_spp: req.body.id_spp
    }

    // findOne id_spp (untuk memanggil data spp)
    spp.findOne({where: idSpp})
    .then((resultSpp) => {
        const nominal = resultSpp.nominal

        // tampung data request yg akan dimasukkan
        let data = {
            id_petugas: req.body.id_petugas,
            nisn: req.body.nisn,
            tgl_bayar: moment().format('YYYY-MM-DD'),
            bulan_dibayar: req.body.bulan_dibayar,
            tahun_dibayar: req.body.tahun_dibayar,
            id_spp: req.body.id_spp,
            jumlah_bayar: nominal
        }

        // execute insert data
        pembayaran.create(data)
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
})

app.put("/", async(req, res) => {
    // tampung data request yg akan diubah
    let data = {
        id_petugas: req.body.id_petugas,
        nisn: req.body.nisn,
        bulan_dibayar: req.body.bulan_dibayar,
        tahun_dibayar: req.body.tahun_dibayar,
        id_spp: req.body.id_spp,
    }

    // key yg menunjukan data yg akan diubah
    let param = {
        id_pembayaran: req.body.id_pembayaran
    }

    //execute updated data
    pembayaran.update(data,{where : param})
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

app.delete("/:id_pembayaran", async(req, res) => {
    let id_pembayaran = req.params.id_pembayaran
    let param = {
        id_pembayaran: id_pembayaran
    }

    //execute delete data
    pembayaran.destroy({where : param})
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