import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Assistant endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = "You are Atlas, a professional, intelligent, and helpful AI financial assistant. Your goal is to help users track their finances, offer budgeting advice, analyze their spending, and provide personalized financial insights. Be clear, concise, and professional.";
      
      let validMessages = [...messages];
      // Gemini API requires the first message in the history to have role 'user'
      while (validMessages.length > 0 && validMessages[0].role !== 'user') {
        validMessages.shift();
      }

      // Collapse consecutive messages of the same role
      const collapsedMessages = [];
      for (const msg of validMessages) {
        const role = msg.role === 'user' ? 'user' : 'model';
        if (collapsedMessages.length > 0 && collapsedMessages[collapsedMessages.length - 1].role === role) {
          collapsedMessages[collapsedMessages.length - 1].parts[0].text += '\n\n' + msg.content;
        } else {
          collapsedMessages.push({
            role,
            parts: [{ text: msg.content }]
          });
        }
      }

      const contents = collapsedMessages;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction,
        }
      });

      res.json({ message: response.text });
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      res.status(500).json({ error: error.message || 'An error occurred during chat.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
