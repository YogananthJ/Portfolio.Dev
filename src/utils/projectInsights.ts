import { ProjectItem } from '../types/portfolio';

export interface ProjectInsightMetric {
  id: string;
  label: string;
  displayValue: string;
  numericValue?: number;
  unit?: string;
  source: string;
  accent: 'pink' | 'cyan';
  chartScaleGroup?: 'percentage';
}

export interface ProjectChartDatum {
  id: string;
  label: string;
  value: number;
  unit: string;
  source: string;
  accent: 'pink' | 'cyan';
}

export interface ProjectInsightsBundle {
  metrics: ProjectInsightMetric[];
  chartData: ProjectChartDatum[];
  chartTitle?: string;
  chartUnit?: string;
  chartDomainMax?: number;
  repoFullName: string | null;
  hasLiveRepoStats: boolean;
}

export interface CachedGitHubRepoSummary {
  fullName: string;
  stars: number;
  sizeKb: number;
  forks?: number;
  language?: string | null;
}

const GITHUB_CACHE_KEY = 'github_telemetry_cache_v4';
const sessionRepoCache = new Map<string, CachedGitHubRepoSummary | null>();

/**
 * Extracts `owner/repo` from a GitHub URL only if a specific repository path exists.
 * Generic profile URLs like `https://github.com/YogananthJ` return `null`.
 */
export function extractGitHubRepoSlug(githubUrl: string): string | null {
  if (!githubUrl) return null;
  try {
    const parsed = new URL(githubUrl);
    if (!parsed.hostname.toLowerCase().includes('github.com')) {
      return null;
    }
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      return null;
    }
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, '');
    return `${owner}/${repo}`;
  } catch {
    return null;
  }
}

/**
 * Attempts to find cached GitHub repo telemetry from GitHubActivitySection's localStorage cache
 * or from the session memory cache.
 */
export function getCachedRepoSummary(repoSlug: string): CachedGitHubRepoSummary | null {
  const key = repoSlug.toLowerCase();
  if (sessionRepoCache.has(key)) {
    return sessionRepoCache.get(key) ?? null;
  }

  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(GITHUB_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const repos: Array<{
      full_name?: string;
      stargazers_count?: number;
      size?: number;
      forks_count?: number;
      language?: string | null;
    }> = Array.isArray(parsed?.repos) ? parsed.repos : [];

    const match = repos.find(
      (r) => typeof r.full_name === 'string' && r.full_name.toLowerCase() === key
    );

    if (match && typeof match.stargazers_count === 'number') {
      const summary: CachedGitHubRepoSummary = {
        fullName: match.full_name || repoSlug,
        stars: match.stargazers_count,
        sizeKb: typeof match.size === 'number' ? match.size : 0,
        forks: typeof match.forks_count === 'number' ? match.forks_count : undefined,
        language: match.language ?? null,
      };
      sessionRepoCache.set(key, summary);
      return summary;
    }
  } catch {
    // Ignore cache parse issues
  }

  return null;
}

/**
 * Fetches live repository metadata from GitHub REST API (at most once per repo per session).
 * Returns null gracefully if offline, rate-limited, or repository is private/404.
 */
