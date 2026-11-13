import React, { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ArrowUp, Github, Linkedin, Shield } from 'lucide-react';
import { VisitorCounter } from './VisitorCounter';
import {
  AnalyticsConsentState,
  getAnalyticsConsentState,
  isBrowserPrivacyOptOut,
  setAnalyticsConsent,
  subscribeToAnalyticsConsent,
  trackGa4PageView,
} from '../utils/ga4';

export const Footer: React.FC = () => {
  const [consentState, setConsentState] = useState<AnalyticsConsentState>(() =>
    getAnalyticsConsentState()
  );
  const browserOptOut = isBrowserPrivacyOptOut();

  useEffect(() => {
    return subscribeToAnalyticsConsent((next) => setConsentState(next));
  }, []);

  const handleToggleConsent = () => {
    if (browserOptOut) return;
    const nextGranted = consentState !== 'granted';
    setAnalyticsConsent(nextGranted);
    if (nextGranted && typeof window !== 'undefined') {
      trackGa4PageView(window.location.pathname || '/', document.title);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090909] text-[#F5F2EB] py-12 border-t-2 border-[#121212] font-mono">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              YOGANANTH
            </div>
            <div className="text-xs text-white/60 mt-1">
              AI Engineer · Full-Stack Developer · Automation Specialist
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-[#E11D48] border border-white/10 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/5 hover:bg-[#E11D48] border border-white/10 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <button
              onClick={scrollToTop}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-white/10 hover:bg-white hover:text-black transition-colors border border-white/20"
              title="Return to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dedicated Total Visitors Counter Section */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10">
          <div className="text-xs text-white/70 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E11D48]"></span>
            <span className="font-semibold text-white">PORTFOLIO TRAFFIC MONITOR</span>
            <span className="text-white/40 hidden md:inline">— Tracking verified unique visits</span>
          </div>
          <div>
            <VisitorCounter />
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            &copy; {new Date().getFullYear()} Yogananth J. Designed &amp; engineered with intent.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span>Built with React &amp; TypeScript</span>
            <span>·</span>
            <span>Zero-slop architectural craft</span>
            <span>·</span>
            <button
              type="button"
              onClick={handleToggleConsent}
              disabled={browserOptOut}
              aria-pressed={consentState === 'granted'}
              title={
                browserOptOut
                  ? 'Browser Do Not Track / Global Privacy Control is active (analytics disabled)'
                  : consentState === 'granted'
                    ? 'Privacy-safe GA4 analytics active (zero PII). Click to opt out.'
                    : 'GA4 analytics opted out. Click to re-enable.'
              }
              className="inline-flex items-center gap-1 px-2 py-0.5 border border-white/15 bg-white/5 hover:border-white/30 text-[11px] text-white/70 hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <Shield className="w-3 h-3 text-[#E11D48]" />
              <span>
                {browserOptOut
                  ? 'Privacy: DNT Active'
                  : consentState === 'granted'
                    ? 'Analytics: Enabled'
                    : 'Analytics: Opted Out'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
