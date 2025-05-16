const db = require('../models/db').promise();

exports.getAllLayanan = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM layanan ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error getting services:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data layanan'
    });
  }
};

exports.getLayananById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM layanan WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan'
      });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error getting service:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data layanan'
    });
  }
};

exports.createLayanan = async (req, res) => {
  const { judul, deskripsi, gambar } = req.body;
  
  try {
    const [result] = await db.query(
      'INSERT INTO layanan (judul, deskripsi, gambar) VALUES (?, ?, ?)',
      [judul, deskripsi, gambar]
    );
    
    res.json({
      success: true,
      message: 'Layanan berhasil ditambahkan',
      id: result.insertId
    });
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan layanan'
    });
  }
};

exports.updateLayanan = async (req, res) => {
  const { judul, deskripsi, gambar } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE layanan SET judul = ?, deskripsi = ?, gambar = ? WHERE id = ?',
      [judul, deskripsi, gambar, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      message: 'Layanan berhasil diperbarui'
    });
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui layanan'
    });
  }
};

exports.deleteLayanan = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM layanan WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      message: 'Layanan berhasil dihapus'
    });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus layanan'
    });
  }
};
