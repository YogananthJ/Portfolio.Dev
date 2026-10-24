import React from 'react';
import { TIMELINE } from '../data/portfolioData';
import { Briefcase, Calendar, MapPin, CheckCircle2, Award } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-20 sm:py-28 bg-[#F5F2EB] border-b-2 border-[#121212] relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#121212] mb-12">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-[#E11D48] uppercase mb-2">
              04 — Timeline &amp; Practical Track Record
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#121212]">
              Experience
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#121212]/75 font-medium">
            Building end-to-end intelligent systems, open-source projects, and full-stack solutions.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="space-y-8">
          {TIMELINE.map((item, index) => (
            <div
              key={index}
              className="bg-[#EBE6DC] border-2 border-[#121212] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#121212] transition-all hover:border-[#E11D48]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#121212]/15 pb-4 mb-4">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E11D48]">
                    {item.organization}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-[#121212] uppercase tracking-tight mt-0.5">
                    {item.role}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[#121212]/70">
                  <span className="flex items-center gap-1.5 font-bold text-[#121212]">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.period}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location}
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#121212]/85 leading-relaxed mb-5 font-medium">
                {item.summary}
              </p>

              {/* Achievements */}
              <div className="space-y-2 mb-6">
                {item.achievements.map((ach, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#121212]/80">
                    <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="pt-4 border-t border-[#121212]/15 flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="text-[#121212]/50 font-bold uppercase text-[10px]">Stack:</span>
                {item.technologies.map((tech) => (
                  <span key={tech} className="px-2.5 py-0.5 bg-[#F5F2EB] border border-[#121212]/20 text-[#121212] font-semibold">
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
