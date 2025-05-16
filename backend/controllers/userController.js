const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { dbConfig } = require('../config/database');

const userController = {
    addUser: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            const connection = await mysql.createConnection(dbConfig);
            
            try {
                // Check if email already exists
                const [existing] = await connection.execute(
                    'SELECT id FROM users WHERE email = ?',
                    [email]
                );

                if (existing.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email already exists'
                    });
                }

                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Insert new user
                const [result] = await connection.execute(
                    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    [name, email, hashedPassword, role]
                );

                return res.json({
                    success: true,
                    message: 'User added successfully',
                    userId: result.insertId
                });
            } finally {
                await connection.end();
            }
        } catch (error) {
            console.error('Error adding user:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to add user'
            });
        }
    },

    getUsers: async (req, res) => {
        try {
            const connection = await mysql.createConnection(dbConfig);
            
            try {
                const [users] = await connection.execute(
                    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
                );
                return res.json(users);
            } finally {
                await connection.end();
            }
        } catch (error) {
            console.error('Error getting users:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to load users'
            });
        }
    }
};

module.exports = userController;
