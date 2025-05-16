const db = require('../models/db').promise();

exports.getProfil = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM profil LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    console.error('Error getting profile:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data profil'
    });
  }
};

exports.updateProfil = async (req, res) => {
  const { nama, deskripsi } = req.body;
  
  try {
    const [rows] = await db.query('SELECT id FROM profil LIMIT 1');
    
    if (rows.length > 0) {
      await db.query(
        'UPDATE profil SET nama = ?, deskripsi = ? WHERE id = ?',
        [nama, deskripsi, rows[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO profil (nama, deskripsi) VALUES (?, ?)',
        [nama, deskripsi]
      );
    }
    
    res.json({
      success: true,
      message: 'Profil berhasil diperbarui'
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui profil'
    });
  }
};
