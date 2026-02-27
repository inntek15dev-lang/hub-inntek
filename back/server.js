require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 4010;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Hub Inntek Catalog API Is Running - PARKO Scaffold' });
});

// API Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
