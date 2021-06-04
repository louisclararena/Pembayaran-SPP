import React from "react"
// import Navbar from "../Component/Navbar"
import axios from "axios"
import { base_url } from "../Config";

export default class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            petugasName: null,
            dataPetugas: 0,
            dataTransaksi: 0,
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
            headers: { Authorization: `Bearer ${this.state.token}`}
        }
        return header
    }

    // fungsi getPetugas -> untuk memeberikan state dataPetugas sesuai jumlah data
    getPetugas = () => {
        let url = base_url + "/petugas"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({dataPetugas: response.data.length})
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

    // fungsi getTransaksi -> untuk memeberikan state dataTransaksi sesuai jumlah data
    getTransaksi = () => {
        let url = base_url + "/pembayaran"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({dataTransaksi: response.data.length})
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

    // fungsi getAdmins -> untuk mengupdate state adminName
    getAdmins = () => {
        let petugas = JSON.parse(localStorage.getItem('petugas'))
        this.setState({petugasName: petugas.nama_petugas})
    }

    // fungsi componentDidMount => untuk mendapatkan data dari masing" fungsi diatas sebelum data dirender
    componentDidMount() {
        this.getPetugas()
        this.getTransaksi()
        this.getAdmins()
    }

    render(){
        return(
            <div className="home">
                {/* <Navbar /> */}
                <div className="container mt-2">
                    <h3 className="my-2">
                        <strong>Welcome Back, {this.state.petugasName}</strong>
                    </h3>
                    <div className="row">

                        {/* data petugas */}
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-2">
                            <div className="card">
                                <div className="card-body bg-secondary">
                                    <h4 className="text-dark">
                                        <strong>Data Petugas</strong>
                                    </h4>
                                    <h1 className="text-white">
                                        <strong>{this.state.dataPetugas}</strong>
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* data transaksi */}
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-2">
                            <div className="card">
                                <div className="card-body bg-warning">
                                    <h4 className="text-dark">
                                        <strong>Data Transaksi</strong>
                                    </h4>
                                    <h1 className="text-white">
                                        <strong>{this.state.dataTransaksi}</strong>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } 
}
