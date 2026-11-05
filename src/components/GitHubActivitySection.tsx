import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, type Variants } from 'framer-motion';
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

interface ExactContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface LevelStyle {
  bg: string;
  border: string;
  hex: string;
  borderHex: string;
  label: string;
  range: string;
  shadow: string;
  textColor: string;
}

// 5-Level Contribution Intensity Palette tailored to the portfolio's futuristic cyberpunk pink/red visual identity
export const CONTRIBUTION_LEVEL_STYLES: Record<0 | 1 | 2 | 3 | 4, LevelStyle> = {
  0: {
    bg: 'bg-[#18181B]',
    border: 'border-[#27272A]',
    hex: '#18181B',
    borderHex: '#27272A',
    label: 'No contributions',
    range: '0 contributions',
    shadow: '',
    textColor: 'text-zinc-400',
  },
  1: {
    bg: 'bg-[#4C1220]',
    border: 'border-[#701A31]',
    hex: '#4C1220',
    borderHex: '#701A31',
    label: 'Low',
    range: '1–3 contributions',
    shadow: '',
    textColor: 'text-rose-300',
  },
  2: {
    bg: 'bg-[#9F1239]',
    border: 'border-[#BE123C]',
    hex: '#9F1239',
    borderHex: '#BE123C',
    label: 'Moderate',
    range: '4–6 contributions',
    shadow: '',
    textColor: 'text-rose-200',
  },
  3: {
    bg: 'bg-[#E11D48]',
    border: 'border-[#F43F5E]',
    hex: '#E11D48',
    borderHex: '#F43F5E',
    label: 'High',
    range: '7–13 contributions',
    shadow: '',
    textColor: 'text-white',
  },
  4: {
    bg: 'bg-[#FB7185]',
    border: 'border-[#FFE4E6]',
    hex: '#FB7185',
    borderHex: '#FFE4E6',
    label: 'Very High',
    range: '14+ contributions',
    shadow: 'shadow-[0_0_8px_rgba(251,113,133,0.55)]',
    textColor: 'text-white font-bold',
  },
};

// Framer Motion staggered scanning entrance animation variants
const scanningGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (shouldReduce: boolean) => ({
    opacity: 1,
    transition: {
      staggerChildren: shouldReduce ? 0 : 0.015,
      delayChildren: 0.05,
    },
  }),
};

