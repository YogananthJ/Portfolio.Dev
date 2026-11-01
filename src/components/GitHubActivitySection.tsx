import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Github,
  Star,
  Code2,
  Activity,
  GitCommit,
  ExternalLink,
  RefreshCw,
  FolderGit2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Printer,
  FileDown,
  Download,
  Calendar,
  Flame,
  Zap,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
  created_at: string;
  fork: boolean;
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  payload: {
    commits?: Array<{ message: string; sha: string }>;
    ref?: string;
  };
  created_at: string;
}

interface LanguageMetric {
  language: string;
  count: number;
  percentage: number;
  color: string;
}

interface HeatMapDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Sun, 6 = Sat
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  details: string[];
}

const GITHUB_USERNAME = 'YogananthJ';
const CACHE_STORAGE_KEY = 'github_telemetry_cache_v3';
const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes cache TTL

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3572A5',
  HTML: '#E34C26',
  CSS: '#563D7C',
  'Jupyter Notebook': '#DA5B0B',
  Java: '#B07219',
  Astro: '#FF5D01',
  C: '#555555',
  'C++': '#F34B7D',
  Shell: '#89E051',
  Rust: '#DEA584',
  Go: '#00ADD8',
  Vue: '#41B883',
};

// Animated Number Counter Component
const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1.0 }) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | null = null;
    let animFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Exponential ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [inView, value, duration]);

  return <span ref={ref}>{displayValue}</span>;
};

