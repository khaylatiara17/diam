const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise();

// Submit application
exports.submitApplication = async (req, res) => {
  const { fullName, nik, email, phone, service, amount, tenure, purpose } = req.body;

  try {
    // Insert into database
    const [result] = await pool.query(
      'INSERT INTO applications (full_name, nik, email, phone, service, amount, tenure, purpose) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fullName, nik, email, phone, service, amount, tenure, purpose]
    );

    res.json({
      success: true,
      message: 'Aplikasi berhasil diajukan!',
      id: result.insertId
    });
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menyimpan aplikasi. Silakan coba lagi.'
    });
  }
};
