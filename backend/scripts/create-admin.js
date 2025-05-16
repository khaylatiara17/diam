const bcrypt = require('bcryptjs');
const db = require('../models/db');

async function createAdmin() {
    try {
        // Generate hash for password: b@c0tz9876
        const password = 'b@c0tz9876';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        console.log('Generated hash:', hash);

        // Delete existing admin
        await db.promise().query('DELETE FROM admin WHERE email = ?', ['admin@cot.com']);

        // Insert new admin
        const [result] = await db.promise().query(
            'INSERT INTO admin (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin', 'admin@cot.com', hash, 'admin']
        );

        console.log('Admin user created successfully:', result);
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}

createAdmin();
