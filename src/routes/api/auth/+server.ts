import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SITE_PASSWORD } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  const { password } = await request.json();
  
  if (password === SITE_PASSWORD) {
    return json({ success: true });
  }
  
  return new Response('Invalid password', { status: 401 });
}; 