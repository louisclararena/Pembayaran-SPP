import React from "react"
// import Navbar from "../Component/Navbar"
import axios from "axios"
import { base_url } from "../Config";

export default class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            adminName: null,
            dataSiswa: 0,
            dataTransaksi: 0,
            dataAdmin: 0
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

    // fungsi getSiswa -> untuk memeberikan state dataSiswa sesuai jumlah data
    getSiswa = () => {
        let url = base_url + "/siswa"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({dataSiswa: response.data.length})
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
        let siswa = JSON.parse(localStorage.getItem('siswa'))
        this.setState({adminName: siswa.nama})
    }

    // fungsi componentDidMount => untuk mendapatkan data dari masing" fungsi diatas sebelum data dirender
    componentDidMount() {
        this.getSiswa()
        this.getTransaksi()
        this.getAdmins()
    }

    render(){
        return(
            <div className="home">
                {/* <Navbar /> */}
                <div className="container mt-2">
                    <h3 className="my-2">
                        <strong>Welcome Back, {this.state.adminName}</strong>
                    </h3>
                    <div className="row">

                        {/* data siswa */}
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-2">
                            <div className="card">
                                <div className="card-body bg-info">
                                    <h4 className="text-dark">
                                        <strong>Data Siswa</strong>
                                    </h4>
                                    <h1 className="text-white">
                                        <strong>{this.state.dataSiswa}</strong>
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
