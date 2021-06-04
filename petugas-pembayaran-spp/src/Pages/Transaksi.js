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

    // fungsi Add -> untuk memberikan inisialisasi data dan menambahkan data
    Add = () => {
        $("#modal_transaksi").modal("show")
        this.setState({
            action: "insert",
            id_pembayaran: 0,
            id_petugas: "",
            nisn: "",
            tgl_bayar: "",
            bulan_dibayar: "",
            tahun_dibayar: "",
            id_spp: "",
            jumlah_bayar: "",

        })
    }

    // fungsi Edit -> untuk memberikan inisialisasi dan mengedit data
    Edit = selectedItem => {
        $("#modal_transaksi").modal("show")
        this.setState({
            action: "update",
            id_pembayaran: selectedItem.id_pembayaran,
            id_petugas: selectedItem.id_petugas,
            nisn: selectedItem.nisn,
            tgl_bayar: selectedItem.tgl_bayar,
            bulan_dibayar: selectedItem.bulan_dibayar,
            tahun_dibayar: selectedItem.tahun_dibayar,
            id_spp: selectedItem.id_spp,
            jumlah_bayar: selectedItem.jumlah_bayar,
        })
    }

    // fungsi saveBayar -> untuk menyimpan data pada db dengan mengakses API
    saveBayar = event => {
        event.preventDefault()
        $("#modal_transaksi").modal("hide")
        let form = {
            id_pembayaran: this.state.id_pembayaran,
            id_petugas: this.state.id_petugas,
            nisn: this.state.nisn,
            tgl_bayar: this.state.tgl_bayar,
            bulan_dibayar: this.state.bulan_dibayar,
            tahun_dibayar: this.state.tahun_dibayar,
            id_spp: this.state.id_spp,
            jumlah_bayar: this.state.jumlah_bayar
        }

        let url = base_url + "/pembayaran"
        if(this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getPembayaran()
            })
            .catch(error => console.log(error))
        } else if (this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getPembayaran()
            })
            .catch(error => console.log(error))
        }
    }

    // fungsi dropBayar -> untuk menghapus data
    dropBayar = selectedItem => {
        if(window.confirm("are you sure will delete this item")) {
            let url = base_url + "/pembayaran/" + selectedItem.id_petugas
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getPembayaran()
            })
            .catch(error => console.log(error))
        }
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

    // getSpp -> untuk mengakses API get spp
    getSpp = () => {
        let url = base_url + "/spp"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({dataSPP: response.data})
        })
        .catch(error => {
            console.log(error);
        })
    }

    // getPetugas -> untuk mengakses API get petugas
    getPetugas = () => {
        let url = base_url + "/petugas"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({petugas: response.data})
        })
        .catch(error => {
            console.log(error);
        })
    }

    // akses fungsi diatas pada fungsi componentDidMount
    componentDidMount() {
        this.getPembayaran()
        this.getSpp()
        this.getPetugas()
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
                                onEdit = {() => this.Edit(item)}
                                onDrop = {() => this.dropBayar(item)}
                            />
                        ))}
                    </div>
                    <button className="btn btn-success" onClick={() => this.Add()}>
                        Add Transaksi
                    </button>
                </div>

                {/* modal pembayaran */}
                <div className="modal fade" id="modal_transaksi">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h4>Form Pembayaran</h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={ev => this.saveBayar(ev)}>
                                    Nama Petugas
                                    <div className="form-group">
                                        <select name="petugas" id="petugas" className="form-control" id="exampleFormControlSelect1">
                                            {this.state.petugas.map((v, i) => (
                                                <option selected key={i} value={v.id_spp}>
                                                    {v.nama_petugas}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    NISN
                                    <input type="text" className="form-control mb-1" 
                                    value={this.state.nisn}
                                    onChange={ev => this.setState({nisn: ev.target.value})} />

                                    Tanggal Bayar
                                    <input type="text" className="form-control mb-1" 
                                    value={this.state.tgl_bayar}
                                    onChange={ev => this.setState({tgl_bayar: ev.target.value})} />

                                    Bulan Dibayar
                                    <input type="text" className="form-control mb-1" 
                                    value={this.state.bulan_dibayar}
                                    onChange={ev => this.setState({bulan_dibayar: ev.target.value})} />

                                    Tahun Dibayar
                                    <input type="text" className="form-control mb-1" 
                                    value={this.state.tahun_dibayar}
                                    onChange={ev => this.setState({tahun_dibayar: ev.target.value})} />

                                    Jumlah SPP
                                    <div className="form-group">
                                        <select name="spp" id="spp" className="form-control" id="exampleFormControlSelect1">
                                            {this.state.dataSPP.map((v, i) => (
                                                <option selected key={i} value={v.id_spp}>
                                                    {v.nominal}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-block btn-success">
                                        Simpan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } 
}