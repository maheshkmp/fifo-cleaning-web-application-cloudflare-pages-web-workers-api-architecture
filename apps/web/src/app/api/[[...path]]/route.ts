export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

/**
 * Catch-all API route that proxies requests to the backend server
 * This handles all /api/* requests except those with specific route handlers
 */
export async function GET(request: NextRequest) {
  return proxyToBackend(request);
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request);
}

export async function PUT(request: NextRequest) {
  return proxyToBackend(request);
}

export async function PATCH(request: NextRequest) {
  return proxyToBackend(request);
}

export async function DELETE(request: NextRequest) {
  return proxyToBackend(request);
}

export async function OPTIONS(request: NextRequest) {
  return proxyToBackend(request);
}

// Headers that must NOT be forwarded to the backend (hop-by-hop / connection-specific).
// Forwarding these can corrupt the proxied request or expose internal routing info.
const HOP_BY_HOP_HEADERS = new Set([
  'host',              // backend must see its own host, not "localhost:3000"
  'connection',
  'keep-alive',
  'transfer-encoding',
  'te',
  'trailer',
  'upgrade',
  'proxy-authorization',
  'proxy-authenticate',
  'content-length',    // will be recomputed by fetch for the forwarded body
]);

async function proxyToBackend(request: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  
  // Get the path - request.nextUrl.pathname already includes /api/
  const path = request.nextUrl.pathname;
  const searchParams = request.nextUrl.search;
  
  // Construct the backend URL - backendUrl should NOT include /api
  // If path is /api/auth/get-session, we want: http://localhost:4000/api/auth/get-session
  const targetUrl = `${backendUrl}${path}${searchParams}`;
  
  console.log(`[Proxy] ${request.method} ${path} -> ${targetUrl}`);
  
  try {
    // Build a clean header set — omit hop-by-hop headers so the backend
    // sees only application-level headers. This prevents better-auth from
    // reading the wrong host and setting cookies on the wrong domain.
    const forwardHeaders = new Headers();
    request.headers.forEach((value, key) => {
      if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
        forwardHeaders.set(key, value);
      }
    });
    // Always set cookie explicitly (may be empty, which is fine)
    forwardHeaders.set('cookie', request.headers.get('cookie') || '');
    // Disable compression: Vercel/Hono sends Brotli by default but
    // Node.js fetch cannot decompress it, causing BrotliDecompressionError
    forwardHeaders.set('accept-encoding', 'identity');
    // Let the backend know the real origin so better-auth can validate
    // trustedOrigins and build correct callback/redirect URLs
    forwardHeaders.set('x-forwarded-host', request.nextUrl.host);
    forwardHeaders.set('x-forwarded-proto', request.nextUrl.protocol.replace(':', ''));
    forwardHeaders.set('x-forwarded-for', request.headers.get('x-forwarded-for') || '');

    // Forward the request to the backend
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' 
        ? await request.text() 
        : undefined,
      // Don't follow redirects automatically
      redirect: 'manual',
    });

    // Create a new response with the backend response
    const responseHeaders = new Headers();
    
    // Copy all headers EXCEPT Set-Cookie first
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'set-cookie') {
        responseHeaders.set(key, value);
      }
    });

    // Handle Set-Cookie headers properly using getSetCookie()
    // This is critical because Set-Cookie can have multiple values
    // and Headers.forEach() only gives the last one
    let setCookies: string[] = [];
    
    // Try modern getSetCookie() first (available in newer Node.js/browsers)
    if (typeof response.headers.getSetCookie === 'function') {
      setCookies = response.headers.getSetCookie();
      console.log(`[Proxy] Using getSetCookie(): ${setCookies.length} cookie(s)`);
    } else {
      // Fallback: collect all Set-Cookie headers manually
      const tempCookies: string[] = [];
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          tempCookies.push(value);
        }
      });
      setCookies = tempCookies;
      console.log(`[Proxy] Using fallback forEach(): ${setCookies.length} cookie(s)`);
    }
    
    setCookies.forEach((cookie, index) => {
      // Parse cookie attributes for debugging
      const cookieParts = cookie.split(';').map(p => p.trim());
      const cookieName = cookieParts[0]?.split('=')[0];
      const attributes = cookieParts.slice(1);
      
      console.log(`[Proxy] Set-Cookie[${index}] "${cookieName}":`, {
        fullLength: cookie.length,
        attributes: attributes,
        preview: cookie.substring(0, 150)
      });
      
      // CRITICAL FIX: Strip the Domain attribute only for localhost cookies.
      //
      // On localhost: the API runs on :4000 and sets Domain=localhost (or no Domain).
      // Stripping it ensures the browser treats the cookie as same-origin for :3000.
      //
      // On production (e.g. api.ghostcod.com): the API sets Domain=.ghostcod.com when
      // COOKIE_DOMAIN is configured. We must PRESERVE that attribute so the cookie is
      // accepted by BOTH www.ghostcod.com (proxy) and api.ghostcod.com (direct requests).
      // Stripping it here would lock the cookie to www.ghostcod.com only, breaking
      // direct client-side calls to api.ghostcod.com (e.g. from authClient in browser).
      let cleanedCookie = cookie;

      const domainMatch = cleanedCookie.match(/;\s*[Dd]omain=([^;]+)/);
      if (domainMatch) {
        const domainValue = domainMatch[1].trim().replace(/^\./, ''); // strip leading dot for check
        const isLocalhost = domainValue === 'localhost' || domainValue.startsWith('localhost:');
        if (isLocalhost) {
          cleanedCookie = cleanedCookie.replace(/;\s*[Dd]omain=[^;]+/g, '');
          console.log(`[Proxy] Stripped localhost Domain attribute from cookie`);
        }
        // Production domain (e.g. .ghostcod.com) → keep as-is for cross-subdomain support
      }
      
      responseHeaders.append('Set-Cookie', cleanedCookie);
    });

    // Return the proxied response
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Backend service unavailable',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
