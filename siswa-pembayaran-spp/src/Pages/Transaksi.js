import React from "react"
// import Navbar from "../Component/Navbar"
import TransaksiList from "../Component/TransaksiList"
import { base_url } from "../Config";
import $ from "jquery"
import axios from "axios"

export default class Transaksi extends React.Component {
    constructor() {
        super()
        /**
         * pembuatan state untuk halaman transaksi
         * logika percabangan if -> untuk mengecek apakah user yang mengakses telah melakukan login
            sebagai admin atau belum (karena hal.admin tidak bolleh diakses oleh sembarang user)
         */
        this.state = {
            token: "",
            transaksi: [],
            action: "",
            id_pembayaran: "",
            id_petugas: "",
            nisn: "",
            tgl_bayar: "",
            bulan_dibayar: "",
            tahun_dibayar: "",
            id_spp: "",
            jumlah_bayar: "",
            selectedItem: null,
            dataSPP: [],
            petugas: []
        }

        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
    }

    // fungsi headerConfig -> untuk memberikan header berupa bearer token
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    // getPembayaran -> untuk mengakses API get siswa
    getPembayaran = () => {
        let url = base_url + "/pembayaran"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({transaksi: response.data})
        })
        .catch(error => {
            if(error.response) {
                if(error.response.status) {
                    window.alert(error.response.data.message)
                    this.props.history.push("/login")
                }
            } else {
                console.log(error);
            }
        })
    }

    // akses fungsi diatas pada fungsi componentDidMount
    componentDidMount() {
        this.getPembayaran()
    }

    render(){
        return(
            <div className="transaksi">
                {/* <Navbar /> */}
                <div className="container">
                    <div className="card-header">
                        <h3 className="text-center text-bold text-info mt-2"> Transaksi List </h3>
                        <p className="card-text text-center">Kumpulan data Transaksi yang terdaftar</p>
                    </div>
                    <div className="row">
                        { this.state.transaksi.map(item => (
                            <TransaksiList
                                key = {item.id_pembayaran}
                                nama_petugas = {item.petugas.nama_petugas}
                                nama_siswa = {item.siswa.nama}
                                time = {item.tgl_bayar}
                                jumlah_bayar = {item.jumlah_bayar}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    } 
}