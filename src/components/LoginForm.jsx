import { useState, useCallback, useRef, useEffect } from 'react'

// ─── Constants ─────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:4000/api/auth'

/** International phone: optional +, 7–20 chars of digits/spaces/dashes */
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/
const PHONE_DIGITS_RE = /\d/g

// ─── Validation ────────────────────────────────────────────────────────────

function validatePhone(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Please enter your registered phone number.'
  const digits = (trimmed.match(PHONE_DIGITS_RE) || []).length
  if (!PHONE_RE.test(trimmed) || digits < 7)
    return 'Enter a valid phone number (e.g. +91 98765 43210).'
  return null
}

function validateOtp(value) {
  if (!value) return 'Please enter the OTP sent to your phone.'
  if (!/^\d{6}$/.test(value)) return 'OTP must be exactly 6 digits.'
  return null
}

// ─── Reusable UI pieces ────────────────────────────────────────────────────

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
      <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 7a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
      </svg>
      {message}
    </p>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin-smooth h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

/**
 * Countdown timer — shows how many seconds remain before the OTP expires.
 * Resets whenever `resetKey` changes (i.e. every time a new OTP is sent).
 */
function OtpCountdown({ seconds, resetKey }) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    setRemaining(seconds)
    const id = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) { clearInterval(id); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [resetKey, seconds])

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0')
  const secs = String(remaining % 60).padStart(2, '0')

  return (
    <span className={`text-xs font-medium tabular-nums ${remaining < 60 ? 'text-red-500' : 'text-slate-400'}`}>
      {remaining > 0 ? `${mins}:${secs}` : 'Expired'}
    </span>
  )
}


// ─── Main Component ────────────────────────────────────────────────────────

/**
 * LoginForm — two-step OTP authentication connected to the local Express backend.
 *
 * Step 1 — Phone entry: POST /api/auth/request-otp  → transitions to OTP step
 * Step 2 — OTP entry:   POST /api/auth/verify-otp   → calls onLoginSuccess(user)
 *
 * Props:
 *   onLoginSuccess(user) — called by App.jsx to transition to OnboardingScreen
 *
 * To point at a different backend, change API_BASE at the top of this file.
 */
