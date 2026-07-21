import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const response = next();

  // CORS: Only allow requests from the same origin (prevent CSRF)
  const origin = context.request.headers.get('origin');
  const requestUrl = new URL(context.request.url);
  const isLocalhost = requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1';
  
  // Allow same-origin requests and localhost for development
  if (isLocalhost || !origin || origin === requestUrl.origin) {
    return response;
  }

  // Block cross-origin requests to prevent CSRF
  // API endpoints should only be called from same-origin
  if (context.request.url.includes('/api/')) {
    return new Response(JSON.stringify({ error: 'Cross-origin requests not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return response;
});
