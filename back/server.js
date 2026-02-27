const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4010;

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Hub Inntek Catalog API Is Running - PARKO Scaffold' });
});

// Example route placeholder
// app.use('/api/catalog', require('./routes/catalog.routes'));

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
