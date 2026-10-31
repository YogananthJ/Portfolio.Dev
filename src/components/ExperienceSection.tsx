import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMELINE, CERTIFICATIONS } from '../data/portfolioData';
import { Calendar, CheckCircle2, Award, ExternalLink, BookOpen, Trophy, ChevronDown, ChevronUp, Sparkles, Terminal } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const [expandedTimelineIndex, setExpandedTimelineIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedTimelineIndex(expandedTimelineIndex === index ? null : index);
  };

  return (
    <section id="experience" className="py-24 border-t border-[var(--border-color)] bg-[var(--bg-canvas)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-color)] mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>Engineering Journey &amp; Credentials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text-main)]">
              Milestones &amp; Certifications
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-[var(--text-muted)] font-medium font-mono leading-relaxed">
            Academic computer science coursework, hackathon achievements (Top 60 Finalist at Vibeathon 6.0), verified industry certifications from Anthropic and MongoDB, and open-source systems.
          </p>
        </div>

        {/* Verified Industry Certifications Showcase */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-main)]">
              Official Industry Certifications
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CERTIFICATIONS.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between hover:border-[var(--accent)] transition-all rounded-xs relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--accent)]/15 text-[var(--accent)] font-bold border border-[var(--accent)]/30">
                      {cert.issuer}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{cert.issueDate}</span>
                  </div>

                  <h4 className="text-base font-bold text-[var(--text-main)] mb-1.5 group-hover:text-[var(--accent)] transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                    {cert.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {cert.skillsLearned.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2.5 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[var(--text-muted)] text-[10px] font-bold">{cert.badgeCode}</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Credential
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chronological Milestones Timeline */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-main)]">
              Chronological Engineering Track
            </h3>
          </div>

          <div className="space-y-4">
            {TIMELINE.map((item, index) => {
              const isExpanded = expandedTimelineIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className={`bg-[var(--bg-card)] border transition-all rounded-xs overflow-hidden ${
                    isExpanded ? 'border-[var(--accent)] shadow-md' : 'border-[var(--border-color)] hover:border-[var(--text-main)]'
                  }`}
                >
                  <div
                    onClick={() => toggleExpand(index)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] block">
                        {item.typeLabel}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)] uppercase tracking-tight mt-0.5">
                        {item.title}
                      </h3>
                      <div className="text-xs font-mono text-[var(--text-muted)]">
                        {item.subtitle}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center font-mono text-xs">
                      <span className="flex items-center gap-1 font-bold text-[var(--text-main)] px-2.5 py-1 bg-[var(--bg-surface)] border border-[var(--border-color)]">
                        <Calendar className="w-3 h-3 text-[var(--accent)]" />
                        {item.period}
                      </span>
                      <button
                        type="button"
                        aria-label="Toggle details"
                        className="p-1 hover:text-[var(--accent)] text-[var(--text-muted)]"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 sm:px-6 pb-6 pt-1 border-t border-[var(--border-color)]/60 text-xs sm:text-sm font-mono text-[var(--text-muted)]"
                      >
                        <p className="leading-relaxed mb-4 text-[var(--text-main)]">
                          {item.summary}
                        </p>

                        <div className="space-y-2 mb-4">
                          {item.bullets.map((bullet, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-main)]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>

                        {item.proofUrl && (
                          <div className="pt-3 border-t border-[var(--border-color)]/40 flex items-center justify-between">
                            <span className="text-[10px] uppercase text-[var(--text-muted)]">Official Record:</span>
                            <a
                              href={item.proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline font-bold"
                            >
                              <span>{item.proofLabel || 'Open Verification Proof'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
