const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())

const spp = require("./router/spp")
const kelas = require("./router/kelas")
const admin = require("./router/admin")
const siswa = require("./router/siswa")
const petugas = require("./router/petugas")
const pembayaran = require("./router/pembayaran")

app.use("/bayar/api/v1/spp", spp)
app.use("/bayar/api/v1/kelas", kelas)
app.use("/bayar/api/v1/admin", admin)
app.use("/bayar/api/v1/siswa", siswa)
app.use("/bayar/api/v1/petugas", petugas)
app.use("/bayar/api/v1/pembayaran", pembayaran)

app.use(express.static(__dirname))

app.listen(8000, () => {
    console.log("Server run on port 8000");
})