import { forwardRef, useState } from 'react'

// Eye-open SVG icon
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

// Eye-off SVG icon
const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

/**
 * PasswordInput — reusable secure password field with show/hide toggle.
 *
 * Props:
 *   id         {string}   – input id (required for label association)
 *   value      {string}   – controlled value
 *   onChange   {Function} – change handler
 *   placeholder{string}   – placeholder text
 *   hasError   {boolean}  – shows error ring when true
 *   disabled   {boolean}  – disables the input and toggle
 *
 * forwardRef-compatible for future form-library integration.
 */
const PasswordInput = forwardRef(function PasswordInput(
  { id, value, onChange, placeholder = 'Password', hasError = false, disabled = false, ...rest },
  ref
) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        ref={ref}
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="current-password"
        className={`input-field w-full rounded-xl border bg-white/80 px-4 py-3 pr-12 text-sm text-slate-700 placeholder-slate-400 ${
          hasError
            ? 'input-error border-red-500'
            : 'border-slate-200 hover:border-slate-300'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        {...rest}
      />

      {/* Show / Hide toggle button */}
      <button
        type="button"
        id={`${id}-toggle`}
        onClick={() => setVisible((v) => !v)}
        disabled={disabled}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors duration-150 hover:text-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
})

export default PasswordInput
