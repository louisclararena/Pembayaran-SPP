import React from "react"
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import * as IoIcons from "react-icons/io"

export const SidebarData = [
    {
        title: "Home",
        path: "/",
        icon: <AiIcons.AiFillHome />,
        cName: "nav-text"
    },
    {
        title: "Data Petugas",
        path: "/petugas",
        icon: <FaIcons.FaUserTie />,
        cName: "nav-text"
    },
    {
        title: "Transaksi",
        path: "/transaksi",
        icon: <AiIcons.AiOutlineSolution />,
        cName: "nav-text"
    },
]