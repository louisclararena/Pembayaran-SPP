const express = require("express")
const app = express()

// call model for spp
const spp = require("../models/index").spp

// call auth
const auth = require("../auth")
app.use(auth)

// middleware for allow the request from body (agar bisa membaca data yg di body)
app.use(express.urlencoded({extended:true}))

app.get("/", async(req, res) => {
    spp.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.get("/:id_spp", async(req, res) => {
    spp.findOne({ where: {id_spp: req.params.id_spp} })
    .then(spp => {
        res.json(spp)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", async(req, res) => {
    // tampung data request yang akan dimasukkan
    let data = {
        tahun: req.body.tahun,
        nominal: req.body.nominal
    }

    // execute insert data
    spp.create(data)
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
    // key yg menunjukan data yg akan diubah
    let param = { 
        id_spp: req.body.id_spp 
    }

    // tampung data request yg akan diubah
    let data = {
        tahun: req.body.tahun,
        nominal: req.body.nominal
    }

    // execute update data
    spp.update(data, {where: param})
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

app.delete("/:id_spp", async(req, res) => {
    // variable
    let id_spp = req.params.id_spp

    // object
    let param = { 
        id_spp: id_spp
    }
    
    // let result = await spp.findOne({where: param})
            
    // execute delete data
    spp.destroy({where: param})
    .then(result => {
        res.json({
            message: "data has been deleted",
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

module.exports = app