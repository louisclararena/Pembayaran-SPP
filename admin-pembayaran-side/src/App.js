import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css"
import Navbar from "./Component/Navbar"
import Login from "./Pages/Login"
import Home from "./Pages/Home"
import SPP from "./Pages/Spp"
import Siswa from "./Pages/Siswa"
import Kelas from "./Pages/Kelas"
import Petugas from "./Pages/Petugas"
import Transaksi from "./Pages/Transaksi"

export default class App extends React.Component {
  render() {
    return(
      <>
        <Router>
          <Navbar />
          <Switch>
            <Route  exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/spp" component={SPP} />
            <Route path="/kelas" component={Kelas} />
            <Route path="/siswa" component={Siswa} />
            <Route path="/petugas" component={Petugas} />
            <Route path="/transaksi" component={Transaksi} />
          </Switch>
        </Router>
      </>
    )
  }
}