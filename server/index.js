#!/usr/bin/env node
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY not set. Requests to /api/chat will fail until you set it.');
}

app.post('/api/chat', async (req, res) => {
  try {
    const messages = req.body.messages || [];
    const systemMessage = {
      role: 'system',
      content:
        "You are HealthGuard assistant. Provide friendly, concise, non-diagnostic health guidance and recommend seeing a professional when appropriate. Keep responses helpful and safe.",
    };

    const openaiMessages = [
      systemMessage,
      ...messages.map((m) => ({ role: m.role === 'bot' ? 'assistant' : m.role, content: m.content })),
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: openaiMessages, max_tokens: 700 }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || '';
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Chat proxy listening on http://localhost:${PORT}`);
});