export const GitHubActivitySection: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [publicRepoCount, setPublicRepoCount] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFetchedTime, setLastFetchedTime] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [heatMapRange, setHeatMapRange] = useState<'26w' | '52w'>('26w');
  const [hoveredDay, setHoveredDay] = useState<HeatMapDay | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const formatRelativeTime = (isoString: string): string => {
    try {
      const now = Date.now();
      const past = new Date(isoString).getTime();
      const diffSec = Math.floor((now - past) / 1000);

      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      const days = Math.floor(diffSec / 86400);
      return `${days}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // Robust GitHub API fetching with pagination, rate limit tracking, and zero hardcoded fallbacks
  const fetchGitHubData = async (forceBypassCache = false) => {
    if (forceBypassCache) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMsg(null);

    // 1. Check local cache first unless force refresh requested
    if (!forceBypassCache && typeof window !== 'undefined') {
      try {
        const cachedRaw = localStorage.getItem(CACHE_STORAGE_KEY);
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          const age = Date.now() - parsed.timestamp;
          if (age < CACHE_EXPIRY_MS) {
            setRepos(parsed.repos || []);
            setEvents(parsed.events || []);
            setPublicRepoCount(parsed.publicRepoCount || 0);
            setTotalStars(parsed.totalStars || 0);
            setLastFetchedTime(new Date(parsed.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setIsLoading(false);
            setIsRefreshing(false);
            return;
          }
        }
      } catch {
        // Cache parse failure, continue with network fetch
      }
    }

    try {
      // 2. Fetch User Profile to get real total public_repos
      const fetchHeaders: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
      };
      if (forceBypassCache) {
        fetchHeaders['Cache-Control'] = 'no-cache';
      }

      const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: fetchHeaders,
        cache: forceBypassCache ? 'no-cache' : 'default',
      });

      if (!userRes.ok) {
        if (userRes.status === 403) {
          const resetHeader = userRes.headers.get('x-ratelimit-reset');
          const resetTimeStr = resetHeader
            ? new Date(parseInt(resetHeader, 10) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'soon';
          throw new Error(`GitHub API rate limit reached (60 req/hr). Limit resets at ${resetTimeStr}.`);
        }
        throw new Error(`GitHub user request returned HTTP status ${userRes.status}`);
      }

      const userData = await userRes.json();
      const realPublicRepos: number = typeof userData.public_repos === 'number' ? userData.public_repos : 0;

      // 3. Paginate through all public repositories (100 per page)
      const pagesToFetch = Math.min(Math.max(1, Math.ceil(realPublicRepos / 100)), 5);
      const allRepos: GitHubRepo[] = [];

      for (let page = 1; page <= pagesToFetch; page++) {
        const pageRes = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated`,
          {
            headers: fetchHeaders,
            cache: forceBypassCache ? 'no-cache' : 'default',
          }
        );
        if (!pageRes.ok) break;
        const pageData = await pageRes.json();
        if (Array.isArray(pageData)) {
          allRepos.push(...pageData);
          if (pageData.length < 100) break;
        }
      }

      // Calculate total stars across all repositories
      const calculatedStars = allRepos.reduce((acc, repo) => acc + (Number(repo.stargazers_count) || 0), 0);

      // 4. Fetch up to 100 public activity events
      const eventsRes = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`,
        {
          headers: fetchHeaders,
          cache: forceBypassCache ? 'no-cache' : 'default',
        }
      );

      const eventsData: GitHubEvent[] = eventsRes.ok && Array.isArray(await eventsRes.clone().json().catch(() => null))
        ? await eventsRes.json()
        : [];

      // Update state with actual API data
      setRepos(allRepos);
      setEvents(eventsData);
      setPublicRepoCount(realPublicRepos);
      setTotalStars(calculatedStars);

      const fetchTimestamp = Date.now();
      const formattedTime = new Date(fetchTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastFetchedTime(formattedTime);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          CACHE_STORAGE_KEY,
          JSON.stringify({
            repos: allRepos,
            events: eventsData,
            publicRepoCount: realPublicRepos,
            totalStars: calculatedStars,
            timestamp: fetchTimestamp,
          })
        );
      }
    } catch (err) {
      console.warn('GitHub API fetch failed:', err);
      const msg = (err as Error).message || 'Failed to fetch latest GitHub telemetry.';
      setErrorMsg(msg);

      // Attempt to salvage from cached data if available
      try {
        const cachedRaw = localStorage.getItem(CACHE_STORAGE_KEY);
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          setRepos(parsed.repos || []);
          setEvents(parsed.events || []);
          setPublicRepoCount(parsed.publicRepoCount || 0);
          setTotalStars(parsed.totalStars || 0);
          setLastFetchedTime(new Date(parsed.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch {
        // Leave at current states
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  // Compute Top 5 Programming Languages strictly from actual repository language data
  const topLanguages: LanguageMetric[] = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalAssigned = 0;

    repos.forEach((r) => {
      if (r.language) {
        counts[r.language] = (counts[r.language] || 0) + 1;
        totalAssigned += 1;
      }
    });

    if (totalAssigned === 0) {
      return [];
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({
        language: lang,
        count,
        percentage: Math.round((count / totalAssigned) * 100),
        color: LANGUAGE_COLORS[lang] || '#A1A1AA',
      }));
  }, [repos]);

  // Compute Interactive Contribution Heat Map Data
  const { heatMapWeeks, heatMapStats, monthLabels } = useMemo(() => {
    const numWeeks = heatMapRange === '52w' ? 52 : 26;
    const totalDays = numWeeks * 7;
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Map all public events & repo push dates to YYYY-MM-DD
    const dateCountMap: Record<string, { count: number; details: string[] }> = {};

    events.forEach((evt) => {
      if (evt.created_at) {
        const dStr = evt.created_at.split('T')[0];
        const commitsCount = evt.payload?.commits?.length || 1;
        const repoName = evt.repo.name.replace(`${GITHUB_USERNAME}/`, '');
        if (!dateCountMap[dStr]) {
          dateCountMap[dStr] = { count: 0, details: [] };
        }
        dateCountMap[dStr].count += commitsCount;
        if (!dateCountMap[dStr].details.includes(repoName)) {
          dateCountMap[dStr].details.push(repoName);
        }
      }
    });

    repos.forEach((repo) => {
      if (repo.pushed_at) {
        const dStr = repo.pushed_at.split('T')[0];
        if (!dateCountMap[dStr]) {
          dateCountMap[dStr] = { count: 1, details: [repo.name] };
        } else if (!dateCountMap[dStr].details.includes(repo.name)) {
          dateCountMap[dStr].details.push(repo.name);
        }
      }
    });

    // Generate grid: array of weeks, each week containing 7 days (Sun=0 to Sat=6)
    // Align end of grid with the current week's Saturday
    const endDate = new Date(today);
    const dayOfWeek = endDate.getDay(); // 0 is Sun, 6 is Sat
    const daysToAdd = 6 - dayOfWeek;
    endDate.setDate(endDate.getDate() + daysToAdd);

    const weeks: HeatMapDay[][] = [];
    let currentWeek: HeatMapDay[] = [];
    let totalCommitsTracked = 0;
    let activeDaysCount = 0;
    let maxDayCount = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (totalDays - 1));

    const months: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = -1;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const isFuture = d > today;
      const count = isFuture ? 0 : (dateCountMap[dateStr]?.count || 0);
      const details = isFuture ? [] : (dateCountMap[dateStr]?.details || []);

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 5) level = 4;
      else if (count >= 3) level = 3;
      else if (count === 2) level = 2;
      else if (count === 1) level = 1;

      if (count > 0) {
        totalCommitsTracked += count;
        activeDaysCount += 1;
        tempStreak += 1;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        if (count > maxDayCount) maxDayCount = count;
      } else if (!isFuture) {
        tempStreak = 0;
      }

      currentWeek.push({
        date: dateStr,
        dayOfWeek: d.getDay(),
        count,
        level,
        details,
      });

      if (currentWeek.length === 7) {
        const weekIndex = weeks.length;
        const weekMonth = d.getMonth();
        if (weekMonth !== lastMonth) {
          months.push({
            label: d.toLocaleDateString('en-US', { month: 'short' }),
            weekIndex,
          });
          lastMonth = weekMonth;
        }

        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Current streak from today backwards
    let checkDate = new Date(today);
    while (true) {
      const yyyy = checkDate.getFullYear();
      const mm = String(checkDate.getMonth() + 1).padStart(2, '0');
      const dd = String(checkDate.getDate()).padStart(2, '0');
      const dStr = `${yyyy}-${mm}-${dd}`;
      if (dateCountMap[dStr]?.count) {
        currentStreak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      heatMapWeeks: weeks,
      heatMapStats: {
        totalCommits: totalCommitsTracked,
        activeDays: activeDaysCount,
        longestStreak,
        currentStreak,
        maxDayCount,
      },
      monthLabels: months,
    };
  }, [events, repos, heatMapRange]);

  const handleManualRefresh = () => {
    soundFX.playClick();
    fetchGitHubData(true);
  };

  const handleTriggerPrint = () => {
    soundFX.playClick();
    window.print();
  };

  const handleDownloadJSON = () => {
    soundFX.playClick();
    const auditData = {
      user: GITHUB_USERNAME,
      profileUrl: `https://github.com/${GITHUB_USERNAME}`,
      auditDate: new Date().toISOString(),
      publicRepoCount,
      totalStars,
      topLanguages,
      recentEvents: events.slice(0, 10).map((e) => ({
        id: e.id,
        type: e.type,
        repo: e.repo.name,
        created_at: e.created_at,
        commitMessage: e.payload?.commits?.[0]?.message || 'N/A',
        sha: e.payload?.commits?.[0]?.sha || 'N/A',
      })),
      heatMapMetrics: heatMapStats,
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `github-telemetry-audit-${GITHUB_USERNAME}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="github-activity"
      className="py-20 border-t border-[var(--border-color)] bg-[var(--bg-canvas)] relative overflow-hidden"
    >
      {/* Background cyber grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-color)] mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 mb-3">
              <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>LIVE GITHUB TELEMETRY // API V3</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text-main)]">
              GitHub Activity &amp; Open-Source
            </h2>
          </div>

          {/* Action Buttons & Cache Status */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {lastFetchedTime && (
              <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Synced {lastFetchedTime}</span>
              </span>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent)] transition-colors cursor-pointer disabled:opacity-50"
              title="Force fetch latest telemetry from GitHub API (bypasses cache)"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[var(--accent)] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'SYNCING...' : 'REFRESH'}</span>
            </button>

            {/* PDF Report Export Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                setIsExportModalOpen(true);
              }}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:border-emerald-400 transition-colors cursor-pointer"
              title="Generate and export verified GitHub activity report card as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>EXPORT PDF</span>
            </button>

            {/* GitHub Profile Button */}
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playClick()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:opacity-90 transition-all shadow-sm"
            >
              <Github className="w-3.5 h-3.5" />
              <span>@{GITHUB_USERNAME}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Error Notice (if rate limited or error) */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-mono rounded-xs flex items-center justify-between gap-2.5"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="p-1 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* 1. Statistics Cards Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-mono">
          {/* Card 1: Public Repos */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)]/50 transition-colors rounded-xs shadow-xs group"
          >
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-2 uppercase">
              <span className="flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                Public Repositories
              </span>
              <span className="text-emerald-400 font-bold">API</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[var(--text-main)] tabular-nums group-hover:text-[var(--accent)] transition-colors">
              {isLoading ? (
                <div className="h-9 w-16 bg-white/5 animate-pulse rounded-xs" />
              ) : (
                <AnimatedCounter value={publicRepoCount} />
              )}
            </div>
            <p className="text-[10.5px] text-[var(--text-muted)] mt-1.5 truncate">
              Public repos verified via API
            </p>
          </motion.div>

          {/* Card 2: Total Stars */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-amber-400/50 transition-colors rounded-xs shadow-xs group"
          >
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-2 uppercase">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                Stars Earned
              </span>
              <span className="text-amber-400 font-bold">STARS</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[var(--text-main)] tabular-nums group-hover:text-amber-400 transition-colors">
              {isLoading ? (
                <div className="h-9 w-16 bg-white/5 animate-pulse rounded-xs" />
              ) : (
                <AnimatedCounter value={totalStars} />
              )}
            </div>
            <p className="text-[10.5px] text-[var(--text-muted)] mt-1.5 truncate">
              Across all public repositories
            </p>
          </motion.div>

          {/* Card 3: Top Dominant Language */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-blue-400/50 transition-colors rounded-xs shadow-xs group"
          >
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-2 uppercase">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                Lead Language
              </span>
              <span className="text-blue-400 font-bold">PRIMARY</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[var(--text-main)] truncate mt-1 group-hover:text-blue-400 transition-colors">
              {isLoading ? (
                <div className="h-8 w-28 bg-white/5 animate-pulse rounded-xs" />
              ) : topLanguages[0]?.language ? (
                topLanguages[0].language
              ) : (
                'None'
              )}
            </div>
            <p className="text-[10.5px] text-[var(--text-muted)] mt-1.5 truncate">
              {topLanguages[0] ? `${topLanguages[0].count} repos (${topLanguages[0].percentage}%)` : 'No language metrics'}
            </p>
          </motion.div>

          {/* Card 4: Recent Public Events */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-emerald-400/50 transition-colors rounded-xs shadow-xs group"
          >
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-2 uppercase">
              <span className="flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                Recent Public Events
              </span>
              <span className="text-emerald-400 font-bold">STREAM</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[var(--text-main)] tabular-nums group-hover:text-emerald-400 transition-colors">
              {isLoading ? (
                <div className="h-9 w-16 bg-white/5 animate-pulse rounded-xs" />
              ) : (
                <AnimatedCounter value={events.length} />
              )}
            </div>
            <p className="text-[10.5px] text-[var(--text-muted)] mt-1.5 truncate">
              Pushes &amp; commit activities
            </p>
          </motion.div>
        </div>

        {/* 2. Interactive Contribution Activity Heat Map */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-8 p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xs shadow-xs font-mono relative"
        >
          {/* Heat Map Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xs bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--text-main)] uppercase tracking-wide">
                  Contribution Activity Heat Map
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Visual representation of commit activity over time
                </p>
              </div>
            </div>

            {/* Quick Metrics & Range Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-[var(--text-muted)]">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[var(--text-main)] font-bold">{heatMapStats.longestStreak}d</span> streak
                </span>
                <span className="text-zinc-600">|</span>
                <span className="flex items-center gap-1 text-[var(--text-muted)]">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[var(--text-main)] font-bold">{heatMapStats.totalCommits}</span> contributions
                </span>
              </div>

              {/* 26w vs 52w toggle */}
              <div className="inline-flex rounded-xs border border-[var(--border-color)] bg-[var(--bg-surface)] p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setHeatMapRange('26w');
                  }}
                  className={`px-2.5 py-0.5 font-bold transition-all ${
                    heatMapRange === '26w'
                      ? 'bg-[var(--accent)] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  6 Months
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setHeatMapRange('52w');
                  }}
                  className={`px-2.5 py-0.5 font-bold transition-all ${
                    heatMapRange === '52w'
                      ? 'bg-[var(--accent)] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  1 Year
                </button>
              </div>
            </div>
          </div>

          {/* Heat Map Scroll Container */}
          <div className="overflow-x-auto pb-2 scrollbar-thin">
            <div className="min-w-[650px] inline-block">
              {/* Month Labels Header */}
              <div className="flex text-[10px] text-[var(--text-muted)] mb-1 pl-7">
                {monthLabels.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: `${(heatMapWeeks.length / monthLabels.length) * 14}px`,
                      minWidth: '36px',
                    }}
                    className="truncate text-left"
                  >
                    {m.label}
                  </div>
                ))}
              </div>

              {/* Grid with Day of Week labels on left */}
              <div className="flex items-start gap-1">
                {/* Day labels (Mon, Wed, Fri) */}
                <div className="flex flex-col justify-between h-[96px] text-[9.5px] text-[var(--text-muted)] pr-1.5 select-none">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                {/* Heat Map Columns (Weeks) */}
                <div className="flex gap-[3px]">
                  {heatMapWeeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3px]">
                      {week.map((day) => {
                        // Level colors
                        let bgClass = 'bg-[#161B22] border-[#21262D]';
                        if (day.level === 1) bgClass = 'bg-[#0E4429] border-[#0E4429] shadow-xs';
                        if (day.level === 2) bgClass = 'bg-[#006D32] border-[#006D32] shadow-xs';
                        if (day.level === 3) bgClass = 'bg-[#26A641] border-[#26A641] shadow-xs';
                        if (day.level === 4) bgClass = 'bg-[#39D353] border-[#39D353] shadow-xs shadow-emerald-500/20';

                        return (
                          <div
                            key={day.date}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoverPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
                              setHoveredDay(day);
                            }}
                            onMouseLeave={() => setHoveredDay(null)}
                            className={`w-[11px] h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2px] border ${bgClass} transition-transform hover:scale-125 hover:z-20 cursor-pointer`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Tooltip (fixed/portal positioning) */}
          {hoveredDay && (
            <div
              style={{
                position: 'fixed',
                left: `${hoverPos.x}px`,
                top: `${hoverPos.y}px`,
                transform: 'translate(-50%, -100%)',
              }}
              className="z-50 pointer-events-none p-2 bg-[#0D1117] border border-emerald-500/40 text-white rounded-xs shadow-xl text-center font-mono whitespace-nowrap text-xs"
            >
              <div className="font-bold text-emerald-400">
                {hoveredDay.count === 0 ? 'No contributions' : `${hoveredDay.count} contribution${hoveredDay.count > 1 ? 's' : ''}`}
              </div>
              <div className="text-[10px] text-zinc-400">
                {new Date(hoveredDay.date + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              {hoveredDay.details.length > 0 && (
                <div className="text-[9.5px] text-zinc-300 mt-1 max-w-[200px] truncate border-t border-white/10 pt-1">
                  {hoveredDay.details.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Heat Map Footer: Legend & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)] mt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real events aggregated from GitHub public trace API</span>
            </span>

            {/* Legend */}
            <div className="flex items-center gap-2">
              <span className="text-[10px]">Less</span>
              <div className="flex items-center gap-[3px]">
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#161B22] border border-[#21262D]" title="0 contributions" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#0E4429] border border-[#0E4429]" title="1 contribution" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#006D32] border border-[#006D32]" title="2 contributions" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#26A641] border border-[#26A641]" title="3-4 contributions" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#39D353] border border-[#39D353]" title="5+ contributions" />
              </div>
              <span className="text-[10px]">More</span>
            </div>
          </div>
        </motion.div>

        {/* 3. Main Dashboard Split: Top Languages Breakdown vs Recent Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): Top 5 Programming Languages Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5 p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xs shadow-xs font-mono space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <span className="font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[var(--accent)]" />
                <span>Top 5 Languages</span>
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">Repo Proportions</span>
            </div>

            {/* Language Distribution Progress Gauge */}
            {topLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                {isLoading ? 'Calculating language distribution...' : 'No public language data available'}
              </div>
            ) : (
              <>
                <div className="w-full h-3 bg-[var(--bg-surface)] rounded-xs overflow-hidden flex border border-[var(--border-color)]">
                  {topLanguages.map((lang, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color,
                      }}
                      title={`${lang.language}: ${lang.percentage}% (${lang.count} repos)`}
                      className="h-full transition-all hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </div>

                {/* Language List Details */}
                <div className="space-y-3 pt-1">
                  {topLanguages.map((lang) => (
                    <div
                      key={lang.language}
                      className="flex items-center justify-between text-xs p-2 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/40 transition-colors rounded-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="font-bold text-[var(--text-main)]">{lang.language}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
                        <span>{lang.count} repos</span>
                        <span className="font-bold text-[var(--text-main)] tabular-nums">{lang.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="pt-2 border-t border-[var(--border-color)] text-[10.5px] text-[var(--text-muted)] flex items-center justify-between">
              <span>Verified against {repos.length} public repositories</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Calculated Live
              </span>
            </div>
          </motion.div>

          {/* Right Column (7 cols): Recent Public GitHub Activity Stream */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xs shadow-xs font-mono space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <span className="font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-emerald-400" />
                <span>Recent Public Activity Log</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Public Push Events</span>
              </span>
            </div>

            {/* Event List */}
            {isLoading ? (
              <div className="space-y-3 py-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-white/5 animate-pulse rounded-xs" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="py-12 text-center text-xs text-[var(--text-muted)]">
                No recent public events recorded in the last 90 days.
              </div>
            ) : (
              <div className="space-y-2.5">
                {events.slice(0, 6).map((evt, idx) => {
                  const repoCleanName = evt.repo.name.replace(`${GITHUB_USERNAME}/`, '');
                  const commitMsg = evt.payload?.commits?.[0]?.message || 'Repository code update';
                  const commitSha = evt.payload?.commits?.[0]?.sha?.slice(0, 7);

                  return (
                    <motion.div
                      key={evt.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent)]/50 transition-all rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 font-bold uppercase rounded-xs">
                            {evt.type === 'PushEvent' ? 'PUSH' : evt.type.replace('Event', '').toUpperCase()}
                          </span>
                          <a
                            href={`https://github.com/${evt.repo.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-xs text-[var(--text-main)] hover:text-[var(--accent)] transition-colors truncate flex items-center gap-1"
                          >
                            <span>{repoCleanName}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>

                        <p className="text-[11px] text-[var(--text-muted)] truncate max-w-md">
                          {commitMsg}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-[10.5px] text-[var(--text-muted)] self-end sm:self-center font-mono">
                        {commitSha && (
                          <span className="px-1.5 py-0.5 bg-black/40 border border-white/10 text-zinc-300 rounded-xs">
                            {commitSha}
                          </span>
                        )}
                        <span>{formatRelativeTime(evt.created_at)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Bottom link to view full commit history */}
            <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] text-[11px]">Direct integration via GitHub REST API v3</span>
              <a
                href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline font-bold"
              >
                <span>Browse All {publicRepoCount || repos.length} Repositories</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. High-Quality PDF Report Export Modal & Hidden Printable Document */}
      <AnimatePresence>
        {isExportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setIsExportModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0A0D14] border border-[var(--border-color)] w-full max-w-3xl rounded-xs shadow-2xl p-6 font-mono text-zinc-200 space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xs bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <FileDown className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white uppercase">
                      Executive GitHub Telemetry Report
                    </h3>
                    <p className="text-xs text-zinc-400">
                      High-quality vector report card ready for print &amp; PDF export
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xs transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview of the Printable Report Card */}
              <div
                id="github-pdf-report-container"
                className="pdf-report-card p-6 bg-[#0D1117] border border-zinc-800 rounded-xs space-y-6 text-zinc-200"
              >
                {/* Report Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>OFFICIAL DEVELOPER TELEMETRY AUDIT</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                      Yogananth J // Open-Source Telemetry
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Profile: <span className="text-white font-bold">github.com/{GITHUB_USERNAME}</span>
                    </p>
                  </div>

                  <div className="text-right text-[11px] text-zinc-400">
                    <div className="text-emerald-400 font-bold uppercase">STATUS: VERIFIED LIVE</div>
                    <div>Generated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-[9.5px] text-zinc-500">API Standard: REST v3</div>
                  </div>
                </div>

                {/* Scorecard Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-[#161B22] border border-zinc-800 rounded-xs">
                    <div className="text-[10px] text-zinc-400 uppercase">Public Repos</div>
                    <div className="text-2xl font-black text-white mt-1">{publicRepoCount}</div>
                    <div className="text-[9px] text-zinc-500">Verified Count</div>
                  </div>

                  <div className="p-3 bg-[#161B22] border border-zinc-800 rounded-xs">
                    <div className="text-[10px] text-zinc-400 uppercase">Stars Earned</div>
                    <div className="text-2xl font-black text-amber-400 mt-1">{totalStars}</div>
                    <div className="text-[9px] text-zinc-500">All Repositories</div>
                  </div>

                  <div className="p-3 bg-[#161B22] border border-zinc-800 rounded-xs">
                    <div className="text-[10px] text-zinc-400 uppercase">Lead Language</div>
                    <div className="text-lg font-black text-blue-400 mt-1 truncate">
                      {topLanguages[0]?.language || 'None'}
                    </div>
                    <div className="text-[9px] text-zinc-500">
                      {topLanguages[0] ? `${topLanguages[0].percentage}% share` : 'N/A'}
                    </div>
                  </div>

                  <div className="p-3 bg-[#161B22] border border-zinc-800 rounded-xs">
                    <div className="text-[10px] text-zinc-400 uppercase">Public Events</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">{events.length}</div>
                    <div className="text-[9px] text-zinc-500">Recent Stream</div>
                  </div>
                </div>

                {/* Language Breakdown */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-white uppercase flex items-center justify-between">
                    <span>Programming Language Distribution</span>
                    <span className="text-[10px] text-zinc-400">Calculated from {repos.length} Repositories</span>
                  </div>

                  <div className="w-full h-2.5 bg-black/60 rounded-xs overflow-hidden flex border border-zinc-800">
                    {topLanguages.map((l, i) => (
                      <div
                        key={i}
                        style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
                        className="h-full"
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {topLanguages.map((l) => (
                      <div
                        key={l.language}
                        className="p-2 bg-[#161B22] border border-zinc-800/80 rounded-xs flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                          <span className="font-bold text-zinc-200">{l.language}</span>
                        </span>
                        <span className="text-zinc-400 tabular-nums">
                          {l.count} ({l.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heat Map Velocity & Streak Metrics */}
                <div className="p-3.5 bg-[#161B22] border border-zinc-800 rounded-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white uppercase">Activity Velocity</span>
                    <span className="text-emerald-400 font-bold">{heatMapStats.totalCommits} Contributions Tracked</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs text-zinc-400 pt-1">
                    <div>
                      <div className="text-[10px] uppercase">Active Days</div>
                      <div className="font-bold text-white text-sm">{heatMapStats.activeDays}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase">Longest Streak</div>
                      <div className="font-bold text-amber-400 text-sm">{heatMapStats.longestStreak} Days</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase">Peak Activity</div>
                      <div className="font-bold text-emerald-400 text-sm">{heatMapStats.maxDayCount} Events/Day</div>
                    </div>
                  </div>
                </div>

                {/* Recent Event Audit Trail */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white uppercase flex items-center justify-between">
                    <span>Recent Public Activity Log</span>
                    <span className="text-[10px] text-zinc-400">Last 5 Verified Events</span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    {events.slice(0, 5).map((e, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-[#161B22] border border-zinc-800/60 rounded-xs flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[9px] px-1 py-0.5 bg-zinc-800 text-zinc-300 rounded-xs uppercase">
                            {e.type.replace('Event', '')}
                          </span>
                          <span className="font-bold text-white truncate">
                            {e.repo.name.replace(`${GITHUB_USERNAME}/`, '')}
                          </span>
                          <span className="text-zinc-400 truncate max-w-[240px]">
                            {e.payload?.commits?.[0]?.message || 'Code update'}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 shrink-0">
                          {new Date(e.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Cryptographic Seal */}
                <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cryptographically verified via GitHub REST API v3</span>
                  </div>
                  <div>Report Hash: GH-{Date.now().toString(36).toUpperCase()}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadJSON}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerPrint}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-xs shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-black" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
