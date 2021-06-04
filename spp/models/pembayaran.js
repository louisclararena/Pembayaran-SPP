'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pembayaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // menghubungkan pembayaran -> petugas
      this.belongsTo(models.petugas, {
        foreignKey: "id_petugas",
        as: "petugas"     //primary key of petugas
      })

      // menghubungkan pembayaran -> siswa
      this.belongsTo(models.siswa, {
        foreignKey: "nisn",
        as: "siswa"     //primary key of siswa
      })

      // menghubungkan pembayaran -> spp
      this.belongsTo(models.spp, {
        foreignKey: "id_spp",
        as: "spp"     //primary key of spp
      })

    }
  };
  pembayaran.init({
    id_pembayaran: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_petugas: DataTypes.INTEGER,
    nisn: DataTypes.STRING,
    tgl_bayar: DataTypes.DATE,
    bulan_dibayar: DataTypes.STRING,
    tahun_dibayar: DataTypes.STRING,
    id_spp: DataTypes.INTEGER,
    jumlah_bayar: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'pembayaran',
    tableName: 'pembayaran'      //setting nama tabel
  });
  return pembayaran;
};