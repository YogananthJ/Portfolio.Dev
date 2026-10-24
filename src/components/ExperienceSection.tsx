import React from 'react';
import { TIMELINE, CERTIFICATIONS } from '../data/portfolioData';
import { Calendar, CheckCircle2, Award, ExternalLink, Sparkles, BookOpen, Trophy } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-20 border-t border-[var(--border-color)] bg-[var(--bg-canvas)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border-color)] mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 mb-3">
              <Trophy className="w-3.5 h-3.5" />
              Verified Milestones &amp; Learning Track
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text-main)]">
              Milestones &amp; Certifications
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            Academic coursework, hackathon achievements, personal open-source builds, and industry certifications. Presented with complete transparency and zero fabricated roles.
          </p>
        </div>

        {/* Certifications Banner Cards */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-main)]">
              Verified Industry Certifications
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between hover:border-[var(--accent)] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--accent)]/15 text-[var(--accent)] font-bold">
                      {cert.issuer}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{cert.issueDate}</span>
                  </div>

                  <h4 className="text-base font-bold text-[var(--text-main)] mb-1">
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
                  <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[var(--text-muted)] text-[10px]">{cert.badgeCode}</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-main)]">
              Chronological Engineering Journey
            </h3>
          </div>

          {TIMELINE.map((item, index) => (
            <div
              key={index}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-7 shadow-sm transition-all hover:border-[var(--accent)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3 mb-3">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                    {item.typeLabel}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)] uppercase tracking-tight mt-0.5">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono text-[var(--text-muted)]">
                    {item.subtitle}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] self-start sm:self-auto">
                  <span className="flex items-center gap-1 font-bold text-[var(--text-main)] px-2 py-1 bg-[var(--bg-surface)] border border-[var(--border-color)]">
                    <Calendar className="w-3 h-3 text-[var(--accent)]" />
                    {item.period}
                  </span>
                  {item.proofUrl && (
                    <a
                      href={item.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[var(--accent)] hover:underline font-bold px-2 py-1 bg-[var(--accent)]/10 border border-[var(--accent)]/30"
                    >
                      <span>{item.proofLabel || 'Proof Link'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                {item.summary}
              </p>

              {/* Bullets */}
              <div className="space-y-1.5 mb-4">
                {item.bullets.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[var(--text-main)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="pt-3 border-t border-[var(--border-color)] flex flex-wrap items-center gap-1.5 font-mono text-xs">
                <span className="text-[var(--text-muted)] font-bold uppercase text-[10px]">Stack:</span>
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] text-[11px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
