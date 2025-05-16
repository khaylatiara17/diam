const db = require('../models/db').promise();

exports.getAllPosts = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM blog ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error getting blog posts:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil artikel blog'
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM blog WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error getting blog post:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil artikel'
    });
  }
};

exports.createPost = async (req, res) => {
  const { judul, konten, gambar, status = 'draft' } = req.body;
  
  try {
    const [result] = await db.query(
      'INSERT INTO blog (judul, konten, gambar, status) VALUES (?, ?, ?, ?)',
      [judul, konten, gambar, status]
    );
    
    res.json({
      success: true,
      message: 'Artikel berhasil dibuat',
      id: result.insertId
    });
  } catch (err) {
    console.error('Error creating blog post:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat artikel'
    });
  }
};

exports.updatePost = async (req, res) => {
  const { judul, konten, gambar, status } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE blog SET judul = ?, konten = ?, gambar = ?, status = ? WHERE id = ?',
      [judul, konten, gambar, status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      message: 'Artikel berhasil diperbarui'
    });
  } catch (err) {
    console.error('Error updating blog post:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui artikel'
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM blog WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      message: 'Artikel berhasil dihapus'
    });
  } catch (err) {
    console.error('Error deleting blog post:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus artikel'
    });
  }
};
