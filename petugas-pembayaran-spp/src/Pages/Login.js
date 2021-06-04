import React from "react"
import Navbar from "../Component/Navbar"
import axios from "axios"
import { base_url } from "../Config";

export default class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: "",
            level: "",
            message: "",
            logged: true
        }
    }

    // arrow function Login --> untuk menjalankan fungsi login
    Login = event => {
        event.preventDefault()
        let sendData = {
            username: this.state.username,
            password: this.state.password,
            level: this.state.level
        }

        let url = base_url + "/petugas/auth"

        axios.post(url, sendData)
        .then(response => {
            this.setState({logged: response.data.logged})
            if (this.state.logged) {
                let petugas = response.data.data
                let token = response.data.token

                localStorage.setItem("petugas", JSON.stringify(petugas))
                localStorage.setItem("token", token)

                this.props.history.push("/")
            } else{
                this.setState({message: response.data.message})
            }
        })
        .catch(error => console.log(error))
    }

    render() {
        return (
            <div className="container d-flex h-100 justify-content-center align-items-center">
                <div className="col-sm-6 card my-5">
                    <div className="card-header bg-danger text-white text-center">
                        <h4>Form Login SPP</h4>
                        <strong className="text-warning">
                            Petugas Sign In
                        </strong>
                    </div>

                    <div className="card-body">
                        { !this.state.logged ? 
                        (
                            <div className="alert alert-danger mt-1">
                                { this.state.message }
                            </div>
                        ) : null }
                        <form onSubmit={ev => this.Login(ev)}>
                            {/* username */}
                            <input type="text" className="form-control mb-1" value={this.state.username}
                            onChange={ev => this.setState({username: ev.target.value})} />
                            {/* password */}
                            <input type="password" className="form-control mb-1" value={this.state.password}
                            onChange={ev => this.setState({password: ev.target.value})}
                            autoComplete="false" />

                            {/* level */}
                            <div className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" id="customRadio" name="example" 
                                value={this.state.level} onChange={ev => this.setState({level: ev.target.value})}/>
                                <label className="custom-control-label" for="customRadio">Petugas</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" id="customRadio2" name="example" 
                                value={this.state.level} onChange={ev => this.setState({level: ev.target.value})}/>
                                <label className="custom-control-label" for="customRadio2">Admin</label>
                            </div>

                            <button className="btn btn-block btn-outline-primary mb-1" type="submit">
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    } 
}