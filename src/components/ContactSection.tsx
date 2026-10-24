import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Send, Mail, Github, Linkedin, Copy, CheckCircle2, MessageSquare, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Full-Time Software / ML Engineer Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const templateIntents = [
    { label: 'Hiring for Team', subject: 'Opportunity / Job Inquiry for Yogananth', template: "Hi Yogananth,\n\nWe came across your portfolio and would love to speak with you regarding an engineering opportunity on our team." },
    { label: 'Project Collaboration', subject: 'Collaboration / AI Application Inquiry', template: "Hi Yogananth,\n\nI'm reaching out regarding a project involving machine learning and web development that we'd love your expertise on." },
    { label: 'Quick Chat & Coffee', subject: 'Networking / Tech Discussion', template: "Hey Yogananth,\n\nI really liked your work on the wildfire classifier and RAG chatbot. Would love to connect and chat about tech." },
  ];

  const handleApplyTemplate = (tmpl: { subject: string; template: string }) => {
    setSubject(tmpl.subject);
    setMessage(tmpl.template);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Construct robust mailto link
    const mailSubject = encodeURIComponent(subject || `Portfolio Message from ${name}`);
    const mailBody = encodeURIComponent(`${message}\n\n— From: ${name} (${email})`);
    
    // Open user's default email client
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${mailSubject}&body=${mailBody}`;

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#121212] text-[#F5F2EB] border-b-2 border-[#121212] relative paper-grid-dark">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/15 mb-12">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-[#E11D48] uppercase mb-2">
              05 — Initiation &amp; Inquiries
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
              Let's Connect
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/70 font-medium">
            Open to full-time roles, ambitious software engineering opportunities, and technical collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contacts & Status */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#1A1A1C] border border-white/10 space-y-4">
              <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                Direct Channels
              </h3>
              <p className="text-sm text-white/75 leading-relaxed">
                Whether you want to discuss a software engineering role, evaluate one of my machine learning prototypes, or explore custom automation, feel free to reach out.
              </p>

              {/* Direct email card */}
              <div className="p-4 bg-white/5 border border-white/10 flex items-center justify-between gap-3 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-white/50 uppercase">Primary Email</div>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="text-white hover:text-[#E11D48] font-bold text-sm block mt-0.5"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>
                <button
                  onClick={handleCopyEmail}
                  type="button"
                  className="px-3 py-1.5 bg-white/10 hover:bg-[#E11D48] text-white border border-white/20 transition-colors flex items-center gap-1.5"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Social profiles */}
              <div className="space-y-2 pt-2">
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span className="font-mono text-xs font-bold">LinkedIn Profile</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/60" />
                </a>

                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Github className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-xs font-bold">GitHub / Repositories</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/60" />
                </a>
              </div>
            </div>

            {/* Availability Box */}
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 text-xs font-mono text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Current Status</span>
              </div>
              <p className="text-white/80">
                Actively preparing for 2026 roles in AI, Machine Learning, and Full-Stack Engineering.
              </p>
            </div>
          </div>

          {/* Right Column: Functional Message Composer */}
          <div className="lg:col-span-7 bg-[#1C1C1E] border-2 border-white/20 p-6 sm:p-8 shadow-[6px_6px_0px_0px_#E11D48]">
            <div className="mb-6">
              <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight mb-2">
                Send a Message
              </h3>
              <p className="text-xs font-mono text-white/60">
                Choose a pre-filled template or write your custom message.
              </p>

              {/* Template chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {templateIntents.map((tmpl) => (
                  <button
                    key={tmpl.label}
                    onClick={() => handleApplyTemplate(tmpl)}
                    type="button"
                    className="px-2.5 py-1 text-xs font-mono bg-white/5 hover:bg-[#E11D48] text-white/80 hover:text-white border border-white/15 transition-colors"
                  >
                    + {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 uppercase font-bold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full px-3 py-2.5 bg-[#121212] border border-white/20 text-white focus:outline-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 uppercase font-bold mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. maya@company.com"
                    className="w-full px-3 py-2.5 bg-[#121212] border border-white/20 text-white focus:outline-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 uppercase font-bold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject of message..."
                  className="w-full px-3 py-2.5 bg-[#121212] border border-white/20 text-white focus:outline-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-white/70 uppercase font-bold mb-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full p-3 bg-[#121212] border border-white/20 text-white focus:outline-[#E11D48] leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#E11D48] hover:bg-[#F20D26] transition-all shadow-[2px_2px_0px_0px_#ffffff]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via Email Client</span>
                </button>

                {submitted && (
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Opening your mail app to send!</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
