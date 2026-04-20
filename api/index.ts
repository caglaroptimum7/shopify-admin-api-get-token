import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3456;

app.use(cors());
app.use(express.json());

// Handle the OAuth callback by redirecting back to the UI (root)
// On Vercel, the app might be on the same URL as the API
app.get('/callback', (req, res) => {
  const query = new URLSearchParams(req.query as any).toString();
  console.log('Callback received, redirecting to app...');
  
  // If we are in development, redirect to port 3000, otherwise redirect to root
  const target = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
  res.redirect(`${target}/callback?${query}`);
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

// For Vercel, we only listen locally or when explicitly run
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Local Server running at http://localhost:${PORT}`);
  });
}

export default app;
