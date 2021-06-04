'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pembayaran', {
      id_pembayaran: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_petugas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "petugas",
          key: "id_petugas"     //primary key of petugas
        }
      },
      nisn: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "siswa",
          key: "nisn"     //primary key of siswa
        }
      },
      tgl_bayar: {
        type: Sequelize.DATE
      },
      bulan_dibayar: {
        type: Sequelize.STRING
      },
      tahun_dibayar: {
        type: Sequelize.STRING
      },
      id_spp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "spp",
          key: "id_spp"   //primary key of spp
        }
      },
      jumlah_bayar: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pembayaran');
  }
};