const mysql = require('mysql2/promise');
const { dbConfig } = require('../config/database');
const ExcelJS = require('exceljs');

const serviceController = {
    addService: async (req, res) => {
        try {
            const { name, description, price, category } = req.body;
            const connection = await mysql.createConnection(dbConfig);
            
            try {
                const [result] = await connection.execute(
                    'INSERT INTO services (name, description, price, category) VALUES (?, ?, ?, ?)',
                    [name, description, price, category]
                );

                return res.json({
                    success: true,
                    message: 'Service added successfully',
                    serviceId: result.insertId
                });
            } finally {
                await connection.end();
            }
        } catch (error) {
            console.error('Error adding service:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to add service'
            });
        }
    },

    getServices: async (req, res) => {
        try {
            const connection = await mysql.createConnection(dbConfig);
            
            try {
                const [services] = await connection.execute('SELECT * FROM services ORDER BY created_at DESC');
                return res.json(services);
            } finally {
                await connection.end();
            }
        } catch (error) {
            console.error('Error getting services:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to load services'
            });
        }
    },

    filterServices: async (req, res) => {
        try {
            const { category, priceRange, dateRange } = req.body;
            const connection = await mysql.createConnection(dbConfig);
            
            try {
                let query = 'SELECT * FROM services WHERE 1=1';
                const params = [];

                if (category) {
                    query += ' AND category = ?';
                    params.push(category);
                }

                if (priceRange) {
                    if (priceRange.min) {
                        query += ' AND price >= ?';
                        params.push(priceRange.min);
                    }
                    if (priceRange.max) {
                        query += ' AND price <= ?';
                        params.push(priceRange.max);
                    }
                }

                if (dateRange) {
                    if (dateRange.start) {
                        query += ' AND created_at >= ?';
                        params.push(dateRange.start);
                    }
                    if (dateRange.end) {
                        query += ' AND created_at <= ?';
                        params.push(dateRange.end);
                    }
                }

                query += ' ORDER BY created_at DESC';

                const [services] = await connection.execute(query, params);
                return res.json(services);
            } finally {
                await connection.end();
            }
        } catch (error) {
            console.error('Error filtering services:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to filter services'
            });
        }
    },

    exportServices: async (req, res) => {
        try {
            const connection = await mysql.createConnection(dbConfig);
            
            try {
                const [services] = await connection.execute('SELECT * FROM services ORDER BY created_at DESC');

                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Services');

                worksheet.columns = [
                    { header: 'ID', key: 'id', width: 10 },
                    { header: 'Name', key: 'name', width: 30 },
                    { header: 'Description', key: 'description', width: 50 },
                    { header: 'Price', key: 'price', width: 15 },
                    { header: 'Category', key: 'category', width: 20 },
                    { header: 'Created At', key: 'created_at', width: 20 }
                ];

                services.forEach(service => {
                    worksheet.addRow(service);
                });

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=services.xlsx');

                await workbook.xlsx.write(res);
                res.end();
            } finally {
                await connection.end();
            }
        } catch (error) {
            console.error('Error exporting services:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to export services'
            });
        }
    }
};

module.exports = serviceController;
