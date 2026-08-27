import { NextResponse } from 'next/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, systemPrompt, temperature = 0.3, max_tokens = 1024, customApiKey } = body;

    const apiKey = customApiKey || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API Key is not configured. Please set GROQ_API_KEY in .env.local or enter your key in AI Settings.' },
        { status: 400 }
      );
    }

    const payloadMessages = [];
    if (systemPrompt) {
      payloadMessages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    if (Array.isArray(messages)) {
      payloadMessages.push(...messages);
    } else if (typeof body.prompt === 'string') {
      payloadMessages.push({
        role: 'user',
        content: body.prompt,
      });
    }

    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: payloadMessages,
        temperature,
        max_tokens,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Groq API Primary Model Error:', errText);
      // Fallback to gpt-oss-20b
      const fallbackRes = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: payloadMessages,
          temperature,
          max_tokens,
        }),
      });

      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        const content = fallbackData.choices?.[0]?.message?.content || '';
        return NextResponse.json({
          content,
          model: 'openai/gpt-oss-20b',
          usage: fallbackData.usage,
        });
      }

      return NextResponse.json(
        { error: `AI request failed: ${res.statusText}`, details: errText },
        { status: res.status }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      content,
      model: data.model || 'openai/gpt-oss-120b',
      usage: data.usage,
    });
  } catch (error: unknown) {
    console.error('AI API Route Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message || 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
