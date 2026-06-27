import { useState, useRef, useEffect, useCallback } from 'react'
import DigitalIDModal from './DigitalIDModal.jsx'
import GrowthFeed     from './GrowthFeed.jsx'
import mockData       from '../Data/mockdata.json'

// ─── Interest label lookup (mirrors OnboardingScreen) ─────────────────────

const INTEREST_LABELS = {
  cloud:   '💻 Cloud Computing',
  design:  '📐 3D Design',
  account: '📊 Accounting',
  sports:  '⚽ Sports',
  exam:    '📅 Exam Prep',
  campus:  '🎭 Campus Events',
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    id: 'id-card',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <circle cx="8" cy="12" r="2" />
        <path d="M14 11h4M14 14h4" />
      </svg>
    ),
    label: 'Download ID Card',
    color: 'blue',
  },
  {
    id: 'pay-fees',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    label: 'Pay Fees',
    color: 'emerald',
  },
  {
    id: 'view-results',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    label: 'View Results',
    color: 'violet',
  },
  {
    id: 'timetable',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8"  y1="2" x2="8"  y2="6" />
        <line x1="3"  y1="10" x2="21" y2="10" />
      </svg>
    ),
    label: 'Time Table',
    color: 'amber',
  },
]

// ─── Colour maps ────────────────────────────────────────────────────────────

const PROGRESS_COLOR = {
  emerald: 'bg-emerald-500',
  blue:    'bg-blue-500',
  violet:  'bg-violet-500',
}

const PROGRESS_BG = {
  emerald: 'bg-emerald-100',
  blue:    'bg-blue-100',
  violet:  'bg-violet-100',
}

const PROGRESS_TEXT = {
  emerald: 'text-emerald-700',
  blue:    'text-blue-700',
  violet:  'text-violet-700',
}


const ACTION_STYLE = {
  blue:    'bg-blue-50   text-blue-700   hover:bg-blue-100   ring-blue-200',
  emerald: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-emerald-200',
  violet:  'bg-violet-50 text-violet-700 hover:bg-violet-100 ring-violet-200',
  amber:   'bg-amber-50  text-amber-700  hover:bg-amber-100  ring-amber-200',
}

// ─── Greeting helper ────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Profile dropdown ───────────────────────────────────────────────────────

