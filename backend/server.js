require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.use(cors());
app.use(bodyParser.json());

// Test endpoint
app.get('/', (req, res) => res.send('Backend działa'));

// Endpoint wysyłający embed urlopu
app.post('/api/leave', async (req, res) => {
  const { username, role, reason, from, to } = req.body;
  if (!WEBHOOK_URL) return res.status(500).json({ error: 'Webhook URL nie ustawiony' });

  const embed = {
    embeds: [{
      title: "📌 Wniosek o urlop",
      color: 3447003,
      fields: [
        { name: "Administrator", value: username, inline: true },
        { name: "Rola", value: role, inline: true },
        { name: "Od", value: from, inline: true },
        { name: "Do", value: to, inline: true },
        { name: "Powód", value: reason, inline: false }
      ],
      timestamp: new Date()
    }]
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed)
    });
    if (response.ok) res.json({ status: 'ok' });
    else res.status(500).json({ error: 'Błąd wysyłania webhooka' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend uruchomiony na porcie ${PORT}`));
