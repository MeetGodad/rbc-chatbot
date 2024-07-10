import { NextResponse } from 'next/server';
import openai from '@/utils/openai';

export async function POST(req) {
  try {
    const { message } = await req.json();
    const assistantId = process.env.ASSISTANT_ID;

    if (!assistantId) {
      throw new Error('Assistant ID is not set');
    }

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (runStatus.status !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    const lastMessage = messages.data
      .filter((message) => message.role === 'assistant')
      .pop();

    console.log('Last message:', lastMessage.content[0].text.value);

    if (lastMessage && lastMessage.content[0].type === 'text') {
      return NextResponse.json({ response: lastMessage.content[0].text.value });
    } else {
      return NextResponse.json({ response: 'No response from assistant.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}