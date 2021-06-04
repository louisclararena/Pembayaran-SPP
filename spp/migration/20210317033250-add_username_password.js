'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    
    // menambah kolom username pada tabel siswa
    await queryInterface.addColumn(
      'siswa',
      'username',
      { type: Sequelize.STRING }
    )

    // menambahkan kolom password pada tabel siswa
    await queryInterface.addColumn(
      'siswa',
      'password',
      { type: Sequelize.STRING }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("siswa", "username")
    await queryInterface.removeColumn("siswa", "password")
  }
};
