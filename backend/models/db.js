const mysql = require('mysql2');
require('dotenv').config(); // Memastikan environment variabel .env digunakan

// Membuat koneksi ke database MySQL menggunakan konfigurasi dari .env
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bacotz_db'
});

// Menghubungkan ke database
connection.connect(err => {
  if (err) {
    console.error('❌ Gagal konek DB:', err);
    return;
  }
  console.log('✅ Berhasil konek ke MySQL DB');
});

module.exports = connection;  // Menyediakan koneksi DB agar bisa digunakan di file lain
