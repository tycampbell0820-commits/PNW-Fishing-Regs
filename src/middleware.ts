import { NextResponse, type NextRequest } from 'next/server';

// HTTP Basic Auth gate for the entire app.
//
// Configure via env:
//   LANDFINDER_AUTH_USER     (default: "team")
//   LANDFINDER_AUTH_PASSWORD (required; if unset, auth is BYPASSED for local dev)
//
// The middleware runs on every request that matches `config.matcher` below.
// Static assets and Next internals are excluded so the dialog only fires once.

const REALM = 'Land Finder';

function unauthorized(): NextResponse {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store'
    }
  });
}

// Constant-time string compare to keep credential checks from leaking timing.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function middleware(req: NextRequest): NextResponse {
  const expectedPassword = process.env.LANDFINDER_AUTH_PASSWORD;
  // Dev convenience: no password set => no auth.
  if (!expectedPassword) return NextResponse.next();

  const expectedUser = process.env.LANDFINDER_AUTH_USER ?? 'team';

  const header = req.headers.get('authorization') ?? '';
  if (!header.toLowerCase().startsWith('basic ')) return unauthorized();

  const decoded = (() => {
    try {
      return atob(header.slice(6).trim());
    } catch {
      return null;
    }
  })();
  if (!decoded) return unauthorized();

  const idx = decoded.indexOf(':');
  if (idx < 0) return unauthorized();
  const user = decoded.slice(0, idx);
  const pass = decoded.slice(idx + 1);

  if (!timingSafeEqual(user, expectedUser) || !timingSafeEqual(pass, expectedPassword)) {
    return unauthorized();
  }
  return NextResponse.next();
}

export const config = {
  // Apply to all routes except Next.js static assets, the favicon, and the
  // unauthenticated health endpoint used by the container healthcheck.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/health).*)']
};
