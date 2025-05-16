const db = require('../models/db').promise();

exports.getKontakInfo = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kontak LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    console.error('Error getting contact info:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil informasi kontak'
    });
  }
};

exports.updateKontakInfo = async (req, res) => {
  const { alamat, email, telepon } = req.body;
  
  try {
    const [rows] = await db.query('SELECT id FROM kontak LIMIT 1');
    
    if (rows.length > 0) {
      await db.query(
        'UPDATE kontak SET alamat = ?, email = ?, telepon = ? WHERE id = ?',
        [alamat, email, telepon, rows[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO kontak (alamat, email, telepon) VALUES (?, ?, ?)',
        [alamat, email, telepon]
      );
    }
    
    res.json({
      success: true,
      message: 'Informasi kontak berhasil diperbarui'
    });
  } catch (err) {
    console.error('Error updating contact info:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui informasi kontak'
    });
  }
};
