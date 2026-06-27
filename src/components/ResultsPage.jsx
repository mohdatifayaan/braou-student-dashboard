import { useState, useCallback } from 'react'

// ─── Mock data ─────────────────────────────────────────────────────────────

const SEMESTERS = [
  {
    id: 's1',
    label: 'Semester 1',
    period: 'Jan 2024',
    courses: [
      { code: 'CS-101',   name: 'Introduction to Programming', credits: 4, grade: 'A'  },
      { code: 'MATH-101', name: 'Calculus I',                  credits: 4, grade: 'B+' },
      { code: 'ENG-101',  name: 'Technical Writing',           credits: 3, grade: 'A−' },
      { code: 'PHY-101',  name: 'Physics I',                   credits: 4, grade: 'B'  },
    ],
  },
  {
    id: 's2',
    label: 'Semester 2',
    period: 'Aug 2024',
    courses: [
      { code: 'CS-201',   name: 'Object-Oriented Programming', credits: 4, grade: 'A−' },
      { code: 'MATH-201', name: 'Discrete Mathematics',        credits: 3, grade: 'B+' },
      { code: 'CS-202',   name: 'Computer Architecture',       credits: 3, grade: 'A'  },
      { code: 'BUS-101',  name: 'Business Fundamentals',       credits: 3, grade: 'B+' },
    ],
  },
  {
    id: 's3',
    label: 'Semester 3',
    period: 'Jan 2025',
    courses: [
      { code: 'CS-301',   name: 'Data Structures & Algorithms',  credits: 4, grade: 'A−' },
      { code: 'BA-201',   name: 'Business Ethics & Corp. Law',   credits: 3, grade: 'B+' },
      { code: 'CS-410',   name: 'Cloud Computing Fundamentals',  credits: 3, grade: 'A'  },
      { code: 'MATH-301', name: 'Linear Algebra',                credits: 3, grade: 'A−' },
    ],
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Map a grade string to a Tailwind text colour class */
function gradeColor(grade) {
  if (/^A[+]?$/.test(grade))  return 'text-emerald-600 font-bold'
  if (grade === 'A−')          return 'text-emerald-500 font-bold'
  if (/^B[+]?$/.test(grade))  return 'text-blue-600 font-semibold'
  if (grade === 'B−')          return 'text-blue-500 font-semibold'
  return 'text-amber-600 font-semibold'
}

function totalCredits(courses) {
  return courses.reduce((sum, c) => sum + c.credits, 0)
}

// ─── Semester accordion ────────────────────────────────────────────────────

function SemesterAccordion({ semester, isOpen, onToggle }) {
  const credits = totalCredits(semester.courses)

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-[var(--bg-card)] shadow-md ring-1 transition-all duration-300 ${
        isOpen ? 'ring-emerald-400' : 'ring-[var(--border-subtle)] hover:ring-[var(--border-strong)]'
      }`}
    >
      {/* ── Header (always visible) ─────────────────────────────── */}
      <button
        id={`accordion-${semester.id}`}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`panel-${semester.id}`}
        className="flex w-full items-center justify-between px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-inset"
      >
        <div className="flex items-center gap-3">
          {/* Semester badge */}
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
              isOpen
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {semester.id.replace('s', 'S')}
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{semester.label}</p>
            <p className="text-xs text-[var(--text-muted)]">
              {semester.period} · {semester.courses.length} subjects · {credits} credits
            </p>
          </div>
        </div>

        {/* Chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-emerald-500' : ''
          }`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Collapsible panel ───────────────────────────────────── */}
      <div
        id={`panel-${semester.id}`}
        role="region"
        aria-labelledby={`accordion-${semester.id}`}
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
        style={isOpen ? undefined : { maxHeight: 0 }}
      >
        <div className="border-t border-[var(--border-subtle)] px-5 pb-5 pt-0">
          {/* ── Grade table ─────────────────────────────────────── */}
          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
            <table className="w-full text-sm" aria-label={`${semester.label} results`}>
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--btn-glass-bg)]">
                  <th className="py-3 pl-4 pr-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Code
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Course Name
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Credits
                  </th>
                  <th className="py-3 pl-2 pr-4 text-center text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {semester.courses.map((course) => (
                  <tr
                    key={course.code}
                    className="transition-colors hover:bg-[var(--btn-glass-hover-bg)]"
                  >
                    <td className="py-3 pl-4 pr-2">
                      <span className="rounded-md bg-[var(--btn-glass-bg)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--text-secondary)]">
                        {course.code}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-[var(--text-primary)]">{course.name}</td>
                    <td className="px-2 py-3 text-center text-[var(--text-secondary)]">{course.credits}</td>
                    <td className="py-3 pl-2 pr-4 text-center">
                      <span className={`text-sm ${gradeColor(course.grade)}`}>
                        {course.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[var(--border-subtle)] bg-[var(--btn-glass-bg)]">
                  <td colSpan={2} className="py-2.5 pl-4 text-xs font-semibold text-[var(--text-muted)]">
                    Semester Total
                  </td>
                  <td className="py-2.5 text-center text-xs font-bold text-[var(--text-secondary)]">
                    {credits}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Download toast ────────────────────────────────────────────────────────

function useDownloadToast() {
  const [visible, setVisible] = useState(false)

  const trigger = useCallback(() => {
    setVisible(true)
    setTimeout(() => setVisible(false), 2000)
  }, [])

  return { visible, trigger }
}

// ─── ResultsPage ───────────────────────────────────────────────────────────

/**
 * ResultsPage — Academic history with semester accordions and GPA card.
 *
 * Props:
 *   user   { id, name, role, group } — from App.jsx auth state
 *   onBack () => void                — navigates back to Dashboard
 */
export default function ResultsPage({ user, onBack }) {
  // Most-recent semester open by default
  const [openSemester, setOpenSemester] = useState('s3')
  const { visible: toastVisible, trigger: triggerToast } = useDownloadToast()

  function handleToggle(id) {
    setOpenSemester((prev) => (prev === id ? null : id))
  }

  // Render semesters most-recent first for natural reading order
  const ordered = [...SEMESTERS].reverse()

  return (
    <div
      id="results-page"
      className="min-h-screen bg-gradient-to-br from-[var(--bg-page-start)] via-[var(--bg-page-mid)] to-[var(--bg-page-end)] transition-colors duration-300"
    >
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none fixed -bottom-32 -left-32 h-80 w-80 rounded-full bg-navy-700/20 blur-3xl" />

      {/* Grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Page content ────────────────────────────────────────── */}
      <main className="relative mx-auto max-w-3xl animate-fade-in-up px-4 py-8 sm:px-6">

        {/* ── Top action bar ──────────────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Back button */}
          <button
            id="back-to-dashboard"
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-[var(--btn-glass-border)] bg-[var(--btn-glass-bg)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--btn-glass-hover-bg)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Dashboard
          </button>

          {/* Download transcript */}
          <button
            id="download-transcript"
            type="button"
            onClick={triggerToast}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-emerald-500 hover:to-emerald-400 hover:shadow-lg active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="hidden sm:inline">Download Official Transcript</span>
            <span className="sm:hidden">Transcript</span>
          </button>
        </div>

        {/* ── Identity + GPA row ───────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-stretch">
          {/* User identity card */}
          <div className="flex flex-1 items-center gap-4 rounded-2xl bg-[var(--bg-card)] px-6 py-5 shadow-md ring-1 ring-[var(--border-subtle)] transition-colors duration-300">
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-lg font-bold text-white shadow">
              {user?.name
                ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
                : '?'}
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)] transition-colors duration-300">
                {user?.name ?? 'Student'}
              </h1>
              <p className="text-sm text-[var(--text-secondary)] transition-colors duration-300">
                {user?.group} · {user?.role}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)] transition-colors duration-300">
                Academic Year 2024–25
              </p>
            </div>
          </div>

          {/* GPA card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-5 shadow-md sm:min-w-[180px]">
            <div aria-hidden="true" className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100">
              Cumulative GPA
            </p>
            <p className="mt-1 text-4xl font-black text-white">3.8</p>
            <p className="text-xs text-emerald-200">out of 4.0</p>
            <div className="mt-2 flex items-center gap-0.5" aria-label="4 out of 5 stars">
              {[1,2,3,4].map((s) => (
                <svg key={s} viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-yellow-300" aria-hidden="true">
                  <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.873 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
                </svg>
              ))}
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-white/30" aria-hidden="true">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.873 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
              </svg>
            </div>
            <p className="mt-1.5 text-[11px] font-semibold text-emerald-100">
              🏅 Distinction
            </p>
          </div>
        </div>

        {/* ── Semester accordions ──────────────────────────────────── */}
        <div className="space-y-3" role="list" aria-label="Academic semesters">
          {ordered.map((semester) => (
            <div key={semester.id} role="listitem">
              <SemesterAccordion
                semester={semester}
                isOpen={openSemester === semester.id}
                onToggle={() => handleToggle(semester.id)}
              />
            </div>
          ))}
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <p className="mt-8 text-center text-xs text-[var(--text-muted)] transition-colors duration-300">
          © {new Date().getFullYear()} B.R. Ambedkar Open University · Records are for informational purposes only
        </p>
      </main>

      {/* ── Download toast ────────────────────────────────────────── */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          toastVisible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-3 shadow-2xl transition-colors duration-300">
          <span className="text-lg" aria-hidden="true">📄</span>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Transcript Requested</p>
            <p className="text-xs text-[var(--text-secondary)]">Your official transcript will be emailed shortly.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
