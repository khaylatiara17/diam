const db = require('../models/db').promise();

exports.sendContact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('Received contact form submission:', { name, email, subject, message });
  
  // Gabung data jadi satu string
  const fullMessage = 
    `Nama : ${name}\n` +
    `Subjek: ${subject}\n` +
    `Pesan : ${message}`;

  try {
    console.log('Attempting to insert into kontak_kita table...');
    const [result] = await db.query(
      'INSERT INTO kontak_kita (email, pesan) VALUES (?, ?)',
      [email, fullMessage]
    );
    
    console.log('Successfully inserted:', result);
    res.json({ 
      success: true,
      message: 'Pesan berhasil dikirim!',
      id: result.insertId 
    });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ 
      success: false,
      message: 'Gagal kirim pesan.'
    });
  }
};
