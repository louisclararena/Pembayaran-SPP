import React, { useState } from "react"
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import { SidebarData } from "./SidebarData";
import "./Navbar.css"
import { IconContext } from "react-icons";

function Navbar() {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    const Logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("petugas")
        window.location = "/login"
    }    
    
    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <div className='navbar'>
                    <Link to='#' className='menu-bars'>
                        <FaIcons.FaBars onClick={showSidebar} />
                    </Link>
                    <Link className='menu-bars'>
                        <AiIcons.AiOutlineLogout onClick={Logout} />
                        Logout
                    </Link>
                    
                </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'} style={{zIndex: "5"}}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className='navbar-toggle'>
                            <Link to='#' className='menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {SidebarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                            </li>
                            );
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    )
}

// class Navbar extends React.Component {
//     Logout = () => {
//         localStorage.removeItem("token")
//         localStorage.removeItem("admin")
//         window.location = "/login"
//     }

//     render() { 
//         return(
//             <div className="navbar navbar-extend-lg navbar-light bg-danger">
//                 <div className="container">
//                         <a className="navbar-brand">
//                             PEMBAYARAN SPP
//                         </a>

//                         {/* show and hide menu */}
//                         <button className="navbar-toggler collapsed" data-toggle="collapse"
//                         data-target="#menu">
//                             <span className="sr-only">Toggle navigation</span>
//                             <span className="navbar-toggler-icon"></span>
//                         </button>

//                     {/* menu */}
//                     <div id="menu" className="navbar-collapse collpase">
//                         <ul className="nav navbar-nav me-auto mb-2 mb-lg-0">
//                             <li className="nav-item">
//                                 <Link to="/" className="nav-link">
//                                     Home
//                                 </Link>
//                             </li>

//                             <li className="nav-item">
//                                 <Link to="/spp" className="nav-link">
//                                     Data SPP
//                                 </Link>
//                             </li>

//                             <li className="nav-item">
//                                 <Link to="/kelas" className="nav-link">
//                                     Data Kelas
//                                 </Link>
//                             </li>

//                             <li className="nav-item">
//                                 <Link to="/siswa" className="nav-link">
//                                     Data Siswa
//                                 </Link>
//                         </li>

//                             <li className="nav-item">
//                                 <Link to="/petugas" className="nav-link">
//                                     Data Petugas
//                                 </Link>
//                             </li>

//                             <li className="nav-item">
//                                 <Link to="/admin" className="nav-link">
//                                     Data Admin
//                                 </Link>
//                             </li>

//                             <li className="nav-item">
//                                 <Link to="/transaksi" className="nav-link">
//                                     Transaksi
//                                 </Link>
//                             </li>
                            
//                             <li className="nav-item">
//                                 <Link className="nav-link" onClick={() => this.Logout()}>
//                                     Logout
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

export default Navbar;