export default function LoginForm({ onLoginSuccess }) {
  // ── Step 1 state ───────────────────────────────────────────────────────────
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError]   = useState(null)

  // ── Step 2 state ───────────────────────────────────────────────────────────
  const [isOtpSent, setIsOtpSent]   = useState(false)
  const [otp, setOtp]               = useState('')
  const [otpError, setOtpError]     = useState(null)
  const [otpResetKey, setOtpResetKey] = useState(0) // bumped to reset countdown

  // ── Shared state ───────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError]         = useState(null)  // backend-level errors

  const otpInputRef = useRef(null)

  // Auto-focus the OTP field when the step transitions
  useEffect(() => {
    if (isOtpSent && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [isOtpSent])

  // ── Step 1: Request OTP ────────────────────────────────────────────────────
  const handleRequestOtp = useCallback(async (e) => {
    e.preventDefault()
    setApiError(null)

    const err = validatePhone(phoneNumber)
    setPhoneError(err)
    if (err) return

    setIsSubmitting(true)
    setIsSubmitting(true)
    // ── Bypass backend fetch for testing
    setTimeout(() => {
      setIsSubmitting(false)
      setIsOtpSent(true)
      setOtpResetKey((k) => k + 1)
      setOtp('')
    }, 500)
  }, [phoneNumber])

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
  const handleVerifyOtp = useCallback(async (e) => {
    e.preventDefault()
    setApiError(null)

    const err = validateOtp(otp)
    setOtpError(err)
    if (err) return

    setIsSubmitting(true)
    setIsSubmitting(true)
    // ── Bypass backend fetch for testing
    setTimeout(() => {
      setIsSubmitting(false)
      if (otp.trim() === '123456') { // Mock check for demo
        localStorage.setItem('university_token', 'mock_token_123')
        onLoginSuccess({ id: 'u1', name: 'Student Test', role: 'Student', group: 'Computer Science' })
      } else {
        setOtpError('Invalid OTP. Please try "123456".')
      }
    }, 500)
  }, [phoneNumber, otp])

  // ── Resend OTP ──────────────────────────────────────────────────────────────
  const handleResend = useCallback(async () => {
    setApiError(null)
    setOtpError(null)
    setOtp('')
    setIsSubmitting(true)
    setIsSubmitting(true)
    // ── Bypass backend fetch for testing
    setTimeout(() => {
      setIsSubmitting(false)
      setOtpResetKey((k) => k + 1)
    }, 500)
  }, [phoneNumber])


  // ── Render: OTP entry (Step 2) ──────────────────────────────────────────────

  if (isOtpSent) {
    return (
      <form
        onSubmit={handleVerifyOtp}
        noValidate
        aria-label="OTP verification form"
        className="space-y-5"
      >
        {/* Context reminder */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <p className="font-medium">OTP sent!</p>
          <p className="mt-0.5 text-xs text-emerald-600">
            A 6-digit code was sent to{' '}
            <span className="font-semibold">{phoneNumber}</span>.
            Check the server console if you're in development mode.
          </p>
        </div>

        {/* Backend-level error */}
        {apiError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9 7a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0V7zm1 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
            </svg>
            {apiError}
          </div>
        )}

        {/* OTP input */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="otp-input" className="block text-sm font-medium text-slate-700">
              One-Time Password
            </label>
            <OtpCountdown seconds={300} resetKey={otpResetKey} />
          </div>

          <input
            id="otp-input"
            ref={otpInputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6)
              setOtp(val)
              if (otpError) setOtpError(validateOtp(val))
            }}
            disabled={isSubmitting}
            placeholder="Enter 6-digit OTP"
            aria-describedby={otpError ? 'otp-error' : undefined}
            aria-invalid={!!otpError}
            className={`input-field w-full rounded-xl border bg-white/80 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-slate-700 placeholder-slate-300 ${
              otpError ? 'input-error border-red-500' : 'border-slate-200 hover:border-slate-300'
            } ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
          />
          <FieldError id="otp-error" message={otpError} />
        </div>

        {/* Verify button */}
        <button
          id="verify-otp-button"
          type="submit"
          disabled={isSubmitting || otp.length !== 6}
          className="btn-signin w-full rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              Verifying…
            </span>
          ) : (
            'Verify & Enter'
          )}
        </button>

        {/* Back + Resend row */}
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            id="back-to-phone-button"
            onClick={() => {
              setIsOtpSent(false)
              setOtp('')
              setOtpError(null)
              setApiError(null)
            }}
            className="text-slate-400 transition-colors hover:text-slate-600 hover:underline"
          >
            ← Change number
          </button>

          <button
            type="button"
            id="resend-otp-button"
            onClick={handleResend}
            disabled={isSubmitting}
            className="font-medium text-emerald-600 transition-colors hover:text-emerald-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend OTP
          </button>
        </div>
      </form>
    )
  }

  // ── Render: Phone entry (Step 1) ────────────────────────────────────────────
  return (
    <form
      onSubmit={handleRequestOtp}
      noValidate
      aria-label="University sign-in form"
      className="space-y-5"
    >
      {/* Backend-level error */}
      {apiError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9 7a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0V7zm1 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
          </svg>
          {apiError}
        </div>
      )}

      {/* Phone number field */}
      <div>
        <label htmlFor="phone-input" className="mb-1.5 block text-sm font-medium text-slate-700">
          Registered Phone Number
        </label>

        <div className="relative">
          {/* Phone icon */}
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>

          <input
            id="phone-input"
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value)
              if (phoneError) setPhoneError(validatePhone(e.target.value))
            }}
            onBlur={() => setPhoneError(validatePhone(phoneNumber))}
            placeholder="+91 98765 43210"
            disabled={isSubmitting}
            autoComplete="tel"
            aria-describedby={phoneError ? 'phone-error' : undefined}
            aria-invalid={!!phoneError}
            className={`input-field w-full rounded-xl border bg-white/80 py-3 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 ${
              phoneError
                ? 'input-error border-red-500'
                : 'border-slate-200 hover:border-slate-300'
            } ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
          />
        </div>
        <FieldError id="phone-error" message={phoneError} />
      </div>

      {/* Sign In button */}
      <button
        id="sign-in-button"
        type="submit"
        disabled={isSubmitting}
        className="btn-signin w-full rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner />
            Sending OTP…
          </span>
        ) : (
          'Sign In'
        )}
      </button>

      <p className="text-center text-xs text-slate-400">
        We'll send a one-time code to your university-registered number.
      </p>
    </form>
  )
}