function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const containerRef   = useRef(null)

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  console.log("Navbar sees image URL:", user?.avatarPreview);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        id="profile-menu-button"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open profile menu"
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
          open
            ? 'border-emerald-400/40 bg-emerald-500/20 text-white'
            : 'border-white/10 bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
        }`}
      >
        {/* Avatar bubble */}
        {user?.avatarPreview ? (
          <img
            src={user.avatarPreview}
            alt="Profile avatar"
            className="h-6 w-6 rounded-full object-cover shadow-sm ring-1 ring-white/10"
          />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm">
            {initials}
          </span>
        )}
        <span className="hidden sm:block">{user?.name?.split(' ')[0] ?? 'Profile'}</span>
        {/* Chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="menu"
          aria-labelledby="profile-menu-button"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right animate-fade-in-up overflow-hidden rounded-2xl border border-white/10 bg-navy-800/95 shadow-2xl backdrop-blur-xl ring-1 ring-navy-700"
        >
          {/* User identity block */}
          <div className="border-b border-white/10 px-4 py-4">
            {/* Avatar + name row */}
            <div className="flex items-center gap-3">
              {user?.avatarPreview ? (
                <img
                  src={user.avatarPreview}
                  alt="Profile avatar"
                  className="h-11 w-11 shrink-0 rounded-full object-cover shadow ring-1 ring-white/10"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white shadow">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.name ?? '—'}
                </p>
                <p className="truncate text-xs text-white/50">
                  {user?.role ?? '—'} · {user?.group ?? '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Detail rows */}
          <div className="space-y-0 border-b border-white/10 py-2">
            {[
              { label: 'Full Name',      value: user?.name  },
              { label: 'Role',           value: user?.role  },
              { label: 'Academic Group', value: user?.group },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-white/40">{label}</span>
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-white/80">
                  {value ?? '—'}
                </span>
              </div>
            ))}
          </div>

          {/* Logout */}
          <div className="p-2">
            <button
              id="dropdown-logout-button"
              type="button"
              role="menuitem"
              onClick={() => { setOpen(false); onLogout() }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/15 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Top navigation bar ─────────────────────────────────────────────────────

function TopNav({ user, onLogout, theme, toggleTheme }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-overlay)] px-6 py-3 backdrop-blur-md transition-colors duration-300">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 shadow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <span className="hidden text-sm font-semibold text-[var(--text-primary)] sm:block transition-colors duration-300">
          B.R. Ambedkar Open University
        </span>
        <span className="text-sm font-semibold text-[var(--text-primary)] sm:hidden transition-colors duration-300">BRAOU</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--btn-glass-border)] bg-[var(--btn-glass-bg)] text-[var(--btn-glass-text)] transition-all duration-150 hover:bg-[var(--btn-glass-hover-bg)] hover:text-[var(--btn-glass-hover-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Profile dropdown */}
        <ProfileDropdown user={user} onLogout={onLogout} />
      </div>
    </header>
  )
}

// ─── Welcome banner ─────────────────────────────────────────────────────────

function WelcomeBanner({ user, tags }) {
  // Resolve IDs → human-readable labels
  const tagLabels = (tags ?? []).map((id) => INTEREST_LABELS[id]).filter(Boolean)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-800 to-navy-700 px-6 py-5 shadow-lg ring-1 ring-white/10">
      {/* Decorative blob */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl" />

      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
        {getGreeting()}
      </p>
      <h1 className="mt-0.5 text-xl font-bold text-white">
        Welcome back, {user?.name ?? 'Student'}! 👋
      </h1>
      <p className="mt-1 text-sm text-white/50">
        {user?.group} · {user?.role}&nbsp;·&nbsp;
        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>

      {/* Interest tag pills — only rendered when tags exist */}
      {tagLabels.length > 0 && (
        <div
          className="mt-3 flex flex-wrap gap-2"
          aria-label="Your selected interests"
        >
          {tagLabels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/75 backdrop-blur-sm"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Quick Actions ──────────────────────────────────────────────────────────

function QuickActions({ onViewResults, onShowID }) {
  return (
    <div className="rounded-2xl bg-white/[0.97] p-5 shadow-md ring-1 ring-slate-100">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            id={`action-${action.id}`}
            type="button"
            onClick={
              action.id === 'view-results' ? onViewResults
              : action.id === 'id-card'    ? onShowID
              : undefined
            }
            className={`flex flex-col items-center gap-2 rounded-xl p-3 text-center ring-1 transition-all duration-150 hover:scale-[1.03] hover:shadow-md active:scale-[0.98] ${ACTION_STYLE[action.color]}`}
          >
            {action.icon}
            <span className="text-xs font-medium leading-tight">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Course Details Modal ────────────────────────────────────────────────────

function CourseModal({ course, onClose }) {
  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const courseColor = course.color || 'emerald'
  const courseCode = course.code || course.id
  const courseName = course.name || course.courseName
  const courseProgress = course.progress || 0

  const statItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-emerald-500" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      label: 'Attendance',
      value: course.stats?.attendance || 'N/A',
      sub: 'of scheduled classes',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-500" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      label: 'Midterm Grade',
      value: course.stats?.midtermGrade || 'N/A',
      sub: 'semester midterm result',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-violet-500" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      label: 'Next Assignment',
      value: course.stats?.nextAssignment || 'N/A',
      sub: null,
    },
  ]

  return (
    // ── Backdrop ──────────────────────────────────────────────────
    <div
      id="course-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(10,15,30,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-course-name"
    >
      {/* ── Panel ─────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-md animate-fade-in-up overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Coloured top bar matching the course colour */}
        <div className={`h-1.5 w-full ${
          courseColor === 'emerald' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
          : courseColor === 'blue'  ? 'bg-gradient-to-r from-blue-600 to-blue-400'
          :                           'bg-gradient-to-r from-violet-600 to-violet-400'
        }`} />

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {courseCode}
            </p>
            <h2
              id="modal-course-name"
              className="mt-0.5 text-lg font-bold leading-snug text-slate-900"
            >
              {courseName}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {course.instructor}
            </p>
          </div>

          {/* Close button */}
          <button
            id="modal-close-button"
            type="button"
            onClick={onClose}
            aria-label="Close course details"
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Progress bar recap */}
        <div className="mx-6 mb-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-slate-400">Course progress</span>
            <span className={`text-xs font-bold ${PROGRESS_TEXT[courseColor]}`}>
              {courseProgress}%
            </span>
          </div>
          <div className={`h-2 w-full overflow-hidden rounded-full ${PROGRESS_BG[courseColor]}`}>
            <div
              className={`h-full rounded-full ${PROGRESS_COLOR[courseColor]}`}
              style={{ width: `${courseProgress}%` }}
              role="progressbar"
              aria-valuenow={courseProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* ── Stats grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-px bg-slate-100 border-t border-slate-100">
          {statItems.map(({ icon, label, value, sub }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 bg-white px-3 py-4 text-center">
              {icon}
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="text-sm font-bold text-slate-800 leading-snug">{value}</p>
              {sub && <p className="text-[10px] text-slate-400 leading-tight">{sub}</p>}
            </div>
          ))}
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <div className="border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-50 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── My Courses ─────────────────────────────────────────────────────────────

function CoursesCard({ onSelect }) {
  const courses = mockData.currentCourses || []
  return (
    <div className="rounded-2xl bg-white/[0.97] p-5 shadow-md ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">My Courses</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {courses.length} enrolled
        </span>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <button
            key={course.id}
            id={`course-card-${course.id}`}
            type="button"
            onClick={() => onSelect(course)}
            className="group flex w-full flex-col justify-between cursor-pointer rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-left transition-all duration-150 hover:scale-[1.01] hover:border-slate-200 hover:bg-white hover:shadow-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label={`View details for ${course.courseName}`}
          >
            <div className="flex w-full items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {course.id}
                </p>
                <p className="text-sm font-bold leading-snug text-slate-800">
                  {course.courseName}
                </p>
                <p className="text-xs text-slate-500">{course.instructor}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="rounded-full px-2 py-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 shadow-sm">
                  {course.status}
                </span>
                {/* Chevron hint */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-slate-500" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Exam Results Modal ─────────────────────────────────────────────────────

function ResultsModal({ onClose }) {
  const gpa = mockData.student?.gpa || 'N/A'
  const exams = mockData.recentExams || []

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-md animate-fade-in-up overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">Exam Results</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* GPA Section */}
        <div className="flex flex-col items-center bg-emerald-50 py-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Overall GPA</p>
          <p className="text-4xl font-extrabold text-emerald-700">{gpa}</p>
        </div>

        {/* Recent Exams List */}
        <div className="px-6 py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Recent Exams</h3>
          <div className="space-y-3">
            {exams.map((exam, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-slate-800">{exam.courseName}</p>
                  <p className="text-xs text-slate-500">{exam.date}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-200">
                  {exam.grade}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-50 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ──────────────────────────────────────────────────────────────


/**
 * Dashboard — Smart Feed & Academic Hub.
 *
 * Props:
 *   user     { id, name, role, group }  — from App.jsx auth state
 *   tags     string[]                   — interest IDs from onboarding
 *   onLogout () => void                 — clears token, returns to Login
 */
export default function Dashboard({ user, tags = [], onLogout, onViewResults, theme, toggleTheme }) {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showIDModal,    setShowIDModal]    = useState(false)
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false)

  const handleSelect  = useCallback((course) => setSelectedCourse(course), [])
  const handleClose   = useCallback(() => setSelectedCourse(null), [])

  return (
    <div id="dashboard-page" className="min-h-screen bg-gradient-to-br from-[var(--bg-page-start)] via-[var(--bg-page-mid)] to-[var(--bg-page-end)] transition-colors duration-300">

      {/* ── Top nav ─────────────────────────────────────────────── */}
      <TopNav user={user} onLogout={onLogout} theme={theme} toggleTheme={toggleTheme} />

      {/* ── Page content ────────────────────────────────────────── */}
      <main className="mx-auto max-w-6xl animate-fade-in-up px-4 py-6 sm:px-6 lg:px-8">

        {/* Welcome banner with interests */}
        <div className="mb-6">
          <WelcomeBanner user={user} tags={tags} />
        </div>

        {/* Quick actions */}
        <div className="mb-6">
          <QuickActions
            onViewResults={() => setIsResultsModalOpen(true)}
            onShowID={() => setShowIDModal(true)}
          />
        </div>

        {/* Two-column responsive grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <CoursesCard onSelect={handleSelect} />
          </div>
          <div className="lg:col-span-2">
            <GrowthFeed tags={tags} />
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-white/20">
          © {new Date().getFullYear()} B.R. Ambedkar Open University · All rights reserved
        </footer>
      </main>

      {/* ── Course Details Modal ─────────────────────────────────── */}
      {selectedCourse && (
        <CourseModal course={selectedCourse} onClose={handleClose} />
      )}

      {/* ── Digital ID Modal ─────────────────────────────────────── */}
      {showIDModal && (
        <DigitalIDModal user={user} onClose={() => setShowIDModal(false)} />
      )}

      {/* ── Exam Results Modal ───────────────────────────────────── */}
      {isResultsModalOpen && (
        <ResultsModal onClose={() => setIsResultsModalOpen(false)} />
      )}
    </div>
  )
}
