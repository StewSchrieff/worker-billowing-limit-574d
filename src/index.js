import { Ai } from './vendor/@cloudflare/ai.js';

export default {
  async fetch(request, env) {
    const ai = new Ai(env.AI);
    const url = new URL(request.url);
    
    const inputs = {
      prompt: url.searchParams.get('p')
    };

    const response = await ai.run(
      '@cf/bytedance/stable-diffusion-xl-lightning',
      inputs
    );

    return new Response(response, {
      headers: {
        'content-type': 'image/png',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
      }
    });
  }
};
