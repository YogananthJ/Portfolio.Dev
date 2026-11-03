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
  CheckCircle,
  RotateCw
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface DigitalVisitingCardProps {
  className?: string;
}

export const DigitalVisitingCard: React.FC<DigitalVisitingCardProps> = ({ className = '' }) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<boolean>(false);
  const [exportingType, setExportingType] = useState<'pdf' | 'png' | 'vcf' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const bottomDropdownRef = useRef<HTMLDivElement | null>(null);
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

  // Keyboard shortcut: Press 'f' or 'F' to toggle card flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') return;
        setIsFlipped((prev) => !prev);
        try {
          soundFX?.playClick?.(620, 0.04);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close download dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        bottomDropdownRef.current && !bottomDropdownRef.current.contains(target)
      ) {
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

  // Flip Toggle Handler
  const handleToggleFlip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFlipped((prev) => !prev);
    try {
      soundFX?.playClick?.(640, 0.04);
    } catch {
      // ignore
    }
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
    <div className={`flex flex-col items-center select-none w-full max-w-[440px] sm:max-w-[460px] md:max-w-[480px] mx-auto ${className}`}>
      {/* ========================================================================= */}
      {/* 3D FLIP CONTAINER: Front (Square Photo Cover) <-> Back (Digital V-Card)     */}
      {/* ========================================================================= */}
      <div 
        className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] md:w-[390px] md:h-[390px]"
        style={{ perspective: 1200 }}
      >
        <div
          className="w-full h-full relative transition-transform duration-700 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* ===================================================================== */}
          {/* FRONT SIDE: SQUARE PHOTO COVER (Collectible Physical ID Card Look)    */}
          {/* Centered character on clean white background with badges & borders    */}
          {/* ===================================================================== */}
          <div
            onClick={handleToggleFlip}
            className="absolute inset-0 w-full h-full cursor-pointer group"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
            title="Click photo to flip to digital visiting card"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleFlip();
              }
            }}
          >
            {/* The Square Physical Collectible Card */}
            <div className="relative w-full h-full rounded-xl bg-white border-[3.5px] border-black shadow-[8px_8px_0px_#000000] ring-2 ring-rose-500/80 group-hover:shadow-[12px_12px_0px_#000000] group-hover:scale-[1.01] transition-all duration-300 overflow-hidden flex flex-col justify-between">
              {/* Subtle collectible grid background pattern */}
              <div 
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#94a3b8 1.2px, transparent 1.2px)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* TOP RIGHT: Pink "AI & WEB DEV" Badge */}
              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30">
                <span className="inline-block bg-[#E11D48] text-white font-mono font-black text-[9.5px] sm:text-[11px] px-2.5 sm:px-3 py-1 border-2 border-black tracking-widest uppercase shadow-[2px_2px_0px_#000000]">
                  AI &amp; WEB DEV
                </span>
              </div>

              {/* TOP LEFT: "✨ CLICK TO FLIP" Dark Badge */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-30">
                <span className="inline-flex items-center gap-1.5 bg-[#1F2128] text-white font-mono font-bold text-[8.5px] sm:text-[9.5px] px-2.5 py-1 border border-white/20 tracking-wider uppercase rounded-xs shadow-md group-hover:bg-black transition-colors">
                  <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                  <span>CLICK TO FLIP</span>
                </span>
              </div>

              {/* CENTER: Exact Character Illustration (/assets/aistudio/favicon_507da8ac.png) */}
              <div className="relative z-10 w-full flex-1 flex items-end justify-center px-4 pt-10 pb-8 overflow-hidden">
                <img
                  src="/assets/aistudio/favicon_507da8ac.png"
                  alt="Yogananth J Character Illustration"
                  className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-md select-none group-hover:scale-103 transition-transform duration-300"
                  loading="eager"
                />
              </div>

              {/* BOTTOM: "OPEN TO OPPORTUNITIES" White Banner */}
              <div className="absolute bottom-2.5 left-3.5 right-3.5 sm:bottom-3 sm:left-5 sm:right-5 z-30">
                <div className="w-full bg-white text-black font-mono font-black text-[9.5px] sm:text-[11px] py-1.5 px-3 border-2 border-black tracking-widest text-center uppercase shadow-[2.5px_2.5px_0px_#000000] flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>OPEN TO OPPORTUNITIES</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* BACK SIDE: EXISTING DIGITAL VISITING CARD (Full Contact & QR Details)  */}
          {/* ===================================================================== */}
          <div
            className="absolute inset-0 w-full h-full rounded-xl border-2 border-rose-500/85 bg-[#0B0E17]/98 text-white p-3 sm:p-3.5 flex flex-col justify-between shadow-[8px_8px_0px_0px_var(--border-color)] overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Subtle Tech Grid Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none rounded-xl" />
            
            {/* Ambient Neon Rose Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-600/15 rounded-full blur-2xl pointer-events-none" />

            {/* ------------------------------------------------------------------- */}
            {/* 1. TOP HEADER: Status Ping + ID + FLIP BACK BUTTON + ACTION ICONS   */}
            {/* ------------------------------------------------------------------- */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="font-mono text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-white flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-rose-500" />
                  <span>VISITING CARD</span>
                </span>
              </div>

              {/* Right Controls in Back Card */}
              <div className="flex items-center gap-1.5">
                {/* Flip back button */}
                <button
                  type="button"
                  onClick={handleToggleFlip}
                  className="flex items-center gap-1 px-1.5 py-0.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 rounded-xs font-mono text-[8px] sm:text-[8.5px] font-bold uppercase transition-colors cursor-pointer"
                  title="Flip back to profile photo cover [F]"
                >
                  <RotateCw className="w-2.5 h-2.5" />
                  <span>SHOW PHOTO [F]</span>
                </button>

                {/* In-Card Download Icon Button with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDownloadMenuOpen((prev) => !prev)}
                    disabled={exportingType !== null}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/15 rounded-xs font-mono text-[8px] sm:text-[8.5px] font-bold uppercase transition-all cursor-pointer"
                    title="Download Card (PDF, PNG, vCard)"
                    aria-label="Download options"
                  >
                    {exportingType ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin text-rose-400" />
                    ) : (
                      <Download className="w-2.5 h-2.5 text-rose-400" />
                    )}
                    <ChevronDown className={`w-2 h-2 transition-transform duration-200 ${downloadMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {downloadMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-1.5 w-60 bg-[#0B0E17] border-2 border-[var(--border-color)] text-white shadow-2xl rounded-xs p-1.5 z-50 flex flex-col gap-1 font-mono text-left"
                      >
                        <div className="px-2 py-1 text-[8px] uppercase font-bold tracking-wider text-white/50 border-b border-white/10 flex items-center justify-between">
                          <span>EXPORT FORMAT</span>
                          <span className="text-rose-400">SELECT</span>
                        </div>

                        {/* PDF */}
                        <button
                          type="button"
                          onClick={handleDownloadPDF}
                          className="flex items-start gap-2 px-2 py-1.5 hover:bg-white/10 rounded-xs text-left transition-colors cursor-pointer group"
                        >
                          <div className="p-1 rounded bg-rose-500/20 text-rose-400 mt-0.5 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                            <FileText className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-white group-hover:text-rose-300 flex items-center justify-between">
                              <span>Download PDF</span>
                              <span className="text-[7.5px] px-1 bg-white/10 rounded-xs text-white/70">3.5" × 2"</span>
                            </div>
                            <div className="text-[8.5px] text-white/60 leading-tight">
                              Print card with active links
                            </div>
                          </div>
                        </button>

                        {/* PNG */}
                        <button
                          type="button"
                          onClick={handleDownloadPNG}
                          className="flex items-start gap-2 px-2 py-1.5 hover:bg-white/10 rounded-xs text-left transition-colors cursor-pointer group"
                        >
                          <div className="p-1 rounded bg-sky-500/20 text-sky-400 mt-0.5 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                            <ImageIcon className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-white group-hover:text-sky-300 flex items-center justify-between">
                              <span>Download PNG</span>
                              <span className="text-[7.5px] px-1 bg-white/10 rounded-xs text-white/70">300 DPI</span>
                            </div>
                            <div className="text-[8.5px] text-white/60 leading-tight">
                              High-resolution digital image
                            </div>
                          </div>
                        </button>

                        {/* vCard */}
                        <button
                          type="button"
                          onClick={(e) => handleDownloadVCard(e)}
                          className="flex items-start gap-2 px-2 py-1.5 hover:bg-white/10 rounded-xs text-left transition-colors cursor-pointer group"
                        >
                          <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <Contact className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-white group-hover:text-emerald-300 flex items-center justify-between">
                              <span>Save vCard (.vcf)</span>
                              <span className="text-[7.5px] px-1 bg-white/10 rounded-xs text-white/70">RFC 6350</span>
                            </div>
                            <div className="text-[8.5px] text-white/60 leading-tight">
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
                  className="flex items-center gap-1 p-1 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/15 rounded-xs transition-colors cursor-pointer"
                  title="Share portfolio link"
                  aria-label="Share card"
                >
                  {copiedLink ? (
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  ) : (
                    <Share2 className="w-2.5 h-2.5 text-rose-400" />
                  )}
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* 2. BODY CONTENT: PROFILE THUMBNAIL + DETAILS + CHANNELS + QR CODE   */}
            {/* ------------------------------------------------------------------- */}
            <div className="relative z-10 flex-1 flex flex-col justify-between gap-1.5 py-0.5">
              {/* Profile Identity Bar: Character Avatar Thumbnail + Name & Title */}
              <div className="flex items-center gap-2.5">
                {/* Character Thumbnail (Clean white bg + rose border) */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md border-2 border-rose-500 bg-white p-0.5 shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                  <img
                    src="/assets/aistudio/favicon_507da8ac.png"
                    alt="Yogananth J Avatar"
                    className="w-full h-full object-contain object-bottom"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-base sm:text-lg font-black text-white tracking-tight leading-tight truncate">
                      Yogananth J
                    </h3>
                    <span title="Verified AI Engineer">
                      <CheckCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[8px] sm:text-[9px] font-bold text-rose-400 uppercase tracking-tight">
                    <Cpu className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                    <span className="truncate">AI Engineer · Full-Stack Developer</span>
                  </div>
                  <div className="font-mono text-[7px] sm:text-[8px] text-white/70 truncate mt-0.5">
                    B.Tech in Artificial Intelligence &amp; Data Science / ML
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center">
                <div className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/30 rounded-xs text-[7.5px] sm:text-[8px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="uppercase tracking-wider text-emerald-300 font-semibold">
                    Open to Opportunities
                  </span>
                </div>
              </div>

              {/* Contact Channels Grid */}
              <div className="grid grid-cols-2 gap-1 font-mono text-[7.5px] sm:text-[8.5px]">
                {/* Email with copy */}
                <div 
                  onClick={handleCopyEmail}
                  className="flex items-center justify-between px-1.5 py-1 bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 rounded-xs transition-colors cursor-pointer group/link min-w-0"
                  title="Click to copy email address"
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <Mail className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                    <span className="truncate text-white/90">mjyogananth@...</span>
                  </div>
                  {copiedEmail ? (
                    <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="w-2 h-2 text-white/40 group-hover/link:text-rose-400 shrink-0" />
                  )}
                </div>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/yogananth-j-653400307/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-1.5 py-1 bg-white/5 hover:bg-sky-500/15 border border-white/10 hover:border-sky-500/40 rounded-xs transition-colors cursor-pointer group/link min-w-0"
                  title="Visit LinkedIn Profile"
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <Linkedin className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                    <span className="truncate text-white/90">LinkedIn</span>
                  </div>
                  <ExternalLink className="w-2 h-2 text-white/40 group-hover/link:text-sky-400 shrink-0" />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/YogananthJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-1.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-xs transition-colors cursor-pointer group/link min-w-0"
                  title="Visit GitHub Repositories"
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <Github className="w-2.5 h-2.5 text-white shrink-0" />
                    <span className="truncate text-white/90">GitHub</span>
                  </div>
                  <ExternalLink className="w-2 h-2 text-white/40 group-hover/link:text-white shrink-0" />
                </a>

                {/* Location */}
                <div className="flex items-center gap-1 px-1.5 py-1 bg-white/5 border border-white/10 rounded-xs text-white/70 min-w-0">
                  <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                  <span className="truncate">Tamil Nadu, IN</span>
                </div>
              </div>

              {/* QR Code Bar + Direct Save vCard */}
              <div className="flex items-center justify-between gap-2 bg-black/50 border border-white/10 rounded-xs p-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-0.5 bg-white rounded-xs shrink-0">
                    {qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="Portfolio QR Code" 
                        className="w-8 h-8 sm:w-9 sm:h-9"
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-black">
                        <QrIcon className="w-4 h-4 animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="font-mono text-[6.5px] sm:text-[7px] uppercase tracking-wider text-white/90 font-bold truncate">
                      SCAN PORTFOLIO
                    </span>
                    <span className="font-mono text-[6px] sm:text-[6.5px] text-rose-400 truncate">
                      iam-mjyogananth.pages.dev
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDownloadVCard(e)}
                  className="flex items-center gap-1 px-1.5 py-1 bg-rose-500/20 hover:bg-rose-500 border border-rose-500/40 text-rose-300 hover:text-white font-mono text-[6.5px] sm:text-[7px] uppercase font-bold rounded-xs transition-colors cursor-pointer shrink-0"
                  title="Save RFC 6350 contact file (.vcf)"
                >
                  <Contact className="w-2.5 h-2.5" />
                  <span>SAVE VCARD</span>
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* 3. FOOTER BAR INSIDE BACK CARD                                      */}
            {/* ------------------------------------------------------------------- */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-1.5 font-mono text-[7px] sm:text-[7.5px] text-white/50">
              <span className="truncate">RFC 6350 · AI &amp; AUTOMATION</span>
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
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXACT 3 BUTTONS BELOW THE CARD: SHOW BACK/FRONT, DOWNLOAD CARD, SHARE     */}
      {/* ========================================================================= */}
      <div className="w-full flex items-center justify-center gap-2 mt-4 font-mono">
        {/* 1. SHOW BACK / SHOW FRONT Button */}
        <button
          type="button"
          onClick={handleToggleFlip}
          className="flex-1 max-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 bg-black/80 hover:bg-rose-500 text-white border-2 border-black hover:border-rose-400 rounded-xs text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          title="Toggle between photo cover and visiting card [Shortcut: F]"
        >
          <RotateCw className="w-3 h-3 text-rose-400 group-hover:text-white" />
          <span>{isFlipped ? 'SHOW FRONT [F]' : 'SHOW BACK [F]'}</span>
        </button>

        {/* 2. DOWNLOAD CARD Dropdown Button */}
        <div className="relative flex-1 max-w-[140px]" ref={bottomDropdownRef}>
          <button
            type="button"
            onClick={() => setDownloadMenuOpen((prev) => !prev)}
            disabled={exportingType !== null}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-2 bg-black/80 hover:bg-rose-500 text-white border-2 border-black hover:border-rose-400 rounded-xs text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            title="Download Card in PDF, PNG, or vCard format"
          >
            {exportingType ? (
              <Loader2 className="w-3 h-3 animate-spin text-rose-400" />
            ) : (
              <Download className="w-3 h-3 text-rose-400" />
            )}
            <span>DOWNLOAD</span>
            <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${downloadMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Bottom Dropdown Menu */}
          <AnimatePresence>
            {downloadMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 bottom-full mb-2 w-64 bg-[#0B0E17] border-2 border-[var(--border-color)] text-white shadow-2xl rounded-xs p-1.5 z-50 flex flex-col gap-1 font-mono text-left"
              >
                <div className="px-2 py-1 text-[8.5px] uppercase font-bold tracking-wider text-white/50 border-b border-white/10 flex items-center justify-between">
                  <span>CHOOSE FORMAT</span>
                  <span className="text-rose-400">EXPORT</span>
                </div>

                {/* PDF */}
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
                      Print format with clickable hyperlinks
                    </div>
                  </div>
                </button>

                {/* PNG */}
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
                      Ultra clear high-resolution image
                    </div>
                  </div>
                </button>

                {/* vCard */}
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
                      Import directly to smartphone contacts
                    </div>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. SHARE LINK Button */}
        <button
          type="button"
          onClick={handleShareLink}
          className="flex-1 max-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 bg-black/80 hover:bg-rose-500 text-white border-2 border-black hover:border-rose-400 rounded-xs text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          title="Share portfolio link via native share dialog or copy to clipboard"
        >
          {copiedLink ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3 h-3 text-rose-400" />
              <span>SHARE LINK</span>
            </>
          )}
        </button>
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
                <div className="w-20 h-20 rounded-md border-2 border-rose-500 p-0.5 bg-white shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src="/assets/aistudio/favicon_507da8ac.png"
                    alt="Character Avatar"
                    className="w-full h-full object-contain object-bottom"
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
