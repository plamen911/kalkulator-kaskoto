// Cloudflare Pages Function: same-origin proxy to the casco backend.
//
// Forwards any /api/<rest> request to https://daike.eu/api/<rest>, preserving
// method, body and query string. Because the call is made server-side
// (Cloudflare -> daike.eu) the browser only ever talks to its own origin, so
// no CORS configuration is needed on the backend.
//
// The standalone (Cloudflare) build sets VITE_API_URL=/api/kaskoto so the app
// hits this proxy; the WordPress/local build keeps calling daike.eu directly.
export async function onRequest({ request, params }) {
  const rest = Array.isArray(params.path) ? params.path.join('/') : params.path
  const url = new URL(request.url)
  const target = `https://daike.eu/api/${rest}${url.search}`

  const init = {
    method: request.method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    init.body = await request.text()
  }

  const resp = await fetch(target, init)
  return new Response(resp.body, {
    status: resp.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
