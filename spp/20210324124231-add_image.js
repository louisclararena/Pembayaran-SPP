'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // menambahkan kolom image pada tabel siswa dg tipe string
    await queryInterface.addColumn(
      "siswa",
      "image",
      {type: Sequelize.STRING}
    )

    // menambahkan kolom image pada tabel petugas dg tipe string
    await queryInterface.addColumn(
      "petugas",
      "image",
      {type: Sequelize.STRING}
    )
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("siswa", "image")
    await queryInterface.removeColumn("petugas", "image")
  }
};
