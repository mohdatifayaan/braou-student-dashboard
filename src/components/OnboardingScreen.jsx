import { useState, useRef, useCallback } from 'react'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Initialize S3 Client using Vite environment variables
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
})

// ─── Interest chips data ───────────────────────────────────────────────────

const INTERESTS = [
  { id: 'cloud',   label: '💻 Cloud Computing' },
  { id: 'design',  label: '📐 3D Design'        },
  { id: 'account', label: '📊 Accounting'       },
  { id: 'sports',  label: '⚽ Sports'            },
  { id: 'exam',    label: '📅 Exam Prep'         },
  { id: 'campus',  label: '🎭 Campus Events'    },
]

// ─── Step Indicator ────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: 'Sign In'  },
  { n: 2, label: 'Profile'  },
  { n: 3, label: 'Dashboard' },
]

function StepIndicator({ current }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-0" aria-label="Onboarding progress">
      {STEPS.map((step, idx) => {
        const isDone    = step.n < current
        const isActive  = step.n === current
        const isUpcoming = step.n > current

        return (
          <div key={step.n} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-navy-700 text-white ring-4 ring-navy-700/20'
                    : 'bg-slate-100 text-slate-400'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isDone ? (
                  <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                  </svg>
                ) : (
                  step.n
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-navy-700' : isDone ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line between steps */}
            {idx < STEPS.length - 1 && (
              <div
                className={`mb-4 h-0.5 w-16 transition-colors duration-500 ${
                  isDone ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Avatar section ────────────────────────────────────────────────────────

function AvatarPicker({ name, avatarPreview, onAvatarChange }) {
  const fileInputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)

  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  async function handleProfilePictureChange(e) {
    console.log("MY AWS REGION IS:", import.meta.env.VITE_AWS_REGION)
    console.log("MY BUCKET IS:", import.meta.env.VITE_AWS_BUCKET_NAME);
console.log("ACCESS KEY LOADED?", import.meta.env.VITE_AWS_ACCESS_KEY_ID ? "YES" : "NO");
console.log("SECRET KEY LOADED?", import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? "YES" : "NO");
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const uniqueFilename = `${Date.now()}-${file.name}`
      const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME
      
      const fileBuffer = new Uint8Array(await file.arrayBuffer());
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFilename,
        Body: fileBuffer,
        ContentType: file.type,
      })

      await s3Client.send(command)

      // Construct public URL manually
      const region = import.meta.env.VITE_AWS_REGION
      const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueFilename}`

      onAvatarChange(publicUrl)
    } catch (error) {
      console.error('Error uploading image to S3:', error)
      alert('Failed to upload image. Please check your AWS credentials and CORS settings.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="mb-6 flex flex-col items-center gap-2">
      {/* Avatar circle */}
      {/* Avatar circle */}
      {/* Avatar circle */}
      <button
        type="button"
        id="avatar-picker-button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`group relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-white shadow-lg focus:outline-none focus-visible:ring-emerald-400 transition-transform duration-200 ${isUploading ? 'opacity-70 cursor-wait' : 'hover:scale-105'}`}
        aria-label="Change profile photo"
      >
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Profile preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-700 to-emerald-600">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
        )}

        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
            <svg className="animate-spin-smooth h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        )}

        {/* Camera overlay on hover */}
        {!isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span className="mt-1 text-[10px] font-semibold text-white">Change</span>
          </div>
        )}
      </button>

      <p className="text-xs text-slate-400">Click to change photo</p>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePictureChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        disabled={isUploading}
      />
    </div>
  )
}

// ─── Locked university field ───────────────────────────────────────────────

function LockedField({ label, value, id }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          readOnly
          disabled
          className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm font-medium text-slate-500"
        />
        {/* Lock icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
      </div>
    </div>
  )
}

// ─── Interest chip ─────────────────────────────────────────────────────────

function InterestChip({ id, label, selected, onToggle }) {
  return (
    <button
      type="button"
      id={`chip-${id}`}
      onClick={() => onToggle(id)}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
        selected
          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {selected && (
        <svg viewBox="0 0 12 12" fill="currentColor" className="h-3 w-3 shrink-0 text-emerald-500" aria-hidden="true">
          <path d="M10.28 2.28a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 0 1 1.06-1.06L4.5 7.19l4.72-4.91a.75.75 0 0 1 1.06 0z" />
        </svg>
      )}
      {label}
    </button>
  )
}

// ─── OnboardingScreen ──────────────────────────────────────────────────────

/**
 * OnboardingScreen — shown after OTP verification for first-time profile setup.
 *
 * Props:
 *   user       { id, name, role, group } — from the auth backend
 *   onComplete (selectedInterests, avatarPreview) — called when setup is done
 */
export default function OnboardingScreen({ user, onComplete }) {
  const [avatarPreview, setAvatarPreview]   = useState(null)
  const [selectedInterests, setSelectedInterests] = useState(new Set())

  const toggleInterest = useCallback((id) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const handleComplete = () => {
    // API-ready stub — replace body with your profile save call
    const payload = {
      userId:    user.id,
      interests: [...selectedInterests],
      avatarPreview, // will be a cloud URL once upload is wired
    }
    console.log('[Onboarding] Profile payload:', payload)
    onComplete(payload)
  }

  const noneSelected = selectedInterests.size === 0

  return (
    <main
      id="onboarding-page"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-navy-950 via-navy-800 to-navy-700 px-4 py-12"
    >
      {/* Background blobs — matching LoginPage */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-navy-700/30 blur-3xl" />

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

      {/* ── Card ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="onboarding-heading"
        className="animate-fade-in-up relative z-10 w-full max-w-lg"
      >
        <div className="overflow-hidden rounded-2xl bg-white/[0.97] shadow-2xl ring-1 ring-white/20 backdrop-blur-sm">

          {/* Emerald accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" />

          <div className="px-8 pb-8 pt-8">

            {/* ── Step indicator ───────────────────────────────── */}
            <StepIndicator current={2} />

            {/* ── Page title ───────────────────────────────────── */}
            <div className="mb-6 text-center">
              <h1
                id="onboarding-heading"
                className="text-2xl font-bold tracking-tight text-navy-900"
              >
                Complete Your Profile
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Review your university details and personalise your experience.
              </p>
            </div>

            {/* ── Avatar ───────────────────────────────────────── */}
            <AvatarPicker
              name={user.name}
              avatarPreview={avatarPreview}
              onAvatarChange={setAvatarPreview}
            />

            {/* ── Locked university fields ──────────────────────── */}
            <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Synced from University Records
              </p>

              <div className="space-y-3">
                <LockedField id="field-name"  label="Full Name"      value={user.name}  />
                <LockedField id="field-group" label="Academic Group"  value={user.group} />
                <LockedField id="field-role"  label="Role"            value={user.role}  />
              </div>

              <p className="mt-3 text-[11px] text-slate-400">
                These details are managed by your institution. Contact your admin to update them.
              </p>
            </div>

            {/* ── Interest chips ────────────────────────────────── */}
            <div className="mb-6">
              <h2 className="mb-1 text-sm font-semibold text-slate-700">
                Customize Your Feed
              </h2>
              <p className="mb-3 text-xs text-slate-400">
                Select topics you care about — we'll surface relevant content for you.
              </p>

              <div className="flex flex-wrap gap-2" role="group" aria-label="Interest tags">
                {INTERESTS.map((interest) => (
                  <InterestChip
                    key={interest.id}
                    id={interest.id}
                    label={interest.label}
                    selected={selectedInterests.has(interest.id)}
                    onToggle={toggleInterest}
                  />
                ))}
              </div>

              {noneSelected && (
                <p className="mt-2 text-xs text-amber-500">
                  Select at least one interest to continue.
                </p>
              )}
            </div>

            {/* ── Complete Setup button ─────────────────────────── */}
            <button
              id="complete-setup-button"
              type="button"
              onClick={handleComplete}
              disabled={noneSelected}
              title={noneSelected ? 'Please select at least one interest' : undefined}
              className="btn-signin w-full rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Setup →
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-slate-500/70">
          You can update your interests anytime from your profile settings.
        </p>
      </section>
    </main>
  )
}
