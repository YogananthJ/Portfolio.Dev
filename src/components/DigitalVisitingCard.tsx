import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Mail, 
  Linkedin, 
  Github, 
  MapPin, 
  Cpu, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Contact, 
  ChevronDown, 
  CheckCircle2, 
  QrCode as QrIcon, 
  Loader2, 
  Share2,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

interface DigitalVisitingCardProps {
  className?: string;
}

export const DigitalVisitingCard: React.FC<DigitalVisitingCardProps> = ({ className = '' }) => {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<boolean>(false);
  const [exportingType, setExportingType] = useState<'pdf' | 'png' | 'vcf' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [photoHighlighted, setPhotoHighlighted] = useState<boolean>(false);
  const [photoRevealedInfo, setPhotoRevealedInfo] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const printCardRef = useRef<HTMLDivElement | null>(null);

  // Generate scannable QR Code on mount pointing to portfolio URL
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL('https://iam-mjyogananth.pages.dev', {
      width: 240,
      margin: 1,
      color: {
        dark: '#FFFFFF',
        light: '#0D111A'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        if (isMounted) setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate visiting card QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Close download dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDownloadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show Toast Feedback
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2800);
  };

  // ---------------------------------------------------------------------------
  // PHOTO CLICK INTERACTION (Click to Reveal effect without flipping card)
  // ---------------------------------------------------------------------------
  const handlePhotoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoHighlighted(true);
    setPhotoRevealedInfo((prev) => !prev);
    showToast('✦ Verified AI Engineer Identity · Yogananth J ✦');
    setTimeout(() => {
      setPhotoHighlighted(false);
    }, 1200);
  };

  // Copy Email to Clipboard
  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('mjyogananth@gmail.com');
    setCopiedEmail(true);
    showToast('Email copied: mjyogananth@gmail.com');
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  // Copy Portfolio Link to Clipboard
  const handleCopyPortfolioLink = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText('https://iam-mjyogananth.pages.dev');
    setCopiedLink(true);
    showToast('Portfolio link copied: https://iam-mjyogananth.pages.dev');
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Share Link via Web Share API with clipboard fallback
  const handleShareLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: 'Yogananth J — Digital Visiting Card',
      text: 'Connect with Yogananth J — AI Engineer & Full-Stack Developer',
      url: 'https://iam-mjyogananth.pages.dev'
    };

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!');
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyPortfolioLink(e);
        }
        return;
      }
    }
    handleCopyPortfolioLink(e);
  };

  // Export as RFC 6350 vCard (.vcf)
  const handleDownloadVCard = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setExportingType('vcf');
      setDownloadMenuOpen(false);

      const vcardContent = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:J;Yogananth;;;',
        'FN:Yogananth J',
        'ORG:AI & Automation Engineering',
        'TITLE:AI Engineer · Full-Stack Developer · Automation Specialist',
        'EMAIL;TYPE=INTERNET,WORK:mjyogananth@gmail.com',
        'URL;TYPE=WORK:https://iam-mjyogananth.pages.dev',
        'X-SOCIALPROFILE;type=linkedin:https://www.linkedin.com/in/yogananth-j-653400307/',
        'X-SOCIALPROFILE;type=github:https://github.com/YogananthJ',
        'ADR;TYPE=WORK:;;Gobichettipalayam;Erode;Tamil Nadu;;India',
        'NOTE:B.Tech in Artificial Intelligence & Data Science / ML | Specializing in Multi-Agent Orchestration, Hybrid Vector RAG, and Modern Full-Stack Platforms.',
        'REV:2026-03-30T00:00:00Z',
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Yogananth_J_Contact.vcf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      showToast('Saved vCard (Yogananth_J_Contact.vcf)');
    } catch (err) {
      console.error('vCard export failed:', err);
      showToast('Failed to export contact file');
    } finally {
      setExportingType(null);
    }
  };

  // Export as Standard Business Card PDF (3.5" × 2" format with clickable link annotations)
  const handleDownloadPDF = async () => {
    try {
      setExportingType('pdf');
      setDownloadMenuOpen(false);

      if (!printCardRef.current) {
        throw new Error('Export container not ready');
      }

      const cardCanvas = await html2canvas(printCardRef.current, {
        scale: 2.5,
        backgroundColor: '#0A0D14',
        useCORS: true,
        logging: false
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2.0]
      });

      const imgData = cardCanvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 3.5, 2.0);

      // Embedded PDF Hyperlinks
      pdf.link(0.2, 0.45, 1.8, 0.22, { url: 'mailto:mjyogananth@gmail.com' });
      pdf.link(0.2, 0.72, 1.8, 0.22, { url: 'https://www.linkedin.com/in/yogananth-j-653400307/' });
      pdf.link(0.2, 0.99, 1.8, 0.22, { url: 'https://github.com/YogananthJ' });
      pdf.link(0.2, 1.26, 1.8, 0.22, { url: 'https://iam-mjyogananth.pages.dev' });
      pdf.link(2.2, 0.42, 1.1, 1.1, { url: 'https://iam-mjyogananth.pages.dev' });
      pdf.link(0.2, 1.72, 2.0, 0.22, { url: 'https://iam-mjyogananth.pages.dev' });

      pdf.save('Yogananth_J_Visiting_Card.pdf');
      showToast('Downloaded PDF with Clickable Links (3.5" × 2")');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('Failed to export PDF');
    } finally {
      setExportingType(null);
    }
  };

  // Export as High-Resolution PNG
  const handleDownloadPNG = async () => {
    try {
      setExportingType('png');
      setDownloadMenuOpen(false);

      if (!printCardRef.current) throw new Error('Target export container not ready');

      const canvas = await html2canvas(printCardRef.current, {
        scale: 2.5,
        backgroundColor: '#07090E',
        useCORS: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = 'Yogananth_J_Digital_Visiting_Card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('Downloaded High-Resolution Visiting Card (PNG)');
    } catch (err) {
      console.error('PNG export failed:', err);
      showToast('Failed to export PNG');
    } finally {
      setExportingType(null);
    }
  };

  return (
    <div className={`flex flex-col items-center select-none w-full ${className}`}>
      {/* ========================================================================= */}
      {/* ONE SINGLE COMBINED DIGITAL VISITING CARD                                 */}
      {/* Combines small profile photo, credentials, channels, QR code, and icons   */}
      {/* Everything inside one single card. No 3D flip. No buttons below.          */}
      {/* ========================================================================= */}
      <div 
        ref={cardRef}
        className="relative w-full max-w-[560px] sm:max-w-[600px] lg:max-w-[620px] rounded-lg border-2 border-rose-500/85 bg-[#0B0E17]/98 text-white p-3.5 sm:p-4.5 flex flex-col justify-between shadow-[8px_8px_0px_0px_var(--border-color)] hover:shadow-[11px_11px_0px_0px_var(--border-color)] transition-shadow duration-300"
      >
        {/* Subtle Tech Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none rounded-lg" />
        
        {/* Ambient Neon Rose Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-pink-600/15 rounded-full blur-2xl pointer-events-none" />

        {/* ----------------------------------------------------------------------- */}
        {/* 1. TOP HEADER BAR: Status Ping + Pass ID + IN-CARD ACTION ICONS          */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          {/* Left: Verified Digital ID & Live Status */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              DIGITAL VISITING CARD · 2026
            </span>
            <span className="hidden sm:inline px-1.5 py-0.5 rounded-xs bg-white/5 border border-white/10 font-mono text-[8px] text-white/60">
              ID: YJ-AIML-882
            </span>
          </div>

          {/* Right: IN-CARD ACTION SYMBOLS (DOWNLOAD & SHARE ICONS) */}
          <div className="flex items-center gap-1.5">
            {/* Download Icon Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDownloadMenuOpen((prev) => !prev)}
                disabled={exportingType !== null}
                className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-rose-500/20 text-white/80 hover:text-rose-300 border border-white/15 hover:border-rose-500/50 rounded-xs font-mono text-[9px] sm:text-[10px] font-bold uppercase transition-all cursor-pointer"
                title="Download Visiting Card (PDF, PNG, vCard)"
                aria-label="Download options"
              >
                {exportingType ? (
                  <Loader2 className="w-3 h-3 animate-spin text-rose-400" />
                ) : (
                  <Download className="w-3 h-3 text-rose-400" />
                )}
                <span className="hidden sm:inline">DOWNLOAD</span>
                <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${downloadMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* In-Card Download Menu Dropdown */}
              <AnimatePresence>
                {downloadMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1.5 w-64 bg-[#0B0E17] border-2 border-[var(--border-color)] text-white shadow-2xl rounded-xs p-1.5 z-50 flex flex-col gap-1 font-mono text-left"
                  >
                    <div className="px-2 py-1 text-[8.5px] uppercase font-bold tracking-wider text-white/50 border-b border-white/10 flex items-center justify-between">
                      <span>EXPORT FORMAT</span>
                      <span className="text-rose-400">SELECT</span>
                    </div>

                    {/* PDF Format */}
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="flex items-start gap-2 px-2 py-1.5 hover:bg-white/10 rounded-xs text-left transition-colors cursor-pointer group"
                    >
                      <div className="p-1 rounded bg-rose-500/20 text-rose-400 mt-0.5 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white group-hover:text-rose-300 flex items-center justify-between">
                          <span>Download PDF</span>
                          <span className="text-[8.5px] px-1 bg-white/10 rounded-xs text-white/70">3.5" × 2"</span>
                        </div>
                        <div className="text-[9.5px] text-white/60 leading-tight">
                          Print card with <strong className="text-rose-400">clickable links</strong>
                        </div>
                      </div>
                    </button>

                    {/* PNG High-Res */}
                    <button
                      type="button"
                      onClick={handleDownloadPNG}
                      className="flex items-start gap-2 px-2 py-1.5 hover:bg-white/10 rounded-xs text-left transition-colors cursor-pointer group"
                    >
                      <div className="p-1 rounded bg-sky-500/20 text-sky-400 mt-0.5 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white group-hover:text-sky-300 flex items-center justify-between">
                          <span>Download PNG</span>
                          <span className="text-[8.5px] px-1 bg-white/10 rounded-xs text-white/70">300 DPI</span>
                        </div>
                        <div className="text-[9.5px] text-white/60 leading-tight">
                          High-resolution digital image
                        </div>
                      </div>
                    </button>

                    {/* vCard RFC 6350 */}
                    <button
                      type="button"
                      onClick={(e) => handleDownloadVCard(e)}
                      className="flex items-start gap-2 px-2 py-1.5 hover:bg-white/10 rounded-xs text-left transition-colors cursor-pointer group"
                    >
                      <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Contact className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white group-hover:text-emerald-300 flex items-center justify-between">
                          <span>Save vCard (.vcf)</span>
                          <span className="text-[8.5px] px-1 bg-white/10 rounded-xs text-white/70">RFC 6350</span>
                        </div>
                        <div className="text-[9.5px] text-white/60 leading-tight">
                          Direct import to phone contacts
                        </div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Share Icon Button */}
            <button
              type="button"
              onClick={handleShareLink}
              className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/15 rounded-xs font-mono text-[9px] sm:text-[10px] font-bold uppercase transition-all cursor-pointer"
              title="Share portfolio link via native share dialog or copy link"
              aria-label="Share card"
            >
              {copiedLink ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Share2 className="w-3 h-3 text-rose-400" />
              )}
              <span className="hidden sm:inline">{copiedLink ? 'COPIED' : 'SHARE'}</span>
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* 2. MAIN BODY: TWO-SECTION BALANCED LAYOUT (LEFT & RIGHT)                 */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 items-center flex-1">
          {/* ===================================================================== */}
          {/* LEFT SECTION: Small Profile Photo + Identity + Degree + Status        */}
          {/* ===================================================================== */}
          <div className="md:col-span-7 flex flex-col justify-between gap-2.5">
            {/* Top row: Small Profile Photo + Name & Title */}
            <div className="flex items-center gap-3">
              {/* ORIGINAL COVER PHOTO (Clickable with subtle highlight interaction) */}
              <div 
                className="relative shrink-0 cursor-pointer group/photo"
                onClick={handlePhotoClick}
                data-cursor-label="CLICK PHOTO"
                title="Click photo to reveal verified developer identity"
              >
                {/* Neon Pink Glowing Frame for Original Cover Photo */}
                <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-md border-2 border-rose-500 p-0.5 bg-[#0B0E17] shadow-[0_0_18px_rgba(225,29,72,0.45)] transition-all duration-300 relative overflow-hidden ${
                  photoHighlighted ? 'ring-4 ring-rose-400/80 scale-105 shadow-[0_0_24px_rgba(225,29,72,0.9)]' : 'group-hover/photo:border-rose-400 group-hover/photo:shadow-[0_0_22px_rgba(225,29,72,0.7)]'
                }`}>
                  <img
                    src="/assets/aistudio/Screenshot_2026-11-02_190928_c0d676b5.png"
                    alt="Yogananth J Original Cover Photo"
                    className="w-full h-full object-contain rounded-xs group-hover/photo:scale-104 transition-transform duration-300"
                    loading="eager"
                  />

                  {/* Interactive hover cue on photo: CLICK TO REVEAL */}
                  <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-center p-1 pointer-events-none">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse mb-0.5" />
                    <span className="text-[7.5px] font-mono font-black text-white tracking-wider uppercase leading-tight">
                      CLICK TO
                    </span>
                    <span className="text-[7px] font-mono text-rose-300 tracking-tight uppercase">
                      REVEAL
                    </span>
                  </div>
                </div>

                {/* Online Indicator Badge */}
                <div className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-emerald-500 text-black text-[7px] font-mono font-black uppercase rounded-xs tracking-tight shadow-xs flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-black animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Name & Title */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-lg sm:text-xl font-black text-white tracking-tight leading-tight truncate">
                    Yogananth J
                  </h3>
                  <span title="Verified AI Engineer">
                    <CheckCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono text-[9px] sm:text-[10px] font-bold text-rose-400 uppercase tracking-tight mt-0.5">
                  <Cpu className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="truncate">AI Engineer · Full-Stack Developer</span>
                </div>

                {/* Small Click to Reveal instruction tag beside photo */}
                <div 
                  onClick={handlePhotoClick}
                  className="inline-flex items-center gap-1 text-[7.5px] sm:text-[8px] font-mono text-rose-400/80 hover:text-rose-300 font-semibold uppercase tracking-wider mt-1 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-2.5 h-2.5 text-rose-400" />
                  <span>{photoRevealedInfo ? 'VERIFIED PASS ACTIVE' : 'CLICK PHOTO TO REVEAL'}</span>
                </div>
              </div>
            </div>

            {/* Degree / Qualification Section */}
            <div className="font-mono text-[8.5px] sm:text-[9.5px] text-white/80 leading-snug border-l-2 border-rose-500/70 pl-2 py-0.5 bg-white/[0.02]">
              <span className="text-white/45 block text-[7px] uppercase font-bold tracking-wider">Qualification</span>
              B.Tech in Artificial Intelligence &amp; Data Science / ML
            </div>

            {/* Open to Opportunities Status */}
            <div className="flex items-center">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs text-[8px] sm:text-[8.5px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="uppercase tracking-wider text-emerald-300 font-semibold">
                  Open to Opportunities
                </span>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT SECTION: Contact Channels (Email, LinkedIn, GitHub, Loc) + QR   */}
          {/* ===================================================================== */}
          <div className="md:col-span-5 flex flex-col justify-between gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-2.5 md:pt-0 md:pl-3.5">
            {/* Direct Contact Links */}
            <div className="flex flex-col gap-1.5 font-mono text-[8.5px] sm:text-[9px]">
              {/* Email with 1-click copy */}
              <div 
                onClick={handleCopyEmail}
                className="flex items-center justify-between px-2 py-1 bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 rounded-xs transition-colors cursor-pointer group/link"
                title="Click to copy email address"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="truncate text-white/90 group-hover/link:text-white">mjyogananth@gmail.com</span>
                </div>
                {copiedEmail ? (
                  <Check className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />
                ) : (
                  <Copy className="w-2.5 h-2.5 text-white/40 group-hover/link:text-rose-400 shrink-0 ml-1" />
                )}
              </div>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/yogananth-j-653400307/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-2 py-1 bg-white/5 hover:bg-sky-500/15 border border-white/10 hover:border-sky-500/40 rounded-xs transition-colors cursor-pointer group/link"
                title="Visit LinkedIn Profile"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Linkedin className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="truncate text-white/90 group-hover/link:text-white">linkedin.com/in/yogananth-j</span>
                </div>
                <ExternalLink className="w-2.5 h-2.5 text-white/40 group-hover/link:text-sky-400 shrink-0 ml-1" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/YogananthJ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-2 py-1 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-xs transition-colors cursor-pointer group/link"
                title="Visit GitHub Repositories"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Github className="w-3 h-3 text-white shrink-0" />
                  <span className="truncate text-white/90 group-hover/link:text-white">github.com/YogananthJ</span>
                </div>
                <ExternalLink className="w-2.5 h-2.5 text-white/40 group-hover/link:text-white shrink-0 ml-1" />
              </a>

              {/* Location */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 text-white/60 text-[8px] sm:text-[8.5px]">
                <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                <span className="truncate">Gobichettipalayam, Erode, TN, IN</span>
              </div>
            </div>

            {/* Portfolio QR Code + Quick vCard Download */}
            <div className="flex items-center justify-between gap-2 bg-black/40 border border-white/10 rounded-xs p-1.5">
              <div className="flex items-center gap-2">
                <div className="p-0.5 bg-white rounded-xs shrink-0 shadow-xs">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="Portfolio QR Code" 
                      className="w-10 h-10 sm:w-11 sm:h-11"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-gray-100 text-black">
                      <QrIcon className="w-5 h-5 animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[7px] sm:text-[7.5px] uppercase tracking-wider text-white/80 font-bold">
                    SCAN PORTFOLIO
                  </span>
                  <span className="font-mono text-[6.5px] text-rose-400">
                    iam-mjyogananth.pages.dev
                  </span>
                </div>
              </div>

              {/* Quick Save vCard button */}
              <button
                type="button"
                onClick={(e) => handleDownloadVCard(e)}
                className="flex items-center gap-1 px-1.5 py-1 bg-rose-500/20 hover:bg-rose-500 border border-rose-500/40 text-rose-300 hover:text-white font-mono text-[7px] sm:text-[7.5px] uppercase font-bold rounded-xs transition-colors cursor-pointer shrink-0"
                title="Save RFC 6350 contact file (.vcf)"
              >
                <Contact className="w-2.5 h-2.5" />
                <span>SAVE VCARD</span>
              </button>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* 3. FOOTER BAR INSIDE THE CARD                                            */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 mt-3 font-mono text-[7.5px] sm:text-[8px] text-white/50">
          <span className="truncate">RFC 6350 COMPLIANT · AI &amp; AUTOMATION</span>
          <a
            href="https://iam-mjyogananth.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-400 hover:text-rose-300 font-bold tracking-wider uppercase transition-colors"
          >
            iam-mjyogananth.pages.dev
          </a>
        </div>
      </div>

      {/* Floating Action Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0B0E17] text-white border-2 border-rose-500 px-4 py-2.5 rounded-xs shadow-2xl flex items-center gap-2.5 font-mono text-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* HIDDEN OFFSCREEN RENDER CHASSIS (For Clean PDF & PNG Export)              */}
      {/* ========================================================================= */}
      <div 
        aria-hidden="true" 
        className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-100"
        style={{ width: '960px' }}
      >
        <div
          ref={printCardRef}
          style={{ width: '560px', height: '320px' }}
          className="relative bg-[#0B0E17] text-white p-5 flex flex-col justify-between overflow-hidden border-2 border-rose-500 rounded-lg"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-2">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              DIGITAL VISITING CARD · 2026
            </div>
            <div className="font-mono text-[10px] text-rose-400 font-bold">
              ID: YJ-AIML-882
            </div>
          </div>

          {/* Body */}
          <div className="relative z-10 grid grid-cols-12 gap-3.5 flex-1 items-center py-2">
            {/* Left */}
            <div className="col-span-7 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-md border-2 border-rose-500 p-0.5 bg-[#0B0E17] shrink-0 overflow-hidden">
                  <img
                    src="/assets/aistudio/Screenshot_2026-11-02_190928_c0d676b5.png"
                    alt="Original Cover Photo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-black text-white tracking-tight leading-tight">
                    Yogananth J
                  </h3>
                  <div className="font-mono text-[10px] font-bold text-rose-400 uppercase mt-0.5">
                    AI Engineer · Full-Stack Developer
                  </div>
                  <div className="font-mono text-[9px] text-white/80 mt-1 border-l-2 border-rose-500 pl-2">
                    B.Tech in Artificial Intelligence &amp; Data Science / ML
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs text-[8px] font-mono text-emerald-300 font-bold uppercase w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Open to Opportunities
              </div>
            </div>

            {/* Right */}
            <div className="col-span-5 flex flex-col justify-between gap-1.5 border-l border-white/15 pl-3 font-mono text-[9px]">
              <div className="flex items-center gap-1.5 text-white/90">
                <Mail className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="truncate">mjyogananth@gmail.com</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/90">
                <Linkedin className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="truncate">linkedin.com/in/yogananth-j</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/90">
                <Github className="w-3 h-3 text-white shrink-0" />
                <span className="truncate">github.com/YogananthJ</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60 text-[8px]">
                <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                <span className="truncate">Gobichettipalayam, Erode, TN</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="p-0.5 bg-white rounded-xs">
                  {qrCodeUrl && <img src={qrCodeUrl} alt="QR" className="w-8 h-8" />}
                </div>
                <span className="text-[7px] text-white/70">SCAN PORTFOLIO</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2 font-mono text-[8px] text-white/60">
            <span>RFC 6350 COMPLIANT · AI &amp; AUTOMATION</span>
            <span className="text-rose-400">iam-mjyogananth.pages.dev</span>
          </div>
        </div>
      </div>
    </div>
  );
};
