// ─── Full video database ────────────────────────────────────────────────────
//
// `tag` must match an onboarding interest ID exactly:
//   'cloud' | 'design' | 'account' | 'sports' | 'exam' | 'campus'

const ALL_VIDEOS = [
  // ── Cloud Computing ────────────────────────────────────────────────────────
  {
    id: 'cloud-1',
    tag: 'cloud',
    category: 'Cloud Computing',
    categoryColor: 'blue',
    title: 'AWS Architecture Basics: Designing for Scale',
    channel: 'AWS Online Tech Talks',
    thumbnail: 'https://picsum.photos/seed/awscloud/480/270',
    href: 'https://www.youtube.com/results?search_query=AWS+architecture+basics',
  },
  {
    id: 'cloud-2',
    tag: 'cloud',
    category: 'Cloud Computing',
    categoryColor: 'blue',
    title: 'Kubernetes in 10 Minutes: Containers Explained',
    channel: 'TechWorld with Nana',
    thumbnail: 'https://picsum.photos/seed/kubernetes/480/270',
    href: 'https://www.youtube.com/results?search_query=kubernetes+beginners',
  },

  // ── 3D Design ─────────────────────────────────────────────────────────────
  {
    id: 'design-1',
    tag: 'design',
    category: '3D Design',
    categoryColor: 'pink',
    title: 'Blender Beginners: Model Your First 3D Object',
    channel: 'Blender Guru',
    thumbnail: 'https://picsum.photos/seed/blender3d/480/270',
    href: 'https://www.youtube.com/results?search_query=blender+3d+beginners',
  },
  {
    id: 'design-2',
    tag: 'design',
    category: '3D Design',
    categoryColor: 'pink',
    title: 'UI to 3D: Figma Meets Cinema 4D Workflow',
    channel: 'The Futur',
    thumbnail: 'https://picsum.photos/seed/3ddesign/480/270',
    href: 'https://www.youtube.com/results?search_query=figma+3d+workflow',
  },

  // ── Accounting ────────────────────────────────────────────────────────────
  {
    id: 'account-1',
    tag: 'account',
    category: 'Accounting',
    categoryColor: 'amber',
    title: 'Financial Statements Explained in 10 Minutes',
    channel: 'Accounting Stuff',
    thumbnail: 'https://picsum.photos/seed/finance101/480/270',
    href: 'https://www.youtube.com/results?search_query=financial+statements+explained',
  },
  {
    id: 'account-2',
    tag: 'account',
    category: 'Accounting',
    categoryColor: 'amber',
    title: 'GST Filing for Students: Step-by-Step Guide',
    channel: 'CA Rachana Ranade',
    thumbnail: 'https://picsum.photos/seed/gstguide/480/270',
    href: 'https://www.youtube.com/results?search_query=GST+filing+student+guide',
  },

  // ── Sports / Fitness ──────────────────────────────────────────────────────
  {
    id: 'sports-1',
    tag: 'sports',
    category: 'Fitness',
    categoryColor: 'emerald',
    title: 'Optimizing Daily Energy: The Student Routine',
    channel: 'Huberman Lab',
    thumbnail: 'https://picsum.photos/seed/dailyhabits/480/270',
    href: 'https://www.youtube.com/results?search_query=daily+energy+optimization+routine',
  },
  {
    id: 'sports-2',
    tag: 'sports',
    category: 'Fitness',
    categoryColor: 'emerald',
    title: '20-Min Dorm Room Workout — No Equipment Needed',
    channel: 'Athlean-X',
    thumbnail: 'https://picsum.photos/seed/dormworkout/480/270',
    href: 'https://www.youtube.com/results?search_query=dorm+room+workout+no+equipment',
  },

  // ── Exam Prep ─────────────────────────────────────────────────────────────
  {
    id: 'exam-1',
    tag: 'exam',
    category: 'Exam Prep',
    categoryColor: 'violet',
    title: 'Structuring Professional Presentations That Land',
    channel: 'Harvard Business Review',
    thumbnail: 'https://picsum.photos/seed/presentation/480/270',
    href: 'https://www.youtube.com/results?search_query=professional+presentation+structure',
  },
  {
    id: 'exam-2',
    tag: 'exam',
    category: 'Exam Prep',
    categoryColor: 'violet',
    title: 'The Active Recall Method That Doubles Retention',
    channel: 'Ali Abdaal',
    thumbnail: 'https://picsum.photos/seed/studyrecall/480/270',
    href: 'https://www.youtube.com/results?search_query=active+recall+study+method',
  },

  // ── Campus Events ─────────────────────────────────────────────────────────
  {
    id: 'campus-1',
    tag: 'campus',
    category: 'Campus Life',
    categoryColor: 'orange',
    title: 'How to Network at College Events Like a Pro',
    channel: 'Rowena Tsai',
    thumbnail: 'https://picsum.photos/seed/campusnetwork/480/270',
    href: 'https://www.youtube.com/results?search_query=college+networking+events',
  },
  {
    id: 'campus-2',
    tag: 'campus',
    category: 'Campus Life',
    categoryColor: 'orange',
    title: 'Leadership Skills Every Student Should Build',
    channel: 'TEDx Talks',
    thumbnail: 'https://picsum.photos/seed/studentleader/480/270',
    href: 'https://www.youtube.com/results?search_query=leadership+skills+students+TEDx',
  },
]

