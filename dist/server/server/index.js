"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3456;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files from the React app build directory
const distPath = path_1.default.join(__dirname, '../dist/client');
app.use(express_1.default.static(distPath));
// API endpoint to exchange the OAuth code for an access token
app.post('/api/exchange-token', async (req, res) => {
    const { clientId, clientSecret, code, shop } = req.body;
    if (!clientId || !clientSecret || !code || !shop) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }
    const shopUrl = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`;
    try {
        console.log(`Exchanging code for shop: ${shopUrl}`);
        const response = await axios_1.default.post(`https://${shopUrl}/admin/oauth/access_token`, {
            client_id: clientId,
            client_secret: clientSecret,
            code,
        });
        console.log('Token exchange successful');
        res.json(response.data);
    }
    catch (error) {
        console.error('Token exchange error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to exchange token with Shopify',
            details: error.response?.data || error.message
        });
    }
});
// For any other request, serve the React app (client-side routing)
app.get('*', (req, res) => {
    const indexPath = path_1.default.join(distPath, 'index.html');
    res.sendFile(indexPath);
});
app.listen(PORT, () => {
    console.log(`
🚀 Shopify Token Wizard Server running at:
   http://localhost:${PORT}
  `);
});
