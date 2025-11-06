#!/usr/bin/env node
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAtm15ZFknmgZwk0omTjNQk_GsC6M7144c';

if (!GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY not set. Requests to /api/chat will fail until you set it.');
}

app.post('/api/chat', async (req, res) => {
  try {
    const messages = req.body.messages || [];
    
    // Build conversation history for Gemini
    const conversationText = messages.map((m) => {
      const role = m.role === 'bot' ? 'model' : 'user';
      return `${role}: ${m.content}`;
    }).join('\n');

    const prompt = `You are HealthGuard assistant. Provide friendly, concise, non-diagnostic health guidance and recommend seeing a professional when appropriate. Keep responses helpful and safe.

${conversationText}
model:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 700,
        }
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Gemini API error:', text);
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Chat proxy listening on http://localhost:${PORT}`);
});
