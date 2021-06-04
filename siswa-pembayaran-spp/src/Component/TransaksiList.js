import React from "react"

export default class TransaksiList extends React.Component {
    convertTime = time => {
        let date = new Date(time)
        return `${date.getDate()}/${Number(date.getMonth()) + 1}/${date.getFullYear()}`
    }

    render() {
        return(
            <div className="card col-sm-12 my-1">
                <div className="card-body row"> 
                    <div className="col-sm-2"></div>                   
                    <div className="col-sm-6">
                        {/* description */}
                        <h5 className="text-bold">
                            Nama Petugas: {this.props.nama_petugas}
                        </h5>
                        <h6>Nama Siswa: {this.props.nama_siswa}</h6>
                        <h6>Tanggal Bayar: {this.convertTime(this.props.time)}</h6>
                        <h6 className="text-danger">Jumlah Bayar: {this.props.jumlah_bayar}</h6>
                    </div>
                </div>
            </div>
        )
    }
}