export async function fetchGitHubRepoSummary(
  repoSlug: string,
  signal?: AbortSignal
): Promise<CachedGitHubRepoSummary | null> {
  const cached = getCachedRepoSummary(repoSlug);
  if (cached) return cached;

  const key = repoSlug.toLowerCase();
  if (sessionRepoCache.has(key)) {
    return sessionRepoCache.get(key) ?? null;
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return null;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repoSlug}`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal,
    });

    if (!res.ok) {
      if (res.status === 404) {
        sessionRepoCache.set(key, null);
      }
      return null;
    }

    const data = await res.json();
    const summary: CachedGitHubRepoSummary = {
      fullName: typeof data.full_name === 'string' ? data.full_name : repoSlug,
      stars: typeof data.stargazers_count === 'number' ? data.stargazers_count : 0,
      sizeKb: typeof data.size === 'number' ? data.size : 0,
      forks: typeof data.forks_count === 'number' ? data.forks_count : undefined,
      language: typeof data.language === 'string' ? data.language : null,
    };
    sessionRepoCache.set(key, summary);
    return summary;
  } catch {
    return null;
  }
}

function formatRepoSize(sizeKb: number): { displayValue: string; unit: string } {
  if (sizeKb >= 1024) {
    return {
      displayValue: `${(sizeKb / 1024).toFixed(1)} MB`,
      unit: 'MB',
    };
  }
  return {
    displayValue: `${sizeKb} KB`,
    unit: 'KB',
  };
}

/**
 * Builds strictly project-specific, verified metrics derived from documented project specs
 * in portfolioData.ts and live/cached GitHub API metadata (when a repo slug exists).
 * Caps output at 4 metrics and only builds a D3 chart series when >= 2 comparable
 * percentage metrics exist on a shared 0-100% scale.
 */
export function buildProjectInsights(
  project: ProjectItem,
  repoSummary: CachedGitHubRepoSummary | null = null
): ProjectInsightsBundle {
  const repoSlug = extractGitHubRepoSlug(project.githubUrl);
  const documented: ProjectInsightMetric[] = [];

  switch (project.id) {
    case 'vibeathon-restaurant':
      documented.push({
        id: 'build-time',
        label: 'Build Time',
        displayValue: '48 hrs',
        numericValue: 48,
        unit: 'hrs',
        source: 'Vibeathon 6.0 Sprint',
        accent: 'pink',
      });
      break;

    case 'cognitive-ai':
      documented.push(
        {
          id: 'api-latency',
          label: 'API Response Time',
          displayValue: '< 220 ms',
          numericValue: 220,
          unit: 'ms',
          source: 'FastAPI Telemetry Spec',
          accent: 'cyan',
        },
        {
          id: 'cognitive-states',
          label: 'Emotion Classes',
          displayValue: '7 states',
          numericValue: 7,
          unit: 'states',
          source: 'GoEmotions Pipeline',
          accent: 'pink',
        }
      );
      break;

    case 'pdf-rag':
      documented.push(
        {
          id: 'retrieval-latency',
          label: 'Retrieval Latency',
          displayValue: '< 180 ms',
          numericValue: 180,
          unit: 'ms',
          source: 'FAISS Top-5 Cosine',
          accent: 'cyan',
        },
        {
          id: 'embedding-dim',
          label: 'Vector Dimensions',
          displayValue: '1024 dim',
          numericValue: 1024,
          unit: 'dim',
          source: 'BGE-Large-EN',
          accent: 'pink',
        }
      );
      break;

    case 'resume-parser':
      documented.push({
        id: 'crew-agents',
        label: 'Crew Agents',
        displayValue: '3 agents',
        numericValue: 3,
        unit: 'agents',
        source: 'CrewAI Spec',
        accent: 'cyan',
      });
      break;

    case 'wildfire-detection':
      documented.push(
        {
          id: 'test-recall',
          label: 'Test Recall',
          displayValue: '96.4%',
          numericValue: 96.4,
          unit: '%',
          source: '80/20 Satellite Split',
          accent: 'pink',
          chartScaleGroup: 'percentage',
        },
        {
          id: 'false-alarm',
          label: 'False Alarm Rate',
          displayValue: '2.1%',
          numericValue: 2.1,
          unit: '%',
          source: 'Cloud-Edge Eval',
          accent: 'cyan',
          chartScaleGroup: 'percentage',
        },
        {
          id: 'spectral-res',
          label: 'Spatial Resolution',
          displayValue: '30 m',
          numericValue: 30,
          unit: 'm',
          source: 'SWIR + TIR Bands',
          accent: 'cyan',
        }
      );
      break;

    case 'loan-approval':
      documented.push(
        {
          id: 'xgb-recall',
          label: 'XGBoost Recall',
          displayValue: '94.2%',
          numericValue: 94.2,
          unit: '%',
          source: '20% Test Holdout',
          accent: 'pink',
          chartScaleGroup: 'percentage',
        },
        {
          id: 'logreg-recall',
          label: 'LogReg Baseline',
          displayValue: '81.8%',
          numericValue: 81.8,
          unit: '%',
          source: 'Baseline Evaluation',
          accent: 'cyan',
          chartScaleGroup: 'percentage',
        },
        {
          id: 'recall-gain',
          label: 'Recall Gain',
          displayValue: '+12.4%',
          numericValue: 12.4,
          unit: '%',
          source: 'XGBoost vs LogReg',
          accent: 'pink',
          chartScaleGroup: 'percentage',
        },
        {
          id: 'dataset-size',
          label: 'Dataset Size',
          displayValue: '4,269 records',
          numericValue: 4269,
          unit: 'records',
          source: 'Loan Holdout Dataset',
          accent: 'cyan',
        }
      );
      break;

    case 'food-calorie':
      documented.push(
        {
          id: 'top1-accuracy',
          label: 'Top-1 Accuracy',
          displayValue: '89.6%',
          numericValue: 89.6,
          unit: '%',
          source: 'Food-101 Subset',
          accent: 'pink',
        },
        {
          id: 'inference-speed',
          label: 'Inference Time',
          displayValue: '62 ms',
          numericValue: 62,
          unit: 'ms',
          source: 'Local GPU Batch-1',
          accent: 'cyan',
        },
        {
          id: 'dish-classes',
          label: 'Dish Classes',
          displayValue: '101 classes',
          numericValue: 101,
          unit: 'classes',
          source: 'Food-101 Taxonomy',
          accent: 'pink',
        }
      );
      break;

    case 'event-platform':
      documented.push({
        id: 'lighthouse-score',
        label: 'Lighthouse Score',
        displayValue: '98 / 100',
        numericValue: 98,
        unit: 'pts',
        source: 'Client Audit',
        accent: 'cyan',
      });
      break;

    case 'supply-chain':
      documented.push(
        {
          id: 'delay-prediction',
          label: 'Delay Prediction',
          displayValue: '91.8%',
          numericValue: 91.8,
          unit: '%',
          source: 'Shipping Benchmark',
          accent: 'pink',
        },
        {
          id: 'corridors-modeled',
          label: 'Corridors Modeled',
          displayValue: '120+ legs',
          numericValue: 120,
          unit: 'legs',
          source: 'Freight Manifests',
          accent: 'cyan',
        }
      );
      break;

    default:
      break;
  }

  // Append verified live/cached GitHub repository metrics when available (capped at 4 total)
  const combined = [...documented];
  let hasLiveRepoStats = false;

  if (repoSummary) {
    hasLiveRepoStats = true;
    if (combined.length < 4) {
      combined.push({
        id: 'github-stars',
        label: 'GitHub Stars',
        displayValue: `${repoSummary.stars}`,
        numericValue: repoSummary.stars,
        unit: 'stars',
        source: 'GitHub API',
        accent: 'cyan',
      });
    }
    if (combined.length < 4 && repoSummary.sizeKb > 0) {
      const formatted = formatRepoSize(repoSummary.sizeKb);
      combined.push({
        id: 'repo-size',
        label: 'Repo Size',
        displayValue: formatted.displayValue,
        numericValue: repoSummary.sizeKb,
        unit: formatted.unit,
        source: 'GitHub API',
        accent: 'pink',
      });
    }
  }

  const finalMetrics = combined.slice(0, 4);

  // Only produce a D3 bar chart when >= 2 comparable metrics share the percentage scale
  const comparablePercentageMetrics = finalMetrics.filter(
    (m) => m.chartScaleGroup === 'percentage' && typeof m.numericValue === 'number'
  );

  const chartData: ProjectChartDatum[] =
    comparablePercentageMetrics.length >= 2
      ? comparablePercentageMetrics.map((m) => ({
          id: m.id,
          label: m.label,
          value: m.numericValue as number,
          unit: m.unit || '%',
          source: m.source,
          accent: m.accent,
        }))
      : [];

  return {
    metrics: finalMetrics,
    chartData,
    chartTitle:
      chartData.length >= 2 ? 'Model Benchmark Comparison (%)' : undefined,
    chartUnit: chartData.length >= 2 ? '%' : undefined,
    chartDomainMax: chartData.length >= 2 ? 100 : undefined,
    repoFullName: repoSlug,
    hasLiveRepoStats,
  };
}
