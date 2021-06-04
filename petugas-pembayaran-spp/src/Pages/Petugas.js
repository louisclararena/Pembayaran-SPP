import React from "react";
import PetugasList from "../Component/PetugasList"
import { base_url, petugas_image_url } from "../Config";
import $ from "jquery"
import axios from "axios"

export default class Petugas extends React.Component {
    constructor(){
        super()
        this.state = {
            petugas: [],
            token: "",
            action: "",
            id_petugas: "",
            nama_petugas: "",
            username: "",
            password: "",
            image: "",
            level: "",
            fillPassword: true,
            uploadFile: true
        }

        if(localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }

        this.headerConfig.bind(this)
    }

    // fungsi headerConfig -> untuk memberikan header berupa bearer token 
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}`}
        }
        return header
    }

    // fungsi Add -> untuk memberikan inisialisasi data dan menambahkan data
    Add = () => {
        $("#modal_petugas").modal("show")
        this.setState({
            action: "insert",
            id_petugas: 0,
            nama_petugas: "",
            username: "",
            password: "",
            image: null,
            level: "",
            fillPassword: true,
            uploadFile: true

        })
    }

    // fungsi Edit -> untuk memberikan inisialisasi data dan mengubah data
    Edit = selectedItem => {
        $("#modal_petugas").modal("show")
        this.setState({
            action: "update",
            id_petugas: selectedItem.id_petugas,
            nama_petugas: selectedItem.nama_petugas,
            username: selectedItem.username,
            password: "",
            image: null,
            level: selectedItem.level,
            fillPassword: false,
            uploadFile: false
        })
    }

    // fungsi savePetugas -> untuk menyimpan data
    savePetugas = event => {
        event.preventDefault()
        $("#modal_petugas").modal("hide")
        let form = new FormData()
        form.append("id_petugas", this.state.id_petugas)
        form.append("nama_petugas", this.state.nama_petugas)
        form.append("username", this.state.username)
        form.append("level", this.state.level)

        if (this.state.uploadFile) {
            form.append("image", this.state.image)
        }

        if (this.state.fillPassword) {
            form.append("password", this.state.password)
        }

        let url = base_url + "/petugas"
        if (this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getPetugas()
            })
            .catch(error => console.log(error))
        } else if(this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getPetugas()
            })
            .catch(error => console.log(error))
        }

    }

    // getPetugas -> untuk mengakses API get petugas
    getPetugas = () => {
        let url = base_url + "/petugas"
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({petugas: response.data})
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

    // akses fungsi tersebut pada fungsi componentDidMount
    componentDidMount() {
        this.getPetugas()
    }

    render() {
        return(
            <div className="petugas">
                {/* <Navbar /> */}
                <div className="container">
                    <div className="card-header">
                        <h3 className="text-center text-bold text-info mt-2"> Petugas List </h3>
                        <p className="card-text text-center">Kumpulan data Petugas yang terdaftar</p>
                    </div>
                    <div className="row">
                        { this.state.petugas.map(item => (
                            <PetugasList
                                key = {item.id_petugas}
                                nama_petugas = {item.nama_petugas}
                                username = {item.username}
                                level = {item.level}
                                image = { petugas_image_url + "/" + item.image }
                                onEdit = {() => this.Edit(item)}
                                onDrop = {() => this.dropPetugas(item)}
                            />
                        ))}
                    </div>
                    <button className="btn btn-success" onClick={() => this.Add()}>
                        Add Petugas
                    </button>
                </div>

                {/* modal petugas */}
                <div className="modal fade" id="modal_petugas">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h4>Form Petugas</h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={ev => this.savePetugas(ev)}>
                                    Nama Petugas
                                    <input type="text" className="form-control mb-1" 
                                    value={this.state.nama_petugas}
                                    onChange={ev => this.setState({nama_petugas: ev.target.value})} />
                                    
                                    Level
                                    <div className="form-group">
                                        <select name="level" id="level" className="form-control" onChange={ev => this.setState({level: ev.target.value})}
                                        id="exampleFormControlSelect1" value={this.state.level}>     
                                            <option value="Petugas">
                                                Petugas
                                            </option>
                                            <option value="Admin">
                                                Admin
                                            </option>
                                        </select>
                                    </div>

                                    Username
                                    <input type="text" className="form-control mb-1" 
                                    value={this.state.username}
                                    onChange={ev => this.setState({username: ev.target.value})} />

                                    {this.state.action === "update" && this.state.uploadFile === false ? (
                                        <button className="btn btn-sm btn-dark mb-1 btn-block"
                                        onClick={() => this.setState({uploadFile: true})}>
                                            Change Petugas Image
                                        </button>
                                    ) : (
                                        <div>
                                            Petugas Image
                                            <input type="file" className="form-control mb-1"
                                            onChange={ev => this.setState({image: ev.target.files[0]})}
                                            required />
                                        </div>
                                    )}

                                    {this.state.action === "update" && this.state.fillPassword === false ? (
                                        <button className="btn btn-sm btn-secondary mb-1 btn-block"
                                        onClick={() => this.setState({fillPassword: true})}>
                                            Change Password
                                        </button>
                                    ) : (
                                        <div>
                                            Password
                                            <input type="password" className="form-control mb-1" 
                                            value={this.state.password}
                                            onChange={ev => this.setState({password: ev.target.value})}
                                            required />
                                        </div>
                                    )}

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