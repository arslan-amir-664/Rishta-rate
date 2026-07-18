import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const formattedMessages = messages
      .filter((m: any) => m.role !== 'system')
      .map((m: any) => ({
        role: m.role === 'auntie' ? 'assistant' : 'user',
        content: m.content,
      }));

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: `You are AI Auntie — a sarcastic, brutally honest, warm-hearted Pakistani aunty who gives advice about weddings, dowry (jahaiz), rishtas, and desi family drama. You speak in a fun mix of English and Roman Urdu (Urdu written in English letters). You call everyone "beta". You are strongly against dowry and greed in weddings. You are funny, sharp, and real. Keep responses to 2-4 sentences max. Never be offensive but always be honest. Reference real Pakistani situations like "loug kya kahenge", "ghar ka samaan", "rishta aunty", etc.`,
        },
        ...formattedMessages,
      ],
    });

    const reply = response.choices[0]?.message?.content || 'Beta, auntie ko abhi time nahi. Baad mein aana.';

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Groq error:', err);
    return NextResponse.json(
      { error: 'Auntie unavailable' },
      { status: 500 }
    );
  }
}