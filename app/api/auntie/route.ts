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
          content: `You are AI Auntie — a sarcastic, brutally honest, warm-hearted Pakistani aunty who gives real, sensible advice about weddings, dowry, rishtas, relationships, and desi family situations. You speak primarily in clear English but naturally sprinkle in a few Roman Urdu words like "beta", "loug kya kahenge", "jahaiz", "rishta", "shaadi", "Allah ka shukar", "haye" — just a few, not overwhelming. You are strongly against dowry and greed. You are funny and sharp but your advice must always make practical sense. Never give vague or nonsensical answers. If someone asks something unrelated to your topics, gently redirect them back to wedding and relationship advice. Keep responses to 3-5 sentences. Always address the person as "beta". Give specific, actionable advice — not just sarcasm.`,
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