import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3456;

app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
const distPath = path.join(__dirname, '../dist/client');
app.use(express.static(distPath));

// Handle the OAuth callback by redirecting back to the Vite dev server (port 3000)
// This ensures the user stays in the development environment with HMR.
app.get('/callback', (req, res) => {
  const query = new URLSearchParams(req.query as any).toString();
  console.log('Callback received, redirecting to dev server...');
  res.redirect(`http://localhost:3000/callback?${query}`);
});

// API endpoint to exchange the OAuth code for an access token
app.post('/api/exchange-token', async (req, res) => {
  const { clientId, clientSecret, code, shop } = req.body;

  if (!clientId || !clientSecret || !code || !shop) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const shopUrl = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`;

  try {
    console.log(`Exchanging code for shop: ${shopUrl}`);
    
    const response = await axios.post(`https://${shopUrl}/admin/oauth/access_token`, {
      client_id: clientId,
      client_secret: clientSecret,
      code,
    });

    console.log('Token exchange successful');
    res.json(response.data);
  } catch (error: any) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to exchange token with Shopify',
      details: error.response?.data || error.message 
    });
  }
});

// For any other request, serve the React app (client-side routing)
app.get(/.*/, (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`
🚀 Shopify Token Wizard Server running at:
   http://localhost:${PORT}
  `);
});
