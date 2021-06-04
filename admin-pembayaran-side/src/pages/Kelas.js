import React from "react"
// import Navbar from "../Component/Navbar"
import axios from "axios"
import { base_url } from "../Config";
import $ from "jquery"

export default class Kelas extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            action: "",
            kelas: [],
            id_kelas: "",
            nama_kelas: "",
            kompetensi_keahlian: "",
        }

        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
    }

    // fungsi header config -> untuk memberikan header berupa bearer token
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    // fungsi Add -> untuk menambahkan data
    Add = () => {
        $("#modal_kelas").modal("show")
        this.setState({
            action: "insert",
            id_kelas: 0,
            nama_kelas: "",
            kompetensi_keahlian: ""
        })
    }

    // fungsi Edit -> untuk mengedit data
    Edit = selectedItem => {
        $("#modal_kelas").modal("show")
        this.setState({
            action: "update",
            id_kelas: selectedItem.id_kelas,
            nama_kelas: selectedItem.nama_kelas,
            kompetensi_keahlian: selectedItem.kompetensi_keahlian
        })
    }

    // fungsi saveKelas -> untuk menyimpan data
    saveKelas = event => {
        event.preventDefault()
        $("#modal_kelas").modal("hide")
        let form = {
            id_kelas: this.state.id_kelas,
            nama_kelas: this.state.nama_kelas,
            kompetensi_keahlian: this.state.kompetensi_keahlian
        }

        let url = base_url + "/kelas"
        if (this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getKelas()
            })
            .catch(error => console.log(error))
        } else if(this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getKelas()
            })
            .catch(error => console.log(error))
        }
    }

    // fungsi dropKelas -> untuk menghapus data
    dropKelas = selectedItem => {
        if (window.confirm("are you sure will delete this item ?")) {
            let url = base_url + "/kelas/" + selectedItem.id_kelas
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getKelas()
            })
            .catch(error => console.log(error))
        }
    }

    // fungsi getKelas -> untuk mengakses API get kelas
    getKelas = () => {
        let url = base_url + "/kelas"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({kelas : response.data})
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

    // akses fungsi getKelas
    componentDidMount() {
        this.getKelas()
    }

    render(){
        return(
            <div className="kelas">
                {/* <Navbar /> */}
                <div className="container">
                    <div className="card-header">
                        <h3 className="text-center text-bold text-info mt-2"> Kelas List</h3>
                        <p class="card-text text-center">Kumpulan data kelas yang terdaftar</p>
                    </div>
                    <table class="table">
                        <thead class="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Nama</th>
                                <th>Jurusan</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.kelas.map((item, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item.nama_kelas}</td>
                                    <td>{item.kompetensi_keahlian}</td>
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
                        Add Kelas
                    </button>

                    {/* modal kelas */}
                    <div className="modal fade" id="modal_kelas">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-info text-white">
                                    <h4>Form Kelas</h4>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit = {ev => this.saveKelas(ev)}>
                                        Nama Kelas
                                        <input type="text" className="form-control mb-1"
                                        value={this.state.nama_kelas}
                                        onChange={ev => this.setState({nama_kelas: ev.target.value})}
                                        required
                                        />

                                        Jurusan
                                        <input type="text" className="form-control mb-1"
                                        value={this.state.kompetensi_keahlian}
                                        onChange={ev => this.setState({kompetensi_keahlian: ev.target.value})}
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