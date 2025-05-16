const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const { dbConfig } = require('../config/database');

const authController = {
    login: async (req, res) => {
        console.log('Login attempt:', { email: req.body.email });
        
        try {
            const { email, password } = req.body;

            // Basic validation
            if (!email || !password) {
                console.log('Missing credentials');
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            // Connect to database
            const connection = await mysql.createConnection(dbConfig);
            console.log('Database connected');

            try {
                // Get user from database
                const [rows] = await connection.execute(
                    'SELECT * FROM admin WHERE email = ?',
                    [email]
                );
                console.log('Query executed, found rows:', rows.length);

                if (rows.length === 0) {
                    console.log('User not found:', email);
                    return res.status(401).json({
                        success: false,
                        message: 'Email atau password salah'
                    });
                }

                const user = rows[0];
                console.log('User found, verifying password');

                // Compare password
                const isMatch = await bcrypt.compare(password, user.password);
                console.log('Password verification result:', isMatch);

                if (!isMatch) {
                    console.log('Invalid password for user:', email);
                    return res.status(401).json({
                        success: false,
                        message: 'Email atau password salah'
                    });
                }

                // Create user object without sensitive data
                const userResponse = {
                    id: user.id,
                    email: user.email,
                    name: user.name || 'Admin'
                };

                console.log('Login successful:', userResponse);

                // Send success response
                return res.json({
                    success: true,
                    message: 'Login berhasil',
                    user: userResponse
                });
            } finally {
                // Always close the connection
                await connection.end();
                console.log('Database connection closed');
            }
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    logout: async (req, res) => {
        try {
            // Since we're using JWT/localStorage, we don't need to do anything server-side
            // The client will handle removing the token
            return res.json({
                success: true,
                message: 'Logout successful'
            });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during logout'
            });
        }
    }
};

module.exports = authController;