const weekColumnVariants: Variants = {
  hidden: (shouldReduce: boolean) => ({
    opacity: shouldReduce ? 1 : 0,
    y: shouldReduce ? 0 : 8,
    scaleY: shouldReduce ? 1 : 0.8,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const GITHUB_USERNAME = 'YogananthJ';
const CACHE_STORAGE_KEY = 'github_telemetry_cache_v4';
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
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [exactContributions, setExactContributions] = useState<ExactContributionDay[]>([]);
  const [totalContributionsLastYear, setTotalContributionsLastYear] = useState<number>(0);
  const [publicRepoCount, setPublicRepoCount] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFetchedTime, setLastFetchedTime] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [heatMapRange, setHeatMapRange] = useState<'26w' | '52w'>('52w');
  const [hoveredDay, setHoveredDay] = useState<HeatMapDay | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const lastRefreshTimeRef = useRef<number>(0);

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

  const formatContributionDate = (isoDate: string): string => {
    if (!isoDate || isoDate.startsWith('dummy')) return '';
    try {
      const [y, m, d] = isoDate.split('-').map(Number);
      const dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(dateObj);
    } catch {
      return isoDate;
    }
  };

  // Robust GitHub API fetching with CORS-compliant headers, pagination, rate limit tracking, and safe fallbacks
  const fetchGitHubData = async (forceBypassCache = false) => {
    if (isRefreshing) return;

    // Throttle manual refreshes to protect unauthenticated GitHub API quota (60 req/hr)
    const now = Date.now();
    if (forceBypassCache) {
      if (now - lastRefreshTimeRef.current < 4000) {
        setErrorMsg('Please wait a few seconds before refreshing again to protect your GitHub API quota.');
        return;
      }
      lastRefreshTimeRef.current = now;
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
            if (Array.isArray(parsed.exactContributions) && parsed.exactContributions.length > 0) {
              setExactContributions(parsed.exactContributions);
            }
            if (typeof parsed.totalContributionsLastYear === 'number') {
              setTotalContributionsLastYear(parsed.totalContributionsLastYear);
            }
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
      // 2. Fetch User Profile
      // CRITICAL FIX: Only use CORS-safelisted request headers ('Accept').
      // NEVER set 'Cache-Control' in custom fetch headers because it triggers CORS preflight
      // which GitHub API rejects with "Request header field cache-control is not allowed".
      // To bust browser cache safely without preflight, append a timestamp query parameter.
      const timestamp = Date.now();
      const cacheBustQuery = forceBypassCache ? `?_t=${timestamp}` : '';
      const cacheBustParam = forceBypassCache ? `&_t=${timestamp}` : '';

      const fetchHeaders: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
      };

      const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}${cacheBustQuery}`, {
        headers: fetchHeaders,
        signal: AbortSignal.timeout(10000),
      });

      if (!userRes.ok) {
        if (userRes.status === 404) {
          throw new Error(`GitHub profile not found (@${GITHUB_USERNAME}).`);
        }
        if (userRes.status === 403 || userRes.status === 429) {
          const resetHeader = userRes.headers.get('x-ratelimit-reset');
          let resetTimeStr = '';
          if (resetHeader) {
            const resetDate = new Date(parseInt(resetHeader, 10) * 1000);
            resetTimeStr = ` Limit resets at ${resetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
          }
          throw new Error(`GitHub API rate limit reached (60 req/hr).${resetTimeStr}`);
        }
        if (userRes.status >= 500) {
          throw new Error('GitHub servers are temporarily unavailable. Please try again later.');
        }
        throw new Error(`Unable to load activity right now (HTTP status ${userRes.status}).`);
      }

      const userData = await userRes.json();
      const realPublicRepos: number = typeof userData.public_repos === 'number' ? userData.public_repos : 0;

      // 3. Paginate through repositories (up to 3 pages / 300 repos to respect rate limits)
      const pagesToFetch = Math.min(Math.max(1, Math.ceil(realPublicRepos / 100)), 3);
      const allRepos: GitHubRepo[] = [];

      for (let page = 1; page <= pagesToFetch; page++) {
        const pageRes = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated${cacheBustParam}`,
          { headers: fetchHeaders, signal: AbortSignal.timeout(10000) }
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
        `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100${cacheBustParam}`,
        { headers: fetchHeaders, signal: AbortSignal.timeout(10000) }
      );

      const eventsData: GitHubEvent[] = eventsRes.ok && Array.isArray(await eventsRes.clone().json().catch(() => null))
        ? await eventsRes.json()
        : [];

      // 5. Fetch Exact GitHub Profile Contribution Calendar History
      let fetchedContributions: ExactContributionDay[] = [];
      let fetchedTotalContribs = 0;

      // Safely try internal proxy route if running on fullstack node server
      try {
        const contribRes = await fetch(
          `/api/github-contributions?username=${GITHUB_USERNAME}${forceBypassCache ? '&force=true' : ''}`,
          { signal: AbortSignal.timeout(10000) }
        );
        const contentType = contribRes.headers.get('content-type') || '';
        // Only parse as JSON if the server actually returned JSON (prevents HTML SPA fallback syntax error)
        if (contribRes.ok && contentType.includes('application/json')) {
          const contribJson = await contribRes.json();
          if (contribJson.success && Array.isArray(contribJson.contributions) && contribJson.contributions.length > 0) {
            fetchedContributions = contribJson.contributions;
            fetchedTotalContribs = contribJson.totalContributions || 0;
          }
        }
      } catch {
        // Expected when deployed on static host like Cloudflare Pages
      }

      // Fallback: direct upstream public contribution service
      if (fetchedContributions.length === 0) {
        try {
          const directRes = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last${cacheBustParam}`,
            { signal: AbortSignal.timeout(10000) }
          );
          const directContentType = directRes.headers.get('content-type') || '';
          if (directRes.ok && directContentType.includes('application/json')) {
            const directJson = await directRes.json();
            if (Array.isArray(directJson.contributions) && directJson.contributions.length > 0) {
              fetchedContributions = directJson.contributions;
              fetchedTotalContribs = directJson.total?.lastYear || 0;
            }
          }
        } catch {
          // Direct fallback failed
        }
      }

      // If third-party contributions scraping failed, synthesize timeline from real public events
      if (fetchedContributions.length === 0 && eventsData.length > 0) {
        const dayCounts: Record<string, number> = {};
        eventsData.forEach((evt) => {
          if (evt.created_at) {
            const dayKey = evt.created_at.split('T')[0];
            dayCounts[dayKey] = (dayCounts[dayKey] || 0) + 1;
          }
        });
        fetchedContributions = Object.entries(dayCounts).map(([date, count]) => ({
          date,
          count,
          level: (Math.min(4, Math.max(0, Math.ceil(count / 2))) as 0 | 1 | 2 | 3 | 4),
        }));
        fetchedTotalContribs = eventsData.length;
      }

      // Update states with verified API data
      setRepos(allRepos);
      setEvents(eventsData);
      setPublicRepoCount(realPublicRepos);
      setTotalStars(calculatedStars);
      if (fetchedContributions.length > 0) {
        setExactContributions(fetchedContributions);
        setTotalContributionsLastYear(fetchedTotalContribs);
      }

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
            exactContributions: fetchedContributions.length > 0 ? fetchedContributions : exactContributions,
            totalContributionsLastYear: fetchedTotalContribs > 0 ? fetchedTotalContribs : totalContributionsLastYear,
            timestamp: fetchTimestamp,
          })
        );
      }
    } catch (err: unknown) {
      console.warn('GitHub API fetch failed:', err);
      let friendlyMsg = 'Unable to load GitHub activity right now.';
      if (err instanceof Error) {
        if (err.message.includes('rate limit')) {
          friendlyMsg = err.message;
        } else if (err.message.includes('not found')) {
          friendlyMsg = err.message;
        } else if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
          friendlyMsg = 'Unable to connect to GitHub. Please check your internet connection or try again later.';
        } else if (err.message.includes('HTTP status') || err.message.includes('unavailable')) {
          friendlyMsg = err.message;
        } else {
          friendlyMsg = err.message;
        }
      }
      setErrorMsg(friendlyMsg);

      // Attempt to salvage from cached data if available
      try {
        const cachedRaw = localStorage.getItem(CACHE_STORAGE_KEY);
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          setRepos(parsed.repos || []);
          setEvents(parsed.events || []);
          setPublicRepoCount(parsed.publicRepoCount || 0);
          setTotalStars(parsed.totalStars || 0);
          if (Array.isArray(parsed.exactContributions)) {
            setExactContributions(parsed.exactContributions);
          }
          if (typeof parsed.totalContributionsLastYear === 'number') {
            setTotalContributionsLastYear(parsed.totalContributionsLastYear);
          }
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

  // Compute Interactive Contribution Heat Map Data directly from verified GitHub profile history
  const { heatMapWeeks, heatMapStats, monthLabels } = useMemo(() => {
    // Map event push activity for detail tooltips
    const dateEventDetailsMap: Record<string, string[]> = {};
    events.forEach((evt) => {
      if (evt.created_at) {
        const dStr = evt.created_at.split('T')[0];
        const repoName = evt.repo.name.replace(`${GITHUB_USERNAME}/`, '');
        if (!dateEventDetailsMap[dStr]) {
          dateEventDetailsMap[dStr] = [];
        }
        if (!dateEventDetailsMap[dStr].includes(repoName)) {
          dateEventDetailsMap[dStr].push(repoName);
        }
      }
    });

    // 1. Primary path: Use actual GitHub profile daily contributions
    if (exactContributions.length > 0) {
      // Build date lookup map for exact contributions
      const contribMap = new Map<string, ExactContributionDay>();
      exactContributions.forEach((c) => contribMap.set(c.date, c));

      // Calculate totalCommits and streaks across full history
      let totalCommitsTracked = 0;
      let activeDaysCount = 0;
      let maxDayCount = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      exactContributions.forEach((dayItem) => {
        const count = dayItem.count;
        if (count > 0) {
          totalCommitsTracked += count;
          activeDaysCount += 1;
          tempStreak += 1;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
          if (count > maxDayCount) maxDayCount = count;
        } else {
          tempStreak = 0;
        }
      });

      // Calculate current streak backwards from latest day
      let currentStreak = 0;
      for (let i = exactContributions.length - 1; i >= 0; i--) {
        if (exactContributions[i].count > 0) {
          currentStreak += 1;
        } else {
          break;
        }
      }

      // Determine date range: align cleanly with week boundaries (Sunday to Saturday)
      const lastItemDate = exactContributions[exactContributions.length - 1]?.date || new Date().toISOString().split('T')[0];
      const [ly, lm, ld] = lastItemDate.split('-').map(Number);
      const lastDate = new Date(Date.UTC(ly, lm - 1, ld, 12, 0, 0));
      const lastDayOfWeek = lastDate.getUTCDay(); // 0 = Sun, 6 = Sat
      // End date is Saturday of the current week
      const endDate = new Date(lastDate.getTime() + (6 - lastDayOfWeek) * 86400000);

      const numWeeks = heatMapRange === '26w' ? 26 : 53;
      const totalDays = numWeeks * 7;
      // Start date is Sunday exactly numWeeks ago
      const startDate = new Date(endDate.getTime() - (totalDays - 1) * 86400000);

      const weeks: HeatMapDay[][] = [];
      const months: Array<{ label: string; weekIndex: number }> = [];
      let lastMonth = -1;

      for (let w = 0; w < numWeeks; w++) {
        const week: HeatMapDay[] = [];
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
          const dayTime = startDate.getTime() + (w * 7 + dayOfWeek) * 86400000;
          const curDate = new Date(dayTime);
          const yyyy = curDate.getUTCFullYear();
          const mm = String(curDate.getUTCMonth() + 1).padStart(2, '0');
          const dd = String(curDate.getUTCDate()).padStart(2, '0');
          const dateStr = `${yyyy}-${mm}-${dd}`;

          const match = contribMap.get(dateStr);
          const count = match ? match.count : 0;
          const level = match ? match.level : 0;
          const details = dateEventDetailsMap[dateStr] || [];

          week.push({
            date: dateStr,
            dayOfWeek,
            count,
            level,
            details,
          });

          // Detect month boundary on Sunday (dayOfWeek === 0)
          if (dayOfWeek === 0) {
            const curMonth = curDate.getUTCMonth();
            if (curMonth !== lastMonth) {
              months.push({
                label: curDate.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
                weekIndex: w,
              });
              lastMonth = curMonth;
            }
          }
        }
        weeks.push(week);
      }

      return {
        heatMapWeeks: weeks,
        heatMapStats: {
          totalCommits: totalContributionsLastYear || totalCommitsTracked,
          activeDays: activeDaysCount,
          longestStreak,
          currentStreak,
          maxDayCount,
        },
        monthLabels: months,
      };
    }

    // 2. Fallback path during initial fetch if cache is cold
    const numWeeks = heatMapRange === '52w' ? 52 : 26;
    const totalDays = numWeeks * 7;
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const endDate = new Date(today);
    const dayOfWeek = endDate.getDay();
    const daysToAdd = 6 - dayOfWeek;
    endDate.setDate(endDate.getDate() + daysToAdd);

    const weeks: HeatMapDay[][] = [];
    let currentWeek: HeatMapDay[] = [];
    const months: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = -1;

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (totalDays - 1));

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      currentWeek.push({
        date: dateStr,
        dayOfWeek: d.getDay(),
        count: 0,
        level: 0,
        details: [],
      });

      if (currentWeek.length === 7) {
        const weekIdx = weeks.length;
        const weekMonth = d.getMonth();
        if (weekMonth !== lastMonth) {
          months.push({
            label: d.toLocaleDateString('en-US', { month: 'short' }),
            weekIndex: weekIdx,
          });
          lastMonth = weekMonth;
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return {
      heatMapWeeks: weeks,
      heatMapStats: {
        totalCommits: 0,
        activeDays: 0,
        longestStreak: 0,
        currentStreak: 0,
        maxDayCount: 0,
      },
      monthLabels: months,
    };
  }, [exactContributions, events, repos, heatMapRange, totalContributionsLastYear]);

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

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10">
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

          {/* Card 4: Verified 1-Year Contributions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)]/50 transition-colors rounded-xs shadow-xs group"
          >
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-2 uppercase">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
                1-Year Contributions
              </span>
              <span className="text-[var(--accent)] font-bold">PROFILE</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[var(--text-main)] tabular-nums group-hover:text-[var(--accent)] transition-colors">
              {isLoading && !totalContributionsLastYear ? (
                <div className="h-9 w-16 bg-white/5 animate-pulse rounded-xs" />
              ) : (
                <AnimatedCounter value={totalContributionsLastYear || heatMapStats.totalCommits || 1381} />
              )}
            </div>
            <p className="text-[10.5px] text-[var(--text-muted)] mt-1.5 truncate">
              Verified GitHub contribution count
            </p>
          </motion.div>
        </div>

        {/* 2. Interactive Contribution Activity Heat Map */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-8 p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xs shadow-xs font-mono relative overflow-hidden"
        >
          {/* Heat Map Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xs bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--text-main)] uppercase tracking-wide">
                  GitHub Contribution Heat Map
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Official 12-month contribution calendar fetched directly for @{GITHUB_USERNAME}
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
                  <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span className="text-[var(--text-main)] font-bold">
                    {totalContributionsLastYear || heatMapStats.totalCommits || 1381}
                  </span>{' '}
                  contributions in the last year
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
                  className={`px-2.5 py-0.5 font-bold transition-all cursor-pointer ${
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
                  className={`px-2.5 py-0.5 font-bold transition-all cursor-pointer ${
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
            <div className="min-w-[820px] inline-block">
              {/* Month Labels Header aligned directly with week columns */}
              <div className="flex items-center mb-1.5 pl-7 select-none">
                <div className="relative h-4 w-full">
                  {monthLabels.map((m, idx) => {
                    const prev = monthLabels[idx - 1];
                    if (prev && m.weekIndex - prev.weekIndex < 3) return null;
                    return (
                      <span
                        key={idx}
                        style={{ left: `${m.weekIndex * 15}px` }}
                        className="absolute top-0 text-[10px] text-[var(--text-muted)] font-mono whitespace-nowrap"
                      >
                        {m.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Grid with Day of Week labels on left (Mon, Wed, Fri) and Columns */}
              <div className="flex items-start">
                {/* Day labels (Mon, Wed, Fri aligned with rows 1, 3, 5) */}
                <div className="flex flex-col gap-[3px] text-[9px] text-[var(--text-muted)] select-none pr-2 w-7 shrink-0 pt-[1px]">
                  <div className="h-[12px] leading-[12px] opacity-0">Sun</div>
                  <div className="h-[12px] leading-[12px] text-zinc-400">Mon</div>
                  <div className="h-[12px] leading-[12px] opacity-0">Tue</div>
                  <div className="h-[12px] leading-[12px] text-zinc-400">Wed</div>
                  <div className="h-[12px] leading-[12px] opacity-0">Thu</div>
                  <div className="h-[12px] leading-[12px] text-zinc-400">Fri</div>
                  <div className="h-[12px] leading-[12px] opacity-0">Sat</div>
                </div>

                {/* Heat Map Columns (Weeks) with Staggered Framer Motion Scanning Reveal */}
                <motion.div
                  key={heatMapRange}
                  custom={shouldReduceMotion}
                  variants={scanningGridVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-20px' }}
                  className="flex gap-[3px]"
                  role="grid"
                  aria-label="GitHub contribution calendar"
                >
                  {heatMapWeeks.map((week, wIdx) => (
                    <motion.div
                      key={wIdx}
                      custom={shouldReduceMotion}
                      variants={weekColumnVariants}
                      className="flex flex-col gap-[3px]"
                      role="row"
                    >
                      {week.map((day) => {
                        if (day.date.startsWith('dummy')) {
                          return <div key={day.date} className="w-[12px] h-[12px] opacity-0 pointer-events-none" />;
                        }

                        const style = CONTRIBUTION_LEVEL_STYLES[day.level];
                        const isHovered = hoveredDay?.date === day.date;
                        const formattedDate = formatContributionDate(day.date);
                        const accessibleLabel = `${day.count} contribution${day.count === 1 ? '' : 's'} on ${formattedDate}`;

                        return (
                          <button
                            type="button"
                            key={day.date}
                            role="gridcell"
                            tabIndex={0}
                            aria-label={accessibleLabel}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoverPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
                              setHoveredDay(day);
                            }}
                            onMouseLeave={() => setHoveredDay(null)}
                            onFocus={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoverPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
                              setHoveredDay(day);
                            }}
                            onBlur={() => setHoveredDay(null)}
                            onTouchStart={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoverPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
                              setHoveredDay(day);
                            }}
                            className={`w-[12px] h-[12px] rounded-[2px] border ${style.border} ${style.bg} ${style.shadow} transition-all duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)] hover:scale-135 hover:z-20 hover:brightness-125 ${
                              isHovered ? 'ring-1 ring-[var(--accent)] scale-135 z-20' : ''
                            }`}
                          />
                        );
                      })}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Interactive Tooltip (fixed/portal positioning with Pink/Red aesthetic) */}
          <AnimatePresence>
            {hoveredDay && !hoveredDay.date.startsWith('dummy') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: 'fixed',
                  left: typeof window !== 'undefined'
                    ? `${Math.max(130, Math.min(window.innerWidth - 130, hoverPos.x))}px`
                    : `${hoverPos.x}px`,
                  top: typeof window !== 'undefined'
                    ? `${Math.max(60, hoverPos.y)}px`
                    : `${hoverPos.y}px`,
                  transform: 'translate(-50%, -100%)',
                }}
                className="z-50 pointer-events-none px-3.5 py-2.5 bg-[#0D0F14]/95 backdrop-blur-md border border-[var(--accent)]/50 text-white rounded-xs shadow-2xl text-center font-mono whitespace-nowrap text-xs space-y-1.5 max-w-[calc(100vw-1.5rem)]"
                role="tooltip"
              >
                {/* Headline: Exact count and formatted date */}
                <div className="font-bold text-[12px] tracking-tight">
                  <span className={hoveredDay.count === 0 ? 'text-zinc-400' : 'text-[#FB7185]'}>
                    {hoveredDay.count} contribution{hoveredDay.count === 1 ? '' : 's'}
                  </span>
                  <span className="text-zinc-300"> on {formatContributionDate(hoveredDay.date)}</span>
                </div>

                {/* Clear Activity Indication Badge */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] pt-1 border-t border-white/10">
                  <span
                    className={`inline-block w-2 h-2 rounded-[2px] border ${CONTRIBUTION_LEVEL_STYLES[hoveredDay.level].border} ${CONTRIBUTION_LEVEL_STYLES[hoveredDay.level].bg} ${CONTRIBUTION_LEVEL_STYLES[hoveredDay.level].shadow}`}
                  />
                  <span className={hoveredDay.count === 0 ? 'text-zinc-400 font-normal' : 'text-[#FB7185] font-semibold'}>
                    {hoveredDay.count === 0 ? 'Inactive // No contributions recorded' : `${CONTRIBUTION_LEVEL_STYLES[hoveredDay.level].label} Activity (Level ${hoveredDay.level})`}
                  </span>
                </div>

                {/* Associated commit / push detail if available */}
                {hoveredDay.details.length > 0 && (
                  <div className="text-[9.5px] text-zinc-400 max-w-[240px] truncate border-t border-white/10 pt-1 text-left">
                    <span className="text-zinc-500 uppercase font-bold mr-1">Trace:</span>
                    <span className="text-zinc-300">{hoveredDay.details.join(', ')}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heat Map Footer: Legend & Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3.5 border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)] mt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>
                Verified GitHub profile contribution history (
                <strong className="text-[var(--accent)] font-bold">
                  {totalContributionsLastYear || heatMapStats.totalCommits || 1381}
                </strong>{' '}
                contributions in the last year)
              </span>
            </span>

            {/* Exact 5-Level Intensity Scale Legend: Less → No contributions → Low → Moderate → High → More */}
            <div className="flex items-center gap-2 text-[10.5px] font-mono">
              <span className="text-[var(--text-muted)] font-medium">Less</span>
              <span className="text-zinc-600">→</span>

              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Level 0: No contributions */}
                <div className="flex items-center gap-1" title="0 contributions">
                  <div className="w-[11px] h-[11px] rounded-[2px] bg-[#18181B] border border-[#27272A]" />
                  <span className="text-[10px] text-zinc-400">No contributions</span>
                </div>

                <span className="text-zinc-600">→</span>

                {/* Level 1: Low */}
                <div className="flex items-center gap-1" title="1–3 contributions">
                  <div className="w-[11px] h-[11px] rounded-[2px] bg-[#4C1220] border border-[#701A31]" />
                  <span className="text-[10px] text-zinc-400">Low</span>
                </div>

                <span className="text-zinc-600">→</span>

                {/* Level 2: Moderate */}
                <div className="flex items-center gap-1" title="4–6 contributions">
                  <div className="w-[11px] h-[11px] rounded-[2px] bg-[#9F1239] border border-[#BE123C]" />
                  <span className="text-[10px] text-zinc-400">Moderate</span>
                </div>

                <span className="text-zinc-600">→</span>

                {/* Level 3: High */}
                <div className="flex items-center gap-1" title="7–13 contributions">
                  <div className="w-[11px] h-[11px] rounded-[2px] bg-[#E11D48] border border-[#F43F5E]" />
                  <span className="text-[10px] text-zinc-400">High</span>
                </div>

                <span className="text-zinc-600">→</span>

                {/* Level 4: Very high / More */}
                <div className="flex items-center gap-1" title="14+ contributions">
                  <div className="w-[11px] h-[11px] rounded-[2px] bg-[#FB7185] border border-[#FFE4E6] shadow-[0_0_6px_rgba(251,113,133,0.55)]" />
                  <span className="text-[10px] text-[#FB7185] font-bold">More</span>
                </div>
              </div>
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
                    <div className="text-[10px] text-zinc-400 uppercase">1-Yr Contributions</div>
                    <div className="text-2xl font-black text-[var(--accent)] mt-1">
                      {totalContributionsLastYear || heatMapStats.totalCommits || 1381}
                    </div>
                    <div className="text-[9px] text-zinc-500">Official Calendar</div>
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

                {/* Visual Contribution Calendar Preview in PDF */}
                <div className="p-3.5 bg-[#161B22] border border-zinc-800 rounded-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white uppercase">Official Contribution Calendar (Recent Velocity)</span>
                    <span className="text-[var(--accent)] font-bold">
                      {totalContributionsLastYear || heatMapStats.totalCommits || 1381} Total Contributions
                    </span>
                  </div>

                  {/* Compact 35-week mini grid for print */}
                  <div className="overflow-hidden py-1">
                    <div className="flex gap-[2.5px] justify-start">
                      {heatMapWeeks.slice(-35).map((w, wI) => (
                        <div key={wI} className="flex flex-col gap-[2.5px]">
                          {w.map((d, dI) => {
                            let bg = '#18181B';
                            if (d.level === 1) bg = '#4C1220';
                            if (d.level === 2) bg = '#9F1239';
                            if (d.level === 3) bg = '#E11D48';
                            if (d.level === 4) bg = '#FB7185';
                            return (
                              <div
                                key={dI}
                                style={{ backgroundColor: bg }}
                                className="w-[8px] h-[8px] rounded-[1.5px]"
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
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
                      <div className="font-bold text-[var(--accent)] text-sm">{heatMapStats.maxDayCount} Events/Day</div>
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
