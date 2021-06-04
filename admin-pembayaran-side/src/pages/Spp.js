import React from "react"
// import Navbar from "../Component/Navbar"
import axios from "axios"
import { base_url } from "../Config";
import $ from "jquery"

export default class SPP extends React.Component {
    constructor() {
        super()
        /**
         * siapkan state untuk pembuatan halaman spp
         * logika percabangan if -> untuk mengecek apakah user yg mengakses telah melakukan login
            sebagai admin atau belum
         */
        this.state = {
            token: "",
            action: "",
            spp: [],
            id_spp: "",
            tahun: "",
            nominal: ""
        }

        if(localStorage.getItem("token")) {
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

    // fungsi getSpp -> untuk mengakses API get spp
    getSpp = () => {
        let url = base_url + "/spp"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({spp: response.data})
        })
        .catch(error => {
            if(error.response) {
                if(error.response.status) {
                    window.alert(error.response.data.message)
                    this.props.history.push("login")
                }
            } else {
                console.log(error);
            }
        })
    }

    // fungsi Add -> untuk memberikan inisialisasi data dan menambahkan data
    Add = () => {
        $("#modal_spp").modal("show")
        this.setState({
            action: "insert",
            id_spp: 0,
            tahun: "",
            nominal: ""
        })
    }

    // fungsi Edit -> untk memberikan inisialisasi data dan mengedit data
    Edit = selectedItem => {
        $("#modal_spp").modal("show")
        this.setState({
            action: "update",
            id_spp: selectedItem.id_spp,
            tahun: selectedItem.tahun,
            nominal: selectedItem.nominal
        })
    }

    // fungsi saveSpp -> untuk menyimpn data pada db dengan mengakses API
    saveSpp = event => {
        event.preventDefault()
        $("#modal_spp").modal("hide")
        let form = {
            id_spp: this.state.id_spp,
            tahun: this.state.tahun,
            nominal: this.state.nominal
        }

        let url = base_url + "/spp"
        if (this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getSpp()
            })
            .catch(error => console.log(error))
        } else if (this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getSpp()
            })
            .catch(error => console.log(error))
        }
    }

    // fungsi dropSpp -> untuk menghapus data
    dropSpp = selectedItem => {
        if (window.confirm("are you sure will delete this item ?")) {
            let url = base_url + "/spp/" + selectedItem.id_spp
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getSpp()
            })
            .catch(error => console.log(error))
        }
    }

    // akses getSpp pada componentDidMount
    componentDidMount() {
        this.getSpp()
    }

    render(){
        return(
            <div className="spp">
                {/* <Navbar /> */}
                <div className="container">
                    <div className="card-header">
                        <h3 className="text-center text-bold text-info mt-2"> SPP List</h3>
                        <p class="card-text text-center">Kumpulan data spp</p>
                    </div>
                    <table class="table">
                        <thead class="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Tahun</th>
                                <th>Nominal</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.spp.map((item, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item.tahun}</td>
                                    <td>{item.nominal}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info m-1"
                                        onClick={() => this.Edit(item)}>
                                            Edit
                                        </button>

                                        <button className="btn btn-sm btn-danger m-1"
                                        onClick={() => this.dropKelas(item)}>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button className="btn btn-success" onClick={() => this.Add()}>
                        Add SPP
                    </button>

                    {/* modal spp */}
                    <div className="modal fade" id="modal_spp">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-info text-white">
                                    <h4>Form SPP</h4>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit = {ev => this.saveSpp(ev)}>
                                        Tahun
                                        <input type="text" className="form-control mb-1"
                                        value={this.state.tahun}
                                        onChange={ev => this.setState({tahun: ev.target.value})}
                                        required
                                        />

                                        Nominal
                                        <input type="text" className="form-control mb-1"
                                        value={this.state.nominal}
                                        onChange={ev => this.setState({nominal: ev.target.value})}
                                        required
                                        />

                                        <button type="submit" className="btn btn-block btn-success">
                                            Simpan
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } 
}