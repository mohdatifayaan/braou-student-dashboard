import { useEffect } from 'react'

// ─── Fixed QR-code data matrix (21×21, standard QR version 1 layout) ───────
// 1 = dark module (rendered), 0 = light module (transparent)
// Finder patterns occupy the 3 corners; timing patterns sit on row/col 6.

const QR_MATRIX = [
  [1,1,1,1,1,1,1, 0, 1,0,1,0,1, 0, 1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1, 0, 0,1,0,0,0, 0, 1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1, 0, 1,0,1,1,0, 0, 1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1, 0, 0,1,0,0,1, 0, 1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1, 0, 1,1,0,1,0, 0, 1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1, 0, 0,0,1,0,1, 0, 1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1, 0, 1,0,1,0,1, 0, 1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0, 0, 0,1,0,1,0, 0, 0,0,0,0,0,0,0],
  [1,0,1,0,0,0,1, 1, 0,0,1,0,0, 1, 0,1,0,0,1,0,1],
  [0,0,1,1,0,1,0, 0, 1,1,0,0,1, 0, 0,0,1,0,0,1,0],
  [1,1,0,0,1,0,1, 1, 0,0,1,1,0, 1, 1,0,0,1,1,0,1],
  [0,1,0,1,0,0,0, 0, 1,1,0,0,1, 0, 0,1,0,1,0,0,1],
  [1,0,1,0,1,1,1, 0, 0,0,1,1,0, 1, 0,0,1,0,1,1,0],
  [0,0,0,0,0,0,0, 0, 1,0,0,1,0, 0, 0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1, 0, 0,1,1,0,1, 0, 0,1,0,1,0,0,1],
  [1,0,0,0,0,0,1, 0, 1,0,0,1,0, 1, 0,0,1,0,1,1,0],
  [1,0,1,1,1,0,1, 1, 0,1,0,0,1, 0, 1,1,0,1,0,0,1],
  [1,0,1,1,1,0,1, 0, 1,0,1,1,0, 1, 0,0,1,0,0,1,0],
  [1,0,1,1,1,0,1, 0, 0,1,0,0,1, 0, 1,0,0,1,1,0,1],
  [1,0,0,0,0,0,1, 1, 1,0,0,1,0, 0, 0,1,0,0,0,1,0],
  [1,1,1,1,1,1,1, 0, 0,1,1,0,1, 1, 0,0,1,0,1,0,1],
]

const MODULE  = 5.5   // px per QR module
const QUIET   = 10    // quiet-zone padding in px
const QR_SIZE = 21 * MODULE + QUIET * 2   // total SVG canvas size

// ─── QR Code SVG ────────────────────────────────────────────────────────────

function QRCode() {
  return (
    <svg
      width={QR_SIZE}
      height={QR_SIZE}
      viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
      aria-label="QR scan code for student credential"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Quiet-zone background */}
      <rect width={QR_SIZE} height={QR_SIZE} fill="rgba(255,255,255,0.06)" rx="6" />

      {/* Data modules */}
      {QR_MATRIX.map((row, r) =>
        row.map((cell, c) =>
          cell === 1 ? (
            <rect
              key={`${r}-${c}`}
              x={QUIET + c * MODULE}
              y={QUIET + r * MODULE}
              width={MODULE - 0.5}
              height={MODULE - 0.5}
              rx={c <= 6 && r <= 6   ? 1       // top-left finder — square
                : c >= 14 && r <= 6  ? 1       // top-right finder — square
                : c <= 6 && r >= 14  ? 1       // bottom-left finder — square
                : 0.8}                          // data modules — slightly rounded
              fill="white"
            />
          ) : null
        )
      )}
    </svg>
  )
}

// ─── DigitalIDModal ──────────────────────────────────────────────────────────

/**
 * DigitalIDModal — Premium digital student ID card overlay.
 *
 * Props:
 *   user    { id, name, role, group }  — from Dashboard's auth state
 *   onClose () => void                 — backdrop click / Escape / × button
 */
export default function DigitalIDModal({ user, onClose }) {
  const STUDENT_ID  = 'BRA-2026-8921'
  const VALID_UNTIL = '2024 – 2027'

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    // ── Backdrop ──────────────────────────────────────────────────────────────
    <div
      id="id-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Digital student ID card"
    >
      {/* ── Card (stops propagation so clicks inside don't close modal) ──────── */}
      <div
        className="relative flex w-full max-w-xs flex-col overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-[var(--bg-page-start)] to-[var(--bg-page-end)] border border-[var(--border-subtle)] transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Gloss highlight (diagonal sheen) ──────────────────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)',
          }}
        />

        {/* ── Emerald accent bar ─────────────────────────────────────────────── */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-700 via-emerald-400 to-emerald-600" />

        {/* ── Close button ───────────────────────────────────────────────────── */}
        <button
          id="id-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close ID card"
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--btn-glass-bg)] text-[var(--btn-glass-text)] transition-colors hover:bg-[var(--btn-glass-hover-bg)] hover:text-[var(--btn-glass-hover-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── University header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2.5 px-6 pt-5 pb-4">
          {/* Crest icon */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 shadow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              B.R. Ambedkar
            </p>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              Open University
            </p>
          </div>
        </div>

        {/* ── Subtle divider ─────────────────────────────────────────────────── */}
        <div className="mx-6 h-px bg-[var(--border-subtle)]" />

        {/* ── Avatar ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center px-6 pt-6 pb-4">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-xl font-black text-white shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
              border: '3px solid rgba(255,255,255,0.15)',
            }}
          >
            {initials}
          </div>

          {/* ── Identity ─────────────────────────────────────────────────────── */}
          <h2 className="mt-3 text-lg font-bold tracking-wide text-[var(--text-primary)]">
            {user?.name ?? 'Student'}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-emerald-500">
            {user?.role ?? 'Student'}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">{user?.group ?? '—'}</p>

          {/* ID number pill */}
          <div
            className="mt-4 w-full rounded-xl px-4 py-2.5 text-center bg-[var(--btn-glass-bg)] border border-[var(--btn-glass-border)]"
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-500">
              {STUDENT_ID}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">Valid: {VALID_UNTIL}</p>
          </div>
        </div>

        {/* ── QR Code section ────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center px-6 pb-5">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Scan to Verify
          </p>

          {/* QR canvas */}
          <div
            className="rounded-xl p-1.5 bg-[var(--btn-glass-bg)] border border-[var(--border-subtle)]"
          >
            <QRCode />
          </div>

          <p className="mt-2 font-mono text-[9px] tracking-widest text-[var(--text-muted)]">
            BRA20268921
          </p>
        </div>

        {/* ── Valid footer strip ─────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ background: 'rgba(16,185,129,0.12)', borderTop: '1px solid rgba(16,185,129,0.20)' }}
        >
          <div className="flex items-center gap-1.5">
            {/* Verified checkmark */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="text-xs font-bold tracking-wide text-emerald-400">VALID</span>
          </div>

          {/* Chip / NFC icon */}
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <rect x="7" y="7" width="10" height="10" rx="1" />
              <path d="M7 9H5M7 12H5M7 15H5M17 9h2M17 12h2M17 15h2M9 7V5M12 7V5M15 7V5M9 19v-2M12 19v-2M15 19v-2" />
            </svg>
            <span className="text-[9px] font-semibold uppercase tracking-widest">Biometric</span>
          </div>
        </div>
      </div>
    </div>
  )
}
