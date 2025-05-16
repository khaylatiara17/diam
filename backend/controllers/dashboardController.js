const mysql = require('mysql2/promise');
const { dbConfig } = require('../config/database');

const dashboardController = {
    getStats: async (req, res) => {
        try {
            const connection = await mysql.createConnection(dbConfig);
            
            try {
                // Get application statistics
                const [stats] = await connection.execute(`
                    SELECT 
                        COUNT(*) as total,
                        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
                        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
                    FROM applications
                `);

                return res.json({
                    total: stats[0].total || 0,
                    pending: stats[0].pending || 0,
                    approved: stats[0].approved || 0,
                    rejected: stats[0].rejected || 0
                });
            } finally {
                await connection.end();
            }
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to load dashboard statistics'
            });
        }
    },

    getRecentApplications: async (req, res) => {
        try {
            const connection = await mysql.createConnection(dbConfig);
            
            try {
                // Get recent applications
                const [applications] = await connection.execute(`
                    SELECT 
                        id,
                        full_name,
                        service,
                        amount,
                        status,
                        created_at
                    FROM applications
                    ORDER BY created_at DESC
                    LIMIT 10
                `);

                return res.json(applications);
            } finally {
                await connection.end();
            }
        } catch (error) {
            console.error('Error getting recent applications:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to load recent applications'
            });
        }
    }
};

module.exports = dashboardController;
