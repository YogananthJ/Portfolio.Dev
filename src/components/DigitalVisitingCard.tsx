import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Mail, 
  Linkedin, 
  Github,
  Globe, 
  MapPin, 
  RotateCcw, 
  Cpu, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles,
  ArrowRight,
  Download,
  FileText,
  Image as ImageIcon,
  Contact,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  QrCode as QrIcon,
  Loader2
} from 'lucide-react';

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

  const prefersReducedMotion = useReducedMotion();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const printFrontRef = useRef<HTMLDivElement | null>(null);
  const printBackRef = useRef<HTMLDivElement | null>(null);

  // Generate scannable QR Code on mount
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL('https://iam-mjyogananth.pages.dev', {
      width: 220,
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

  // Keyboard shortcut: Press 'f' or 'F' to flip card when active
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      setIsFlipped((prev) => !prev);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2800);
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('mjyogananth@gmail.com');
    setCopiedEmail(true);
    showToast('Email copied to clipboard: mjyogananth@gmail.com');
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleCopyPortfolioLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('https://iam-mjyogananth.pages.dev');
    setCopiedLink(true);
    showToast('Portfolio link copied: https://iam-mjyogananth.pages.dev');
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // 1. Export as Standard Business Card PDF (3.5" × 2" format, 2-page Front & Back)
  const handleDownloadPDF = async () => {
    try {
      setExportingType('pdf');
      setDownloadMenuOpen(false);

      if (!printFrontRef.current || !printBackRef.current) {
        throw new Error('Export elements not ready');
      }

      // Capture front side at high resolution
      const frontCanvas = await html2canvas(printFrontRef.current, {
        scale: 2.5,
        backgroundColor: '#0A0D14',
        useCORS: true,
        logging: false
      });

      // Capture back side at high resolution
      const backCanvas = await html2canvas(printBackRef.current, {
        scale: 2.5,
        backgroundColor: '#0A0D14',
        useCORS: true,
        logging: false
      });

      // Standard landscape business card: 3.5 inches x 2.0 inches (88.9 mm x 50.8 mm)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2.0]
      });

      const frontImgData = frontCanvas.toDataURL('image/png');
      pdf.addImage(frontImgData, 'PNG', 0, 0, 3.5, 2.0);

      // Add back page
      pdf.addPage([3.5, 2.0], 'landscape');
      const backImgData = backCanvas.toDataURL('image/png');
      pdf.addImage(backImgData, 'PNG', 0, 0, 3.5, 2.0);

      pdf.save('Yogananth_J_Visiting_Card.pdf');
      showToast('Downloaded PDF (Front & Back 3.5" × 2")');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('Failed to export PDF');
    } finally {
      setExportingType(null);
    }
  };

  // 2. Export as High-Resolution PNG
  const handleDownloadPNG = async (side: 'current' | 'front' | 'back' = 'current') => {
    try {
      setExportingType('png');
      setDownloadMenuOpen(false);

      const targetRef = 
        side === 'front' 
          ? printFrontRef.current 
          : side === 'back' 
          ? printBackRef.current 
          : isFlipped ? printBackRef.current : printFrontRef.current;

      if (!targetRef) throw new Error('Target element not ready');

      const canvas = await html2canvas(targetRef, {
        scale: 3,
        backgroundColor: '#0A0D14',
        useCORS: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `Yogananth_J_Visiting_Card_${isFlipped ? 'Back' : 'Front'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('Downloaded high-resolution PNG');
    } catch (err) {
      console.error('PNG export failed:', err);
      showToast('Failed to export PNG');
    } finally {
      setExportingType(null);
    }
  };

  // 3. Export as RFC 6350 vCard (.vcf)
  const handleDownloadVCard = () => {
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
        'NOTE:B.Tech in Artificial Intelligence and Machine Learning | Specializing in Multi-Agent Orchestration, Hybrid Vector RAG, and Modern Full-Stack Platforms.',
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

      showToast('Saved vCard contact (Yogananth_J_Contact.vcf)');
    } catch (err) {
      console.error('vCard export failed:', err);
      showToast('Failed to export contact file');
    } finally {
      setExportingType(null);
    }
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* ========================================================================= */}
      {/* 3D ROTATING VISITING CARD CONTAINER                                      */}
      {/* Both Front and Back faces share identical landscape dimensions (no jump) */}
      {/* ========================================================================= */}
      <div 
        className="relative w-full max-w-[430px] sm:max-w-[460px] aspect-[1.65/1]"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.1 }
              : { type: 'spring', stiffness: 220, damping: 22, mass: 0.8 }
          }
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full h-full cursor-pointer focus:outline-hidden"
          onClick={() => setIsFlipped((prev) => !prev)}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-expanded={isFlipped}
          aria-label={isFlipped ? 'Digital visiting card back side. Click or press Space to flip to front.' : 'Digital visiting card front side. Click or press Space to flip to back.'}
        >
          {/* ========================================================================= */}
          {/* FRONT FACE: Identity & Credentials (Cyberpunk Dark Glass Aesthetics)     */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-md border-2 border-[var(--border-color)] bg-[#0B0E17]/95 text-white p-3.5 sm:p-4.5 flex flex-col justify-between overflow-hidden shadow-[8px_8px_0px_0px_var(--border-color)] hover:shadow-[10px_10px_0px_0px_var(--border-color)] transition-shadow group"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
            {/* Background Dotted Matrix & Subtle Corner Crosshairs */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff14_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
            <div className="absolute top-1.5 left-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>
            <div className="absolute top-1.5 right-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>
            <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>
            <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>

            {/* Glowing Accent Ambient Gradient Edge */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-600/15 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-600/25 transition-colors duration-500" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-600/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Bar: Identity Pill + Chip Icon + Card ID */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-rose-500" />
                  VERIFIED DIGITAL ID · 2026
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[8.5px] sm:text-[9.5px] text-white/50">
                <span className="hidden sm:inline text-rose-400 font-semibold tracking-wider">SECURE PASS</span>
                <span className="px-1.5 py-0.5 rounded-xs bg-white/5 border border-white/10 font-bold text-white/80">
                  ID: YJ-AIML-882
                </span>
              </div>
            </div>

            {/* Middle Section: Avatar + Name + Title + Qualifications */}
            <div className="relative z-10 flex items-center gap-3 sm:gap-4 my-auto py-1">
              {/* Profile Avatar with Tech Border & Status Ring */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-19 sm:h-19 rounded-md border-2 border-rose-500/60 p-0.5 bg-black/60 shadow-[0_0_15px_rgba(225,29,72,0.25)] group-hover:border-rose-400 transition-colors">
                  <img
                    src="/assets/aistudio/favicon_507da8ac.png"
                    alt="Yogananth J"
                    className="w-full h-full object-cover rounded-xs"
                    loading="eager"
                  />
                </div>
                {/* Micro tech status badge */}
                <div className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-emerald-500 text-black text-[7.5px] font-mono font-black uppercase rounded-xs tracking-tighter">
                  ACTIVE
                </div>
              </div>

              {/* Identity Typography */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-base sm:text-xl font-black text-white tracking-tight leading-tight truncate">
                    Yogananth J
                  </h3>
                  <span className="text-[10px] text-rose-400 font-bold hidden sm:inline" title="Verified Creator">
                    ✓
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono text-[9px] sm:text-[10.5px] font-bold text-rose-400 uppercase tracking-tight mt-0.5">
                  <Cpu className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="truncate">AI Engineer · Full-Stack Developer</span>
                </div>

                <div className="font-mono text-[8px] sm:text-[9px] text-white/70 leading-snug mt-1 border-l-2 border-rose-500/70 pl-2">
                  <span className="text-white/40 block text-[7px] uppercase font-bold tracking-wider">Qualification</span>
                  B.Tech in Artificial Intelligence &amp; Data Science / ML
                </div>
              </div>
            </div>

            {/* Bottom Bar: Availability Status + Flip CTA Cue */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[8px] sm:text-[9px]">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="uppercase tracking-wider text-emerald-300 font-semibold text-[8px] sm:text-[8.5px]">
                  Open to Opportunities
                </span>
              </div>

              <div className="flex items-center gap-1 text-rose-400 font-bold group-hover:text-rose-300 transition-colors">
                <RotateCcw className="w-3 h-3 animate-spin [animation-duration:8s]" />
                <span className="uppercase tracking-wider">Flip for QR &amp; Links</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BACK FACE: Real Scannable QR Code + Direct Contact Channels               */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-md border-2 border-[var(--border-color)] bg-[#0A0D15]/98 text-white p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden shadow-[8px_8px_0px_0px_var(--border-color)] hover:shadow-[10px_10px_0px_0px_var(--border-color)] transition-shadow"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Background grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

            {/* Header: Title + Flip Back Trigger */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-1.5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/90">
                  CONNECT &amp; SCAN CHANNELS
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-white/80 hover:text-rose-400 text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                title="Flip back to front face"
              >
                <RotateCcw className="w-2.5 h-2.5 text-rose-500" />
                <span>Front Face</span>
              </button>
            </div>

            {/* Dual Grid: Links on Left, Real Scannable QR on Right */}
            <div className="relative z-10 grid grid-cols-12 gap-2.5 sm:gap-3 flex-1 items-center py-1 min-h-0">
              {/* Left Column (col-span-7): Direct Channels */}
              <div className="col-span-7 flex flex-col justify-between gap-1 sm:gap-1.5 h-full py-0.5">
                {/* 1. Email with Copy Button */}
                <div className="flex items-center justify-between px-2 py-1 bg-white/5 border border-white/10 hover:border-rose-500/50 rounded-xs transition-colors group/item">
                  <a
                    href="mailto:mjyogananth@gmail.com"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-white/95 group-hover/item:text-rose-400 transition-colors truncate"
                    title="Send email to mjyogananth@gmail.com"
                  >
                    <Mail className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="truncate">mjyogananth@gmail.com</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 hover:text-rose-400 text-white/50 hover:bg-white/10 rounded-xs transition-colors shrink-0 ml-1 cursor-pointer"
                    title="Copy email address"
                    aria-label="Copy email"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                {/* 2. LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/yogananth-j-653400307/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between px-2 py-1 bg-white/5 border border-white/10 hover:border-rose-500/50 rounded-xs transition-colors group/item"
                  title="Open LinkedIn"
                >
                  <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-white/95 group-hover/item:text-rose-400 transition-colors truncate">
                    <Linkedin className="w-3 h-3 text-sky-400 shrink-0" />
                    <span className="truncate">linkedin.com/in/yogananth-j</span>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-white/40 group-hover/item:text-white/80 shrink-0 ml-1" />
                </a>

                {/* 3. GitHub Profile */}
                <a
                  href="https://github.com/YogananthJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between px-2 py-1 bg-white/5 border border-white/10 hover:border-rose-500/50 rounded-xs transition-colors group/item"
                  title="Open GitHub"
                >
                  <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-white/95 group-hover/item:text-rose-400 transition-colors truncate">
                    <Github className="w-3 h-3 text-white shrink-0" />
                    <span className="truncate">github.com/YogananthJ</span>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-white/40 group-hover/item:text-white/80 shrink-0 ml-1" />
                </a>

                {/* 4. Location Badge */}
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-xs font-mono text-[8.5px] sm:text-[9px] text-white/80 truncate">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="truncate">Gobichettipalayam, Erode, TN</span>
                </div>
              </div>

              {/* Right Column (col-span-5): Real Scannable QR Code */}
              <div 
                className="col-span-5 flex flex-col items-center justify-center p-2 bg-[#0D111A] border border-white/15 rounded-sm relative group/qr h-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Futuristic corner brackets */}
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-rose-500" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-rose-500" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-rose-500" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-rose-500" />

                {qrCodeUrl ? (
                  <div className="relative">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code for https://iam-mjyogananth.pages.dev"
                      className="w-20 h-20 sm:w-22 sm:h-22 object-contain rounded-xs border border-white/20 p-0.5 bg-black"
                    />
                    {/* Small center accent pip */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-3 h-3 bg-rose-600 rounded-xs flex items-center justify-center shadow-xs">
                        <span className="text-[7px] font-bold text-white font-mono">Y</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-22 sm:h-22 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
                  </div>
                )}

                <div className="mt-1 flex items-center gap-1 font-mono text-[7.5px] sm:text-[8px] uppercase tracking-wider text-rose-400 font-bold">
                  <QrIcon className="w-2.5 h-2.5 text-rose-500" />
                  <span>Scan to Visit</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Live portfolio URL */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-1.5 font-mono text-[8px] sm:text-[8.5px] text-white/60">
              <span className="flex items-center gap-1 text-white/80 truncate">
                <Globe className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                iam-mjyogananth.pages.dev
              </span>
              <span className="text-rose-400 font-bold shrink-0">
                CLICK TO FLIP FRONT
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* CARD INTERACTIVE TOOLBAR (Flip toggle + Multi-format Export System)       */}
      {/* ========================================================================= */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 relative z-30">
        {/* 1. Quick Flip Button */}
        <button
          type="button"
          onClick={() => setIsFlipped((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--border-color)]/20 text-[var(--text-main)] border-2 border-[var(--border-color)] font-mono text-xs font-bold uppercase tracking-wider rounded-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
          title="Flip visiting card [Hotkey: F or Space]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
          <span>{isFlipped ? 'Show Front' : 'Show Back'}</span>
          <span className="text-[10px] text-[var(--text-muted)] font-normal hidden sm:inline">[F]</span>
        </button>

        {/* 2. Download / Export Card Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDownloadMenuOpen((prev) => !prev)}
            disabled={exportingType !== null}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white border-2 border-[var(--border-color)] font-mono text-xs font-bold uppercase tracking-wider rounded-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Download Visiting Card"
            aria-expanded={downloadMenuOpen}
          >
            {exportingType ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{exportingType ? `Generating ${exportingType.toUpperCase()}...` : 'Download Card'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${downloadMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Export Menu Dropdown */}
          <AnimatePresence>
            {downloadMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-64 bg-[#0B0E17] border-2 border-[var(--border-color)] text-white shadow-xl rounded-xs p-1.5 z-50 flex flex-col gap-1 font-mono"
              >
                <div className="px-2.5 py-1 text-[9px] uppercase font-bold tracking-wider text-white/50 border-b border-white/10 flex items-center justify-between">
                  <span>EXPORT SPECIFICATION</span>
                  <span className="text-rose-400">SELECT FORMAT</span>
                </div>

                {/* Option A: PDF (3.5" x 2" Standard Business Card) */}
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="flex items-start gap-2.5 px-2.5 py-2 hover:bg-white/10 rounded-xs text-left transition-colors cursor-pointer group"
                >
                  <div className="p-1 rounded bg-rose-500/20 text-rose-400 mt-0.5 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-rose-300 flex items-center justify-between">
                      <span>Download PDF</span>
                      <span className="text-[9px] px-1 bg-white/10 rounded-xs text-white/70">3.5" × 2"</span>
                    </div>
                    <div className="text-[10px] text-white/60 leading-tight mt-0.5">
                      Standard 2-page print-ready business card (Front &amp; Back)
                    </div>
                  </div>
                </button>

                {/* Option B: PNG High-Res Retina */}
                <button
                  type="button"
                  onClick={() => handleDownloadPNG(isFlipped ? 'back' : 'front')}
                  className="flex items-start gap-2.5 px-2.5 py-2 hover:bg-white/10 rounded-xs text-left transition-colors cursor-pointer group"
                >
                  <div className="p-1 rounded bg-sky-500/20 text-sky-400 mt-0.5 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-sky-300 flex items-center justify-between">
                      <span>Download PNG</span>
                      <span className="text-[9px] px-1 bg-white/10 rounded-xs text-white/70">300 DPI</span>
                    </div>
                    <div className="text-[10px] text-white/60 leading-tight mt-0.5">
                      High-resolution 2x retina image of {isFlipped ? 'Back side' : 'Front side'}
                    </div>
                  </div>
                </button>

                {/* Option C: vCard (.vcf) */}
                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  className="flex items-start gap-2.5 px-2.5 py-2 hover:bg-white/10 rounded-xs text-left transition-colors cursor-pointer group"
                >
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Contact className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center justify-between">
                      <span>Save as vCard (.vcf)</span>
                      <span className="text-[9px] px-1 bg-white/10 rounded-xs text-white/70">RFC 6350</span>
                    </div>
                    <div className="text-[10px] text-white/60 leading-tight mt-0.5">
                      Direct contact import for Apple Contacts, Google &amp; Outlook
                    </div>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Quick Copy Portfolio Link */}
        <button
          type="button"
          onClick={handleCopyPortfolioLink}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--border-color)]/20 text-[var(--text-main)] border-2 border-[var(--border-color)] font-mono text-xs font-bold uppercase tracking-wider rounded-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
          title="Copy portfolio URL"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
          <span className="hidden sm:inline">{copiedLink ? 'Link Copied' : 'Share Link'}</span>
        </button>
      </div>

      {/* Floating Action Toast */}
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
      {/* HIDDEN OFFSCREEN RENDER CHASSIS (Dedicated Clean Capture for PDF & PNG)   */}
      {/* Pristine 2D render without 3D perspective distortion or blur for export    */}
      {/* ========================================================================= */}
      <div 
        aria-hidden="true" 
        className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-100"
        style={{ width: '460px' }}
      >
        {/* Print Front Face */}
        <div
          ref={printFrontRef}
          style={{ width: '460px', height: '276px' }}
          className="relative bg-[#0B0E17] text-white p-5 flex flex-col justify-between overflow-hidden border-2 border-white/20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:12px_12px]" />
          
          <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-2">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              VERIFIED DIGITAL ID · 2026
            </div>
            <div className="font-mono text-[10px] text-rose-400 font-bold">
              ID: YJ-AIML-882
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 my-auto py-2">
            <div className="w-20 h-20 rounded-md border-2 border-rose-500 p-0.5 bg-black shrink-0">
              <img
                src="/assets/aistudio/favicon_507da8ac.png"
                alt="Yogananth J"
                className="w-full h-full object-cover rounded-xs"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-2xl font-black text-white tracking-tight leading-tight">
                Yogananth J
              </h3>
              <div className="font-mono text-xs font-bold text-rose-400 uppercase tracking-tight mt-0.5">
                AI Engineer · Full-Stack Developer
              </div>
              <div className="font-mono text-[10px] text-white/80 leading-snug mt-1.5 border-l-2 border-rose-500 pl-2">
                <span className="text-white/40 block text-[8px] uppercase font-bold tracking-wider">Qualification</span>
                B.Tech in Artificial Intelligence &amp; Machine Learning
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2 font-mono text-[9px]">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs text-emerald-300 font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Open to Opportunities
            </div>
            <div className="text-white/60 font-mono">
              iam-mjyogananth.pages.dev
            </div>
          </div>
        </div>

        {/* Print Back Face */}
        <div
          ref={printBackRef}
          style={{ width: '460px', height: '276px' }}
          className="relative bg-[#0A0D15] text-white p-5 flex flex-col justify-between overflow-hidden border-2 border-white/20 mt-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:12px_12px]" />

          <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-2">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              COMMUNICATION CHANNELS &amp; SCAN
            </div>
            <div className="font-mono text-[10px] text-white/50">
              YJ-2026-PORTFOLIO
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-12 gap-4 flex-1 items-center py-2">
            <div className="col-span-7 flex flex-col justify-between gap-1.5 font-mono text-[10px]">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xs text-white">
                <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">mjyogananth@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xs text-white">
                <Linkedin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">linkedin.com/in/yogananth-j</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xs text-white">
                <Github className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate">github.com/YogananthJ</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xs text-white">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">Gobichettipalayam, Erode, TN</span>
              </div>
            </div>

            <div className="col-span-5 flex flex-col items-center justify-center p-2 bg-[#0D111A] border border-white/15 rounded-sm">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-24 h-24 object-contain rounded-xs border border-white/20 p-0.5 bg-black"
                />
              )}
              <div className="mt-1 font-mono text-[8.5px] uppercase tracking-wider text-rose-400 font-bold">
                Scan to Connect
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2 font-mono text-[9px] text-white/60">
            <span className="text-white/80">https://iam-mjyogananth.pages.dev</span>
            <span className="text-rose-400 font-bold">YOGANANTH J</span>
          </div>
        </div>
      </div>
    </div>
  );
};
