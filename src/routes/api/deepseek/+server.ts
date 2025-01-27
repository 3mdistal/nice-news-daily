import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
  try {
    console.log('🚀 Received request to Deepseek endpoint');
    
    const { messages } = await request.json();
    console.log('📨 Messages to process:', JSON.stringify(messages, null, 2));

    if (!env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }

    console.log('🔑 Using API key:', '✓ Present');
    console.log('🌐 Making request to Deepseek API...');

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DeepSeek API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Received response from Deepseek');
    
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Deepseek API');
    }
    
    console.log('📝 Response content:', content.substring(0, 100) + '...');

    // Return in the format expected by the AI SDK
    return json({
      messages: [
        ...messages,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content
        }
      ]
    });
    
  } catch (error) {
    console.error('❌ Error in Deepseek endpoint:', error);
    return json({ 
      error: error instanceof Error ? error.message : 'Failed to process request' 
    }, { status: 500 });
  }
}) satisfies RequestHandler;
