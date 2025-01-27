import { env } from '$env/dynamic/private';
import { streamText } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';

const deepseek = createDeepSeek({
  apiKey: env.DEEPSEEK_API_KEY,
});

export const POST = async ({ request }) => {
  try {
    const { messages } = await request.json();

    const result = streamText({
      model: deepseek('deepseek-chat'),
      messages,
    });

    console.log(result.response);

    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error('❌ Error in Deepseek API:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
