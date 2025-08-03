require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createUnsignedTransfer } = require('./utils/tron');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/create-tx', async (req, res) => {
    try {
        console.log('POST /create-tx called');
        console.log('Body received:', req.body);

        const { from, to, amount } = req.body;

        if (!from || !to || !amount) {
            return res.status(400).json({ error: 'Missing required fields: from, to, amount' });
        }

        const tx = await createUnsignedTransfer(from, to, amount);
        res.json(tx);
    } catch (error) {
        console.error('Backend error:', error.message || error);
        res.status(500).json({ error: error.message || 'Unknown error' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
