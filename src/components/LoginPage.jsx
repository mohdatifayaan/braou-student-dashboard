import LoginForm from './LoginForm.jsx'
import universityLogo from '../3-universuty logo .webp'


// Decorative background blobs for depth
function BackgroundBlobs() {
  return (
    <>
      {/* Top-right emerald blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"
      />
      {/* Bottom-left navy blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-navy-700/30 blur-3xl"
      />
      {/* Centre subtle highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl"
      />
    </>
  )
}

/**
 * LoginPage — full-viewport shell with gradient background, card, branding,
 * and the "Contact IT Support" footer helper.
 */
export default function LoginPage({ onLoginSuccess }) {
  return (
    <main
      id="login-page"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-navy-950 via-navy-800 to-navy-700 px-4 py-12"
    >
      <BackgroundBlobs />

      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Login Card ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="login-heading"
        className="animate-fade-in-up relative z-10 w-full max-w-md"
      >
        <div className="overflow-hidden rounded-2xl bg-white/[0.97] shadow-2xl ring-1 ring-white/20 backdrop-blur-sm">

          {/* Card header — emerald accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" />

          <div className="px-8 pb-8 pt-8">

            {/* ── Branding ───────────────────────────────────────── */}
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4">
                <img
                  src={universityLogo}
                  alt="Dr. B.R. Ambedkar Open University Logo"
                  className="w-32 h-32 mx-auto mb-2 object-contain"
                />
              </div>

              <h1
                id="login-heading"
                className="text-2xl font-bold tracking-tight text-navy-900"
              >
                B.R Ambedkar university portal
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 font-medium tracking-wide uppercase">
                Student &amp; Staff Sign In
              </p>

              {/* Divider */}
              <div className="mt-6 flex w-full items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">Secure Access</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
            </div>

            {/* ── Form ────────────────────────────────────────────── */}
            <LoginForm onLoginSuccess={onLoginSuccess} />

            {/* ── Divider ─────────────────────────────────────────── */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs text-slate-300">or</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* ── SSO hint ────────────────────────────────────────── */}
            <p className="mt-4 text-center text-xs text-slate-400">
              Using institutional SSO?{' '}
              <a
                href="#"
                id="sso-link"
                className="font-medium text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
              >
                Sign in with SSO
              </a>
            </p>
          </div>
        </div>

        {/* ── IT Support footer ────────────────────────────────── */}
        <p className="mt-6 text-center text-sm text-slate-400/80">
          Having trouble logging in?{' '}
          <a
            href="mailto:it-support@university.edu"
            id="it-support-link"
            className="font-medium text-emerald-400 underline-offset-2 transition-all hover:text-emerald-300 hover:underline"
          >
            Contact University IT Support
          </a>
        </p>

        {/* ── Copyright ───────────────────────────────────────── */}
        <p className="mt-3 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} University. All rights reserved.
        </p>
      </section>
    </main>
  )
}
