// Optional company-logo header for the standalone (Cloudflare) landing page.
// Gated by a build env var, mirroring the API-URL pattern in utils/Requester.js:
// off by default so the WordPress embed renders nothing and stays unchanged.
const showBranding = import.meta.env.VITE_SHOW_BRANDING === 'true'

export default () => (
  showBranding
    ? (
      <header className="text-center py-3">
        <img
          src="/logo.jpg"
          alt="General Broker Club — Застраховайте с Дайке"
          style={{ maxWidth: 520, width: '90%', height: 'auto' }}
        />
      </header>
    )
    : null
)