// ─── Category tag colour map ─────────────────────────────────────────────────

const CATEGORY_STYLE = {
  blue:    'bg-blue-50    text-blue-700    ring-blue-200',
  violet:  'bg-violet-50  text-violet-700  ring-violet-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber:   'bg-amber-50   text-amber-700   ring-amber-200',
  pink:    'bg-pink-50    text-pink-700    ring-pink-200',
  orange:  'bg-orange-50  text-orange-700  ring-orange-200',
}

// ─── Play icon overlay ───────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="h-5 w-5 translate-x-0.5"
        >
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      </div>
    </div>
  )
}

// ─── Single video card ───────────────────────────────────────────────────────

function VideoCard({ video }) {
  return (
    <a
      href={video.href}
      target="_blank"
      rel="noopener noreferrer"
      id={`growth-card-${video.id}`}
      className="group block overflow-hidden rounded-xl bg-[var(--bg-card)] ring-1 ring-[var(--border-subtle)] transition-all duration-200 hover:scale-[1.025] hover:shadow-lg hover:ring-[var(--border-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      aria-label={`Watch: ${video.title} on YouTube`}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] group-hover:brightness-90"
          loading="lazy"
        />
        <PlayIcon />

        {/* Category badge */}
        <span
          className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 backdrop-blur-sm ${CATEGORY_STYLE[video.categoryColor]}`}
        >
          {video.category}
        </span>

        {/* YouTube watermark */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 right-2.5 text-[10px] font-bold tracking-wide text-white/70 drop-shadow"
        >
          ▶ YouTube
        </span>
      </div>

      {/* Meta */}
      <div className="px-3.5 py-3">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--text-primary)] transition-colors duration-300">
          {video.title}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3 shrink-0 text-slate-400"
            aria-hidden="true"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <p className="truncate text-xs text-slate-400">{video.channel}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-auto h-3 w-3 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </div>
      </div>
    </a>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-slate-400"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h4M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-600">No videos yet</p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
        Update your interests in your profile to see
        curated growth videos here!
      </p>
    </div>
  )
}

// ─── GrowthFeed ──────────────────────────────────────────────────────────────

/**
 * GrowthFeed — Curated skill-building video feed.
 *
 * Props:
 *   tags  string[]  — interest IDs from onboarding (e.g. ['cloud', 'sports'])
 *                     Filters ALL_VIDEOS to matching entries only.
 *                     Empty array → shows EmptyState.
 */
export default function GrowthFeed({ tags = [] }) {
  // Filter to videos whose tag appears in the user's selected interests.
  // Preserve insertion order so the most-recently added interest wins.
  const filtered = ALL_VIDEOS.filter((v) => tags.includes(v.tag))

  // Cap at 4 videos to keep the column from growing too tall
  const visible = filtered.slice(0, 4)

  return (
    <div className="rounded-2xl bg-[var(--bg-card)] p-5 shadow-md ring-1 ring-[var(--border-subtle)] transition-colors duration-300">
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] transition-colors duration-300">Curated Growth Feed</h2>
          <p className="mt-0.5 text-xs text-[var(--text-muted)] transition-colors duration-300">Intentional skill-building, daily</p>
        </div>
        {visible.length > 0 && (
          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600 ring-1 ring-violet-200">
            {visible.length} video{visible.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Content — filtered cards or empty state */}
      {visible.length > 0 ? (
        <div className="space-y-3">
          {visible.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Footer note — only shown when there are videos */}
      {visible.length > 0 && (
        <p className="mt-4 text-center text-[10px] text-slate-400">
          Opens in YouTube · Based on your selected interests
        </p>
      )}
    </div>
  )
}
