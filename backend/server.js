// 1. IMPORT MODULE
const express    = require('express');
const path       = require('path');
const bodyParser = require('body-parser');
const cors       = require('cors');
require('dotenv').config();

// Import database connection
const db = require('./models/db');

const profilRoutes = require('./routes/profilRoutes');
const layananRoutes = require('./routes/layananRoutes');
const kontakRoutes = require('./routes/kontakRoutes');
const contactRoutes = require('./routes/contactRoutes');
const blogRoutes = require('./routes/blogRoutes');
const applyRoutes = require('./routes/applyRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');

// 2. INIT APP
const app = express();

// 3. MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 4. SERVE STATIC FILES
// Serve static files from the web directory (one level up from backend)
app.use('/', express.static(path.join(__dirname, '..')));
// Serve uploads from backend directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// 5. API ROUTES
app.use('/api/profil', profilRoutes);
app.use('/api/layanan', layananRoutes);
app.use('/api/kontak', kontakRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/apply', applyRoutes);
app.use('/api', authRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

// 6. DEFAULT ROUTE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 7. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});
