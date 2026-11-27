import React, { useState, useEffect, useRef } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Send, Github, Linkedin, Copy, CheckCircle2, ArrowUpRight, FileText, QrCode, Download, Smartphone } from 'lucide-react';

interface ContactSectionProps {
  onOpenResume?: () => void;
}

type ContactFieldErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenResume }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Full-Time Software / ML Engineer Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [vcardQrDataUrl, setVcardQrDataUrl] = useState<string>('');
  const [savedVcardNotice, setSavedVcardNotice] = useState<boolean>(false);

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const subjectInputRef = useRef<HTMLInputElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);

  const vcardPayload = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:J;Yogananth;;;',
    `FN:${PERSONAL_INFO.name}`,
    'ORG:AI & Full-Stack Engineering',
    `TITLE:${PERSONAL_INFO.role}`,
    `EMAIL;TYPE=INTERNET,PREF:${PERSONAL_INFO.email}`,
    'URL:https://iam-mjyogananth.pages.dev',
    `URL;TYPE=LINKEDIN:${PERSONAL_INFO.linkedin}`,
    `URL;TYPE=GITHUB:${PERSONAL_INFO.github}`,
    `ADR;TYPE=WORK:;;;${PERSONAL_INFO.location};;;`,
    'END:VCARD',
  ].join('\r\n');

  useEffect(() => {
    let isMounted = true;
    import('qrcode')
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(vcardPayload, {
          width: 240,
          margin: 2,
          color: {
            dark: '#121212',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        })
      )
      .then((url) => {
        if (isMounted) setVcardQrDataUrl(url);
      })
      .catch(() => {
        // Keep vCard download fallback active if canvas generation fails
      });

    return () => {
      isMounted = false;
    };
  }, [vcardPayload]);

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

  const handleDownloadVCard = () => {
    const blob = new Blob([vcardPayload], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Yogananth_J.vcf';
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => {
      if (link.parentNode) link.parentNode.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1500);
    setSavedVcardNotice(true);
    window.setTimeout(() => setSavedVcardNotice(false), 2400);
  };

  const handleDownloadQrPng = () => {
    if (!vcardQrDataUrl) return;
    const link = document.createElement('a');
    link.href = vcardQrDataUrl;
    link.download = 'Yogananth_J_Contact_QR.png';
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => {
      if (link.parentNode) link.parentNode.removeChild(link);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    const nextFieldErrors: ContactFieldErrors = {};
    if (!trimmedName) {
      nextFieldErrors.name = 'Please enter your name.';
    }
    if (!trimmedEmail) {
      nextFieldErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextFieldErrors.email = 'Please enter a valid email address.';
    }
    if (!trimmedSubject) {
      nextFieldErrors.subject = 'Please enter a subject.';
    }
    if (!trimmedMessage) {
      nextFieldErrors.message = 'Please enter your message.';
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      const errorMessages = Object.values(nextFieldErrors);
      if (errorMessages.length === 1 && errorMessages[0]) {
        setFormError(errorMessages[0]);
      } else if (nextFieldErrors.email && !nextFieldErrors.name && !nextFieldErrors.message) {
        setFormError('Please enter a valid email address.');
      } else {
        setFormError('Please enter your name, email address, and message before sending.');
      }

      if (nextFieldErrors.name) {
        nameInputRef.current?.focus();
      } else if (nextFieldErrors.email) {
        emailInputRef.current?.focus();
      } else if (nextFieldErrors.subject) {
        subjectInputRef.current?.focus();
      } else if (nextFieldErrors.message) {
        messageInputRef.current?.focus();
      }
      return;
    }

    setFieldErrors({});
    setFormError(null);

    // Construct robust mailto link
    const mailSubject = encodeURIComponent(trimmedSubject || `Portfolio Message from ${trimmedName}`);
    const mailBody = encodeURIComponent(`${trimmedMessage}\n\n— From: ${trimmedName} (${trimmedEmail})`);
    
    // Open user's default email client
    window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${mailSubject}&body=${mailBody}`;

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section className="py-20 sm:py-28 pb-24 sm:pb-28 bg-[#121212] text-[#F5F2EB] border-b-2 border-[#121212] relative paper-grid-dark">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
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

                {onOpenResume && (
                  <button
                    onClick={onOpenResume}
                    type="button"
                    className="w-full flex items-center justify-between p-3 bg-[var(--accent)]/15 hover:bg-[var(--accent)]/25 border border-[var(--accent)]/40 text-white transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span className="font-mono text-xs font-bold">Official Engineering Resume / CV</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-amber-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Address Book QR Code Card */}
            <div className="p-5 bg-[#1A1A1C] border border-white/10 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-white">
                  <QrCode className="w-4 h-4 text-[#E11D48]" />
                  <span>Quick Save to Address Book</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-white/5 border border-white/15 text-white/70">
                  vCard 3.0
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="p-2 bg-white border-2 border-white/20 shrink-0 shadow-[3px_3px_0px_0px_#E11D48]">
                  {vcardQrDataUrl ? (
                    <img
                      src={vcardQrDataUrl}
                      alt="QR code to save Yogananth J contact details to your mobile address book"
                      width={120}
                      height={120}
                      className="w-28 h-28 sm:w-[120px] sm:h-[120px] block"
                    />
                  ) : (
                    <div className="w-28 h-28 sm:w-[120px] sm:h-[120px] bg-zinc-200 flex items-center justify-center text-[10px] font-mono text-zinc-700 text-center p-2">
                      Generating QR...
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <p className="text-xs text-white/75 leading-relaxed">
                    <Smartphone className="w-3.5 h-3.5 inline-block mr-1 text-[#E11D48] align-text-bottom" />
                    Scan with your phone camera to add <strong className="text-white">{PERSONAL_INFO.name}</strong> (email, portfolio, GitHub &amp; LinkedIn) straight to your contacts.
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={handleDownloadVCard}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E11D48] hover:bg-[#F20D26] text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {savedVcardNotice ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Saved .vcf</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Save Contact (.vcf)</span>
                        </>
                      )}
                    </button>

                    {vcardQrDataUrl && (
                      <button
                        type="button"
                        onClick={handleDownloadQrPng}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/15 text-white/85 hover:text-white border border-white/15 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>QR PNG</span>
                      </button>
                    )}
                  </div>
                </div>
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
              <p className="text-[11px] font-mono text-white/75 mt-1.5">
                All fields marked <span className="text-[#E11D48] font-bold" aria-hidden="true">*</span> are required.
              </p>

              {/* Template chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {templateIntents.map((tmpl) => (
                  <button
                    key={tmpl.label}
                    onClick={() => handleApplyTemplate(tmpl)}
                    type="button"
                    className="px-2.5 py-1 text-xs font-mono bg-white/5 hover:bg-[#E11D48] text-white/80 hover:text-white border border-white/15 transition-all duration-150 active:scale-[0.97] cursor-pointer"
                  >
                    + {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4 font-mono text-xs">
              {formError && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="p-3 bg-rose-500/15 border border-rose-500/50 text-rose-300 font-bold text-xs"
                >
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-white/80 uppercase font-bold mb-1">
                    Your Name <span className="text-[#E11D48]" aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    id="contact-name"
                    type="text"
                    required
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                      if (formError) setFormError(null);
                    }}
                    placeholder="e.g. Maya Chen"
                    className={`w-full px-3 py-2.5 bg-[#121212] border text-white focus:outline-[#E11D48] ${
                      fieldErrors.name ? 'border-rose-500' : 'border-white/20'
                    }`}
                  />
                  {fieldErrors.name && (
                    <p id="contact-name-error" className="mt-1 text-[11px] text-rose-300">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-white/80 uppercase font-bold mb-1">
                    Your Email <span className="text-[#E11D48]" aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={emailInputRef}
                    id="contact-email"
                    type="email"
                    required
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      if (formError) setFormError(null);
                    }}
                    placeholder="e.g. maya@company.com"
                    className={`w-full px-3 py-2.5 bg-[#121212] border text-white focus:outline-[#E11D48] ${
                      fieldErrors.email ? 'border-rose-500' : 'border-white/20'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p id="contact-email-error" className="mt-1 text-[11px] text-rose-300">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-white/80 uppercase font-bold mb-1">
                  Subject <span className="text-[#E11D48]" aria-hidden="true">*</span>
                </label>
                <input
                  ref={subjectInputRef}
                  id="contact-subject"
                  type="text"
                  required
                  aria-invalid={Boolean(fieldErrors.subject)}
                  aria-describedby={fieldErrors.subject ? 'contact-subject-error' : undefined}
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (fieldErrors.subject) setFieldErrors((prev) => ({ ...prev, subject: undefined }));
                    if (formError) setFormError(null);
                  }}
                  placeholder="Subject of message..."
                  className={`w-full px-3 py-2.5 bg-[#121212] border text-white focus:outline-[#E11D48] ${
                    fieldErrors.subject ? 'border-rose-500' : 'border-white/20'
                  }`}
                />
                {fieldErrors.subject && (
                  <p id="contact-subject-error" className="mt-1 text-[11px] text-rose-300">
                    {fieldErrors.subject}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-white/80 uppercase font-bold mb-1">
                  Message <span className="text-[#E11D48]" aria-hidden="true">*</span>
                </label>
                <textarea
                  ref={messageInputRef}
                  id="contact-message"
                  required
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: undefined }));
                    if (formError) setFormError(null);
                  }}
                  placeholder="Type your message here..."
                  className={`w-full p-3 bg-[#121212] border text-white focus:outline-[#E11D48] leading-relaxed ${
                    fieldErrors.message ? 'border-rose-500' : 'border-white/20'
                  }`}
                />
                {fieldErrors.message && (
                  <p id="contact-message-error" className="mt-1 text-[11px] text-rose-300">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#E11D48] hover:bg-[#F20D26] transition-all duration-150 active:scale-[0.98] shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via Email Client</span>
                </button>

                {submitted && (
                  <div role="status" aria-live="polite" className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
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
