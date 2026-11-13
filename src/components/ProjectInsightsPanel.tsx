import React, { useEffect, useRef, useState } from 'react';
import { scaleBand, scaleLinear } from 'd3';
import { BarChart3 } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { ProjectItem } from '../types/portfolio';
import {
  buildProjectInsights,
  CachedGitHubRepoSummary,
  extractGitHubRepoSlug,
  fetchGitHubRepoSummary,
  getCachedRepoSummary,
  ProjectChartDatum,
} from '../utils/projectInsights';

interface ProjectInsightsPanelProps {
  project: ProjectItem;
}

export const ProjectInsightsPanel: React.FC<ProjectInsightsPanelProps> = ({ project }) => {
  const shouldReduceMotion = useReducedMotion();
  const repoSlug = extractGitHubRepoSlug(project.githubUrl);

  const [repoSummary, setRepoSummary] = useState<CachedGitHubRepoSummary | null>(() =>
    repoSlug ? getCachedRepoSummary(repoSlug) : null
  );
  const [hoveredBar, setHoveredBar] = useState<ProjectChartDatum | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState<number>(420);

  // Fetch GitHub repo metadata once if a specific repo slug exists and wasn't cached
  useEffect(() => {
    if (!repoSlug) {
      setRepoSummary(null);
      return;
    }

    const cached = getCachedRepoSummary(repoSlug);
    if (cached) {
      setRepoSummary(cached);
      return;
    }

    const controller = new AbortController();
    fetchGitHubRepoSummary(repoSlug, controller.signal).then((summary) => {
      if (!controller.signal.aborted && summary) {
        setRepoSummary(summary);
      }
    });

    return () => controller.abort();
  }, [repoSlug]);

  // Reset hover selection when switching projects
  useEffect(() => {
    setHoveredBar(null);
  }, [project.id]);

  const insights = buildProjectInsights(project, repoSummary);
  const hasChart = insights.chartData.length >= 2;

  // Responsive SVG width tracking via ResizeObserver
  useEffect(() => {
    if (!hasChart) return;
    const el = chartContainerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const updateWidth = () => {
      const nextWidth = Math.max(240, Math.floor(el.clientWidth));
      if (nextWidth > 0) {
        setChartWidth(nextWidth);
      }
    };

    updateWidth();
    const ro = new ResizeObserver(() => updateWidth());
    ro.observe(el);
    return () => ro.disconnect();
  }, [project.id, hasChart]);

  // Gracefully hide entire panel if project has zero verified numerical/repo insights
  if (insights.metrics.length === 0) {
    return null;
  }
  const chartHeight = 112;
  const margin = { top: 14, right: 12, bottom: 24, left: 32 };
  const innerWidth = Math.max(120, chartWidth - margin.left - margin.right);
  const innerHeight = chartHeight - margin.top - margin.bottom;

  // D3 band + linear scales when chart data is present
  const xScale = hasChart
    ? scaleBand<string>()
        .domain(insights.chartData.map((d) => d.id))
        .range([0, innerWidth])
        .padding(0.36)
    : null;

  const yScale = hasChart
    ? scaleLinear()
        .domain([0, insights.chartDomainMax ?? 100])
        .nice()
        .range([innerHeight, 0])
    : null;

  const yTicks = [0, 50, 100];

  return (
    <section
      aria-label="Project Insights"
      className="border-t border-[var(--border-color)] pt-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
            Project Insights
          </h4>
        </div>

        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          {insights.hasLiveRepoStats
            ? 'Verified Specs + GitHub API'
            : 'Verified Project Benchmarks'}
        </span>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-3.5 sm:p-4 space-y-3.5 font-mono">
        {/* Compact 3-4 Metric Grid */}
        <div
          className={`grid gap-2.5 ${
            insights.metrics.length === 1
              ? 'grid-cols-1 sm:grid-cols-2'
              : insights.metrics.length === 2
              ? 'grid-cols-2'
              : insights.metrics.length === 3
              ? 'grid-cols-1 sm:grid-cols-3'
              : 'grid-cols-2 sm:grid-cols-4'
          }`}
        >
          {insights.metrics.map((metric) => {
            const isPink = metric.accent === 'pink';
            return (
              <div
                key={metric.id}
                className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xs relative overflow-hidden"
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-0 left-0 w-full h-[2px] ${
                    isPink
                      ? 'bg-gradient-to-r from-[#EC4899] to-rose-500/40'
                      : 'bg-gradient-to-r from-cyan-400 to-sky-500/40'
                  }`}
                />
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] truncate">
                  {metric.label}
                </div>
                <div
                  className={`text-sm sm:text-base font-bold tabular-nums mt-0.5 ${
                    isPink ? 'text-[#EC4899]' : 'text-cyan-400'
                  }`}
                >
                  {metric.displayValue}
                </div>
                <div className="text-[9px] text-[var(--text-muted)] truncate mt-0.5">
                  Src: {metric.source}
                </div>
              </div>
            );
          })}
        </div>

        {/* Responsive Accessible D3 Bar Chart (Rendered ONLY when >= 2 comparable numerical metrics exist) */}
        {hasChart && xScale && yScale && (
          <div className="pt-2.5 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px]">
              <span className="uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                {insights.chartTitle}
              </span>
              <span className="text-cyan-400 min-h-[14px]">
                {hoveredBar
                  ? `${hoveredBar.label}: ${hoveredBar.value}${hoveredBar.unit} (${hoveredBar.source})`
                  : 'Hover or focus bars for exact values'}
              </span>
            </div>

            <div ref={chartContainerRef} className="w-full overflow-hidden">
              <svg
                width={chartWidth}
                height={chartHeight}
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                role="img"
                aria-label={`${project.title} ${insights.chartTitle}: ${insights.chartData
                  .map((d) => `${d.label} ${d.value}${d.unit}`)
                  .join(', ')}`}
                className="block w-full h-auto select-none"
              >
                <defs>
                  <linearGradient id={`bar-pink-${project.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#E11D48" stopOpacity="0.55" />
                  </linearGradient>
                  <linearGradient id={`bar-cyan-${project.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#0891B2" stopOpacity="0.55" />
                  </linearGradient>
                </defs>

                <g transform={`translate(${margin.left},${margin.top})`}>
                  {/* Horizontal Gridlines & Y-Axis Ticks */}
                  {yTicks.map((tick) => {
                    const yPos = yScale(tick);
                    return (
                      <g key={tick} transform={`translate(0,${yPos})`}>
                        <line
                          x1={0}
                          x2={innerWidth}
                          stroke="currentColor"
                          strokeOpacity={0.12}
                          strokeDasharray="2 2"
                        />
                        <text
                          x={-6}
                          y={3}
                          textAnchor="end"
                          fill="currentColor"
                          fillOpacity={0.55}
                          fontSize={9}
                        >
                          {tick}%
                        </text>
                      </g>
                    );
                  })}

                  {/* D3 Scaled Bars */}
                  {insights.chartData.map((d) => {
                    const x = xScale(d.id) ?? 0;
                    const barWidth = Math.min(xScale.bandwidth(), 76);
                    const centeredX = x + (xScale.bandwidth() - barWidth) / 2;
                    const y = yScale(d.value);
                    const barHeight = Math.max(2, innerHeight - y);
                    const isFocused = hoveredBar?.id === d.id;

                    return (
                      <g
                        key={d.id}
                        tabIndex={0}
                        role="graphics-symbol"
                        aria-label={`${d.label}: ${d.value}${d.unit} from ${d.source}`}
                        onMouseEnter={() => setHoveredBar(d)}
                        onMouseLeave={() => setHoveredBar(null)}
                        onFocus={() => setHoveredBar(d)}
                        onBlur={() => setHoveredBar(null)}
                        className="outline-none cursor-pointer"
                      >
                        <title>{`${d.label}: ${d.value}${d.unit} (${d.source})`}</title>
                        <rect
                          x={centeredX}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx={2}
                          fill={
                            d.accent === 'pink'
                              ? `url(#bar-pink-${project.id})`
                              : `url(#bar-cyan-${project.id})`
                          }
                          stroke={isFocused ? '#FFFFFF' : 'transparent'}
                          strokeWidth={isFocused ? 1.2 : 0}
                          style={{
                            transition: shouldReduceMotion
                              ? undefined
                              : 'opacity 150ms ease, stroke 150ms ease',
                          }}
                        />
                        <text
                          x={centeredX + barWidth / 2}
                          y={Math.max(-3, y - 4)}
                          textAnchor="middle"
                          fill="currentColor"
                          fillOpacity={isFocused ? 1 : 0.85}
                          fontSize={9.5}
                          fontWeight={700}
                        >
                          {d.value}
                          {d.unit}
                        </text>
                        <text
                          x={centeredX + barWidth / 2}
                          y={innerHeight + 14}
                          textAnchor="middle"
                          fill="currentColor"
                          fillOpacity={0.7}
                          fontSize={9}
                        >
                          {d.label.length > 16 ? `${d.label.slice(0, 15)}…` : d.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
