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
  ArrowLeft,
  Download, 
  FileText, 
  Image as ImageIcon, 
  Contact, 
  ChevronDown, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode as QrIcon, 
  Loader2, 
  Share2,
  ChevronRight,
  UserCheck,
  Eye,
  Camera
} from 'lucide-react';

interface DigitalVisitingCardProps {
  className?: string;
}

type CardFace = 'photo' | 'vcard-front' | 'vcard-back';

export const DigitalVisitingCard: React.FC<DigitalVisitingCardProps> = ({ className = '' }) => {
  // Current visible face:
  // 1. 'photo'       : Photo Cover that covers the vCard (initial view)
  // 2. 'vcard-front' : Front side of the vCard (revealed when photo is clicked)
  // 3. 'vcard-back'  : Back side of the vCard (revealed when "SHOW BACK" is clicked)
  const [currentFace, setCurrentFace] = useState<CardFace>('photo');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [face1Content, setFace1Content] = useState<'photo' | 'vcard-back'>('photo');

  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<boolean>(false);
  const [exportingType, setExportingType] = useState<'pdf' | 'png-combined' | 'png-current' | 'vcf' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const prefersReducedMotion = useReducedMotion();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const printPhotoRef = useRef<HTMLDivElement | null>(null);
  const printFrontRef = useRef<HTMLDivElement | null>(null);
  const printBackRef = useRef<HTMLDivElement | null>(null);
  const printCombinedRef = useRef<HTMLDivElement | null>(null);

  // Generate scannable QR Code on mount
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
  // INTERACTION TRANSITIONS
  // ---------------------------------------------------------------------------

  // 1. Photo Clicked -> Flips to reveal vCard Front
  const handlePhotoClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentFace('vcard-front');
    setRotationAngle(180);
  };

  // 2. "SHOW BACK" Clicked -> Flips vCard to reveal Backside
  const handleShowBack = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Face 1 is behind Face 2 at 180deg, so swapping Face 1 content is seamless
    setFace1Content('vcard-back');
    setCurrentFace('vcard-back');
    setRotationAngle(360);
  };

  // 3. "SHOW FRONT" Clicked -> Flips back to reveal vCard Front
  const handleShowFront = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentFace('vcard-front');
    setRotationAngle(180);
  };

  // 4. "SHOW PHOTO COVER" Clicked -> Flips back to initial Photo Cover
  const handleShowPhotoCover = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentFace === 'vcard-front') {
      setFace1Content('photo');
      setCurrentFace('photo');
      setRotationAngle(0);
    } else {
      // From backside (at 360deg), flip directly back to photo cover (at 0deg)
      setFace1Content('photo');
      setCurrentFace('photo');
      setRotationAngle(0);
    }
  };

  // Primary toggle handler for Button 1 & Hotkey [F]
  const handleToggleAction = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    if (currentFace === 'photo') {
      handlePhotoClick();
    } else if (currentFace === 'vcard-front') {
      handleShowBack();
    } else {
      handleShowFront();
    }
  };

  // Keyboard shortcut: Press 'f' or 'F' to navigate card states
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        if (currentFace === 'photo') {
          handlePhotoClick();
        } else if (currentFace === 'vcard-front') {
          handleShowBack();
        } else {
          handleShowFront();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [currentFace]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleAction(e);
    }
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('mjyogananth@gmail.com');
    setCopiedEmail(true);
    showToast('Email copied: mjyogananth@gmail.com');
    setTimeout(() => setCopiedEmail(false), 2200);
  };

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

      if (!printFrontRef.current || !printBackRef.current) {
        throw new Error('Export elements not ready');
      }

      const frontCanvas = await html2canvas(printFrontRef.current, {
        scale: 2.5,
        backgroundColor: '#0A0D14',
        useCORS: true,
        logging: false
      });

      const backCanvas = await html2canvas(printBackRef.current, {
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

      // Page 1: Front Face
      const frontImgData = frontCanvas.toDataURL('image/png');
      pdf.addImage(frontImgData, 'PNG', 0, 0, 3.5, 2.0);
      pdf.link(1.8, 1.7, 1.6, 0.25, { url: 'https://iam-mjyogananth.pages.dev' });

      // Page 2: Back Face
      pdf.addPage([3.5, 2.0], 'landscape');
      const backImgData = backCanvas.toDataURL('image/png');
      pdf.addImage(backImgData, 'PNG', 0, 0, 3.5, 2.0);

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
  const handleDownloadPNG = async (mode: 'combined' | 'current' = 'combined') => {
    try {
      setExportingType(mode === 'combined' ? 'png-combined' : 'png-current');
      setDownloadMenuOpen(false);

      let targetRef: HTMLElement | null = null;
      let filename = 'Yogananth_J_Visiting_Card.png';

      if (mode === 'combined') {
        targetRef = printCombinedRef.current;
        filename = 'Yogananth_J_Visiting_Card_Presentation.png';
      } else {
        if (currentFace === 'photo') {
          targetRef = printPhotoRef.current;
          filename = 'Yogananth_J_Photo_Cover.png';
        } else if (currentFace === 'vcard-back') {
          targetRef = printBackRef.current;
          filename = 'Yogananth_J_Visiting_Card_Back.png';
        } else {
          targetRef = printFrontRef.current;
          filename = 'Yogananth_J_Visiting_Card_Front.png';
        }
      }

      if (!targetRef) throw new Error('Target export container not ready');

      const canvas = await html2canvas(targetRef, {
        scale: 2.5,
        backgroundColor: '#07090E',
        useCORS: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast(`Downloaded High-Resolution PNG (${mode === 'combined' ? 'Front & Back' : currentFace === 'photo' ? 'Photo Cover' : currentFace === 'vcard-back' ? 'Back' : 'Front'})`);
    } catch (err) {
      console.error('PNG export failed:', err);
      showToast('Failed to export PNG');
    } finally {
      setExportingType(null);
    }
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* ========================================================================= */}
      {/* 3D ROTATING VISITING CARD CONTAINER                                      */}
      {/* Smooth 3D flip between Photo Cover -> vCard Front -> vCard Back           */}
      {/* ========================================================================= */}
      <div 
        className="relative w-full max-w-[440px] sm:max-w-[460px] lg:max-w-[480px] xl:max-w-[500px] aspect-[1.65/1]"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          animate={{ rotateY: rotationAngle }}
          transition={
            prefersReducedMotion
              ? { duration: 0.1 }
              : { type: 'spring', stiffness: 200, damping: 24, mass: 0.85 }
          }
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full h-full cursor-pointer focus:outline-hidden"
          onKeyDown={handleKeyDown}
          role="region"
          aria-label="Interactive Digital Visiting Card for Yogananth J"
        >
          {/* ========================================================================= */}
          {/* SIDE A: Photo Cover (at 0deg) OR vCard Backside (at 360deg)              */}
          {/* Face 1 renders either Photo Cover or vCard Backside                       */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-md border-2 border-rose-500/85 bg-[#0B0E17]/95 text-white p-3.5 sm:p-4.5 flex flex-col justify-between overflow-hidden shadow-[8px_8px_0px_0px_var(--border-color)] hover:shadow-[11px_11px_0px_0px_var(--border-color)] transition-shadow group"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
            {face1Content === 'photo' ? (
              // ---------------------------------------------------------------------
              // 1. PHOTO COVER: Photo that covers the vCard (Initial View)
              // Clicking anywhere on this photo cover flips to reveal the vCard
              // ---------------------------------------------------------------------
              <div 
                className="relative z-10 flex flex-col justify-between h-full w-full cursor-pointer"
                onClick={handlePhotoClick}
                data-cursor-label="CLICK PHOTO"
                title="Click photo to flip and show vCard"
              >
                {/* Tech Matrix Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                <div className="absolute top-1.5 left-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>
                <div className="absolute top-1.5 right-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>
                <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>
                <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>

                {/* Subtle blurred photo background reflection for depth */}
                <div 
                  className="absolute inset-0 opacity-12 bg-cover bg-center filter blur-lg pointer-events-none scale-125"
                  style={{ backgroundImage: `url('/assets/aistudio/favicon_507da8ac.png')` }}
                />

                {/* Glowing Neon Accent Ambient Glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-600/25 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-600/40 transition-colors duration-500" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-600/20 rounded-full blur-2xl pointer-events-none" />

                {/* Top Bar: Verified Pass & Photo Cover Indicator */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                      <Camera className="w-3 h-3 text-rose-500" />
                      OFFICIAL PHOTO PASS · 2026
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[8.5px] sm:text-[9.5px]">
                    <span className="px-1.5 py-0.5 rounded-xs bg-rose-500/20 border border-rose-500/40 font-bold text-rose-300">
                      COVER FACE
                    </span>
                  </div>
                </div>

                {/* Central Photo Cover Display */}
                <div className="relative z-10 flex items-center gap-3 sm:gap-4.5 my-auto py-1">
                  {/* HERO PHOTO CONTAINER */}
                  <div className="relative shrink-0 group/img">
                    {/* Glowing holographic frame around photo */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-rose-500 p-0.5 bg-black/90 shadow-[0_0_24px_rgba(225,29,72,0.6)] group-hover/img:shadow-[0_0_32px_rgba(225,29,72,0.85)] group-hover/img:scale-104 transition-all duration-300 relative overflow-hidden">
                      <img
                        src="/assets/aistudio/favicon_507da8ac.png"
                        alt="Yogananth J Photo Cover"
                        className="w-full h-full object-cover rounded-md group-hover/img:brightness-110 transition-all"
                        loading="eager"
                      />

                      {/* Interactive Hover Overlay Cue on Photo */}
                      <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-center p-1">
                        <Sparkles className="w-4 h-4 text-rose-400 animate-pulse mb-1" />
                        <span className="text-[8px] font-mono font-black text-white tracking-wider uppercase leading-tight">
                          CLICK PHOTO
                        </span>
                        <span className="text-[7px] font-mono text-rose-300 tracking-tight">
                          FLIP TO VCARD
                        </span>
                      </div>
                    </div>

                    {/* Active Live Status Tag */}
                    <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-emerald-500 text-black text-[7.5px] font-mono font-black uppercase rounded-xs tracking-tight shadow-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      <span>ONLINE</span>
                    </div>
                  </div>

                  {/* Identity Information on Cover */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display text-base sm:text-xl font-black text-white tracking-tight leading-tight truncate">
                        Yogananth J
                      </h3>
                      <span className="text-[10px] text-rose-400 font-bold" title="Verified Creator">
                        ✓
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-[9px] sm:text-[10.5px] font-bold text-rose-400 uppercase tracking-tight mt-0.5">
                      <Cpu className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">AI Engineer · Full-Stack Developer</span>
                    </div>

                    <div className="font-mono text-[8px] sm:text-[9px] text-white/70 leading-snug mt-1.5 border-l-2 border-rose-500/70 pl-2">
                      <span className="text-white/40 block text-[7px] uppercase font-bold tracking-wider">Qualification</span>
                      B.Tech in AI &amp; Data Science / ML
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Action Cue to Flip Photo */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[8px] sm:text-[9px]">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="uppercase tracking-wider text-emerald-300 font-semibold text-[8px] sm:text-[8.5px]">
                      Open to Opportunities
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold rounded-xs hover:bg-rose-500 hover:text-white transition-colors">
                    <Sparkles className="w-3 h-3 text-rose-400 animate-pulse" />
                    <span className="uppercase tracking-wider">Click Photo to Flip</span>
                    <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ) : (
              // ---------------------------------------------------------------------
              // 2. VCARD BACKSIDE: Channels & Scannable QR Code (Visible when SHOW BACK is clicked)
              // ---------------------------------------------------------------------
              <div className="relative z-10 flex flex-col justify-between h-full w-full">
                {/* Tech matrix */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                {/* Backside Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-1.5 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/90">
                      VCARD BACKSIDE · CONTACT &amp; QR
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleShowFront}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-white/80 hover:text-rose-400 text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                      title="Return to vCard front face"
                    >
                      <ArrowLeft className="w-2.5 h-2.5 text-rose-500" />
                      <span>SHOW FRONT</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShowPhotoCover}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-[8px] sm:text-[8.5px] font-mono uppercase tracking-wider transition-all cursor-pointer"
                      title="Return to Photo Cover"
                    >
                      <Camera className="w-2.5 h-2.5 text-rose-400" />
                      <span className="hidden sm:inline">PHOTO</span>
                    </button>
                  </div>
                </div>

                {/* Backside Body: 2 Columns (Links + QR Code) */}
                <div className="relative z-10 grid grid-cols-12 gap-3 flex-1 items-center py-1.5">
                  {/* Left Column: Direct Interactive Channels */}
                  <div className="col-span-7 flex flex-col justify-between gap-1.5 font-mono text-[8.5px] sm:text-[9.5px]">
                    {/* Email with copy */}
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
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-between px-2 py-1 bg-white/5 hover:bg-sky-500/15 border border-white/10 hover:border-sky-500/40 rounded-xs transition-colors cursor-pointer group/link"
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
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-between px-2 py-1 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-xs transition-colors cursor-pointer group/link"
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

                  {/* Right Column: Scannable QR Code */}
                  <div className="col-span-5 flex flex-col items-center justify-center text-center border-l border-white/10 pl-2">
                    <div className="p-1 bg-white rounded-xs shadow-md">
                      {qrCodeUrl ? (
                        <img 
                          src={qrCodeUrl} 
                          alt="Portfolio QR Code" 
                          className="w-16 h-16 sm:w-18 sm:h-18"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center bg-gray-100 text-black">
                          <QrIcon className="w-6 h-6 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-[7px] sm:text-[7.5px] uppercase tracking-wider text-white/70 mt-1 font-bold">
                      SCAN FOR PORTFOLIO
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDownloadVCard(e)}
                      className="mt-1 flex items-center gap-1 px-1.5 py-0.5 bg-rose-500/20 hover:bg-rose-500 border border-rose-500/40 text-rose-300 hover:text-white font-mono text-[7.5px] uppercase font-bold rounded-xs transition-colors cursor-pointer"
                      title="Save RFC 6350 contact file (.vcf)"
                    >
                      <Contact className="w-2.5 h-2.5" />
                      <span>SAVE VCARD</span>
                    </button>
                  </div>
                </div>

                {/* Backside Footer */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-1.5 font-mono text-[8px] sm:text-[8.5px] text-white/50">
                  <span className="truncate">RFC 6350 COMPLIANT · AI &amp; AUTOMATION</span>
                  <button
                    type="button"
                    onClick={handleShowFront}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-bold uppercase transition-colors"
                  >
                    <RotateCcw className="w-2.5 h-2.5 text-rose-500" />
                    <span>SHOW FRONT</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SIDE B: vCard Front (at 180deg)                                           */}
          {/* Revealed when photo is clicked. Contains prominent "SHOW BACK" button!    */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-md border-2 border-rose-500/85 bg-[#0A0D15]/98 text-white p-3.5 sm:p-4.5 flex flex-col justify-between overflow-hidden shadow-[8px_8px_0px_0px_var(--border-color)] hover:shadow-[11px_11px_0px_0px_var(--border-color)] transition-shadow"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Tech Matrix Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
            <div className="absolute top-1.5 left-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>
            <div className="absolute top-1.5 right-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>
            <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>
            <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-rose-500/40 select-none pointer-events-none">+</div>

            {/* Glowing Neon Accent Ambient Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-600/15 rounded-full blur-2xl pointer-events-none" />

            {/* Top Bar: Verified Pass & Pass ID */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-rose-500" />
                  VERIFIED VCARD · 2026
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[8.5px] sm:text-[9.5px] text-white/50">
                <button
                  type="button"
                  onClick={handleShowPhotoCover}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-rose-400 text-[8px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                  title="Return to Photo Cover"
                >
                  <Camera className="w-2.5 h-2.5 text-rose-500" />
                  <span>PHOTO COVER</span>
                </button>
                <span className="px-1.5 py-0.5 rounded-xs bg-white/5 border border-white/10 font-bold text-white/80">
                  ID: YJ-AIML-882
                </span>
              </div>
            </div>

            {/* Middle Section: Avatar Thumbnail + Identity Details + Qualifications */}
            <div className="relative z-10 flex items-center gap-3 sm:gap-4 my-auto py-1">
              {/* Profile Avatar Thumbnail (Clickable to return to Photo Cover) */}
              <div 
                className="relative shrink-0 group/thumb cursor-pointer"
                onClick={handleShowPhotoCover}
                title="Click avatar to return to Photo Cover"
                data-cursor-label="PHOTO COVER"
              >
                <div className="w-16 h-16 sm:w-19 sm:h-19 rounded-md border-2 border-rose-500 p-0.5 bg-black/80 shadow-[0_0_16px_rgba(225,29,72,0.4)] group-hover/thumb:border-rose-400 group-hover/thumb:scale-104 transition-all relative overflow-hidden">
                  <img
                    src="/assets/aistudio/favicon_507da8ac.png"
                    alt="Yogananth J Avatar Thumbnail"
                    className="w-full h-full object-cover rounded-xs"
                    loading="eager"
                  />
                  {/* Subtle return hint on thumbnail hover */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-0.5">
                    <Camera className="w-3 h-3 text-rose-400 mb-0.5" />
                    <span className="text-[7px] font-mono text-white font-bold leading-tight">PHOTO COVER</span>
                  </div>
                </div>

                {/* Active Indicator */}
                <div className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-emerald-500 text-black text-[7.5px] font-mono font-black uppercase rounded-xs tracking-tight shadow-xs flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-black animate-pulse" />
                  <span>ACTIVE</span>
                </div>
              </div>

              {/* Identity Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-base sm:text-xl font-black text-white tracking-tight leading-tight truncate">
                    Yogananth J
                  </h3>
                  <span className="text-[10px] text-rose-400 font-bold" title="Verified Creator">
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

            {/* Bottom Bar: "Open to Opportunities" + PROMINENT "SHOW BACK" BUTTON */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[8px] sm:text-[9px]">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="uppercase tracking-wider text-emerald-300 font-semibold text-[8px] sm:text-[8.5px]">
                  Open to Opportunities
                </span>
              </div>

              {/* PRIMARY REQUIREMENT: "for seeing the backside of the v card show back button is clicked" */}
              <button
                type="button"
                onClick={handleShowBack}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-xs font-mono text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer group/btn"
                title="Click to flip and view backside of the vCard"
                data-cursor-label="SHOW BACK"
              >
                <RotateCcw className="w-3 h-3 group-hover/btn:-rotate-90 transition-transform duration-300 text-white" />
                <span>SHOW BACK</span>
                <ChevronRight className="w-3 h-3 text-white/80 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* THREE ACTION BUTTONS BELOW THE CARD                                       */}
      {/* 1: SHOW BACK / SHOW FRONT / REVEAL VCARD                                  */}
      {/* 2: DOWNLOAD CARD (With Dropdown Menu for PDF, PNG, and vCard)              */}
      {/* 3: SHARE LINK (Web Share API with Clipboard Fallback)                     */}
      {/* ========================================================================= */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 relative z-30 max-w-full">
        {/* BUTTON 1: DYNAMIC VIEW TOGGLE (SHOW BACK / SHOW FRONT / REVEAL VCARD) */}
        {currentFace === 'photo' && (
          <button
            type="button"
            onClick={handlePhotoClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border-2 border-rose-500 font-mono text-xs font-bold uppercase tracking-wider rounded-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
            title="Click photo or button to reveal vCard [Hotkey: F]"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>REVEAL VCARD</span>
            <span className="text-[10px] text-rose-400/80 font-normal hidden sm:inline">[F]</span>
          </button>
        )}

        {currentFace === 'vcard-front' && (
          <button
            type="button"
            onClick={handleShowBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white border-2 border-rose-400 font-mono text-xs font-bold uppercase tracking-wider rounded-xs shadow-md hover:shadow-lg transition-all cursor-pointer animate-pulse hover:animate-none"
            title="Click to show backside of the vCard [Hotkey: F]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-white" />
            <span>SHOW BACK</span>
            <span className="text-[10px] text-white/80 font-normal hidden sm:inline">[F]</span>
          </button>
        )}

        {currentFace === 'vcard-back' && (
          <button
            type="button"
            onClick={handleShowFront}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--border-color)]/20 text-[var(--text-main)] border-2 border-[var(--border-color)] font-mono text-xs font-bold uppercase tracking-wider rounded-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
            title="Click to show front of the vCard [Hotkey: F]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>SHOW FRONT</span>
            <span className="text-[10px] text-[var(--text-muted)] font-normal hidden sm:inline">[F]</span>
          </button>
        )}

        {/* BUTTON 2: DOWNLOAD CARD (With Dropdown Menu for PDF, PNG, and vCard) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDownloadMenuOpen((prev) => !prev)}
            disabled={exportingType !== null}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white border-2 border-[var(--border-color)] font-mono text-xs font-bold uppercase tracking-wider rounded-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            title="Download Visiting Card Options"
            aria-expanded={downloadMenuOpen}
          >
            {exportingType ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{exportingType ? `GENERATING...` : 'DOWNLOAD CARD'}</span>
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
                className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 bg-[#0B0E17] border-2 border-[var(--border-color)] text-white shadow-2xl rounded-xs p-1.5 z-50 flex flex-col gap-1 font-mono"
              >
                <div className="px-2.5 py-1 text-[9px] uppercase font-bold tracking-wider text-white/50 border-b border-white/10 flex items-center justify-between">
                  <span>EXPORT SPECIFICATION</span>
                  <span className="text-rose-400">SELECT FORMAT</span>
                </div>

                {/* Option 1: PDF (3.5" x 2" Print-Ready with Clickable Hyperlinks) */}
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
                      2-page print card with <strong className="text-rose-400">clickable URLs</strong> &amp; QR
                    </div>
                  </div>
                </button>

                {/* Option 2: PNG High-Res (Combined Front & Back Presentation) */}
                <button
                  type="button"
                  onClick={() => handleDownloadPNG('combined')}
                  className="flex items-start gap-2.5 px-2.5 py-2 hover:bg-white/10 rounded-xs text-left transition-colors cursor-pointer group"
                >
                  <div className="p-1 rounded bg-sky-500/20 text-sky-400 mt-0.5 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-sky-300 flex items-center justify-between">
                      <span>Download PNG (Both Sides)</span>
                      <span className="text-[9px] px-1 bg-white/10 rounded-xs text-white/70">300 DPI</span>
                    </div>
                    <div className="text-[10px] text-white/60 leading-tight mt-0.5">
                      High-resolution dual-face presentation sheet
                    </div>
                  </div>
                </button>

                {/* Option 3: PNG Single Active Side */}
                <button
                  type="button"
                  onClick={() => handleDownloadPNG('current')}
                  className="flex items-start gap-2.5 px-2.5 py-2 hover:bg-white/10 rounded-xs text-left transition-colors cursor-pointer group"
                >
                  <div className="p-1 rounded bg-purple-500/20 text-purple-400 mt-0.5 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center justify-between">
                      <span>Download PNG ({currentFace === 'photo' ? 'Photo Cover' : currentFace === 'vcard-back' ? 'Back' : 'Front'})</span>
                      <span className="text-[9px] px-1 bg-white/10 rounded-xs text-white/70">Active</span>
                    </div>
                    <div className="text-[10px] text-white/60 leading-tight mt-0.5">
                      Exact capture of the active visible card face
                    </div>
                  </div>
                </button>

                {/* Option 4: vCard (.vcf) */}
                <button
                  type="button"
                  onClick={(e) => handleDownloadVCard(e)}
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
                      Direct import for Apple Contacts, Google &amp; Outlook
                    </div>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BUTTON 3: SHARE LINK (Web Share API with Clipboard Fallback) */}
        <button
          type="button"
          onClick={handleShareLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--border-color)]/20 text-[var(--text-main)] border-2 border-[var(--border-color)] font-mono text-xs font-bold uppercase tracking-wider rounded-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
          title="Share official portfolio link via native share dialog or copy to clipboard"
        >
          {copiedLink ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Share2 className="w-3.5 h-3.5 text-rose-500" />
          )}
          <span>{copiedLink ? 'LINK COPIED' : 'SHARE LINK'}</span>
        </button>

        {/* COMPANION TOGGLE: Direct return to Photo Cover whenever on vCard */}
        {currentFace !== 'photo' && (
          <button
            type="button"
            onClick={handleShowPhotoCover}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-rose-500/15 text-white/70 hover:text-rose-300 border border-white/15 hover:border-rose-500/40 font-mono text-xs font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer"
            title="Return to the initial Photo Cover"
          >
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            <span>PHOTO COVER</span>
          </button>
        )}
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
      {/* HIDDEN OFFSCREEN RENDER CHASSIS (Dedicated Clean Capture for PDF & PNG)   */}
      {/* Pristine 2D render without 3D perspective distortion or blur for export    */}
      {/* ========================================================================= */}
      <div 
        aria-hidden="true" 
        className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-100"
        style={{ width: '960px' }}
      >
        {/* 1. Print Photo Cover */}
        <div
          ref={printPhotoRef}
          style={{ width: '460px', height: '276px' }}
          className="relative bg-[#0B0E17] text-white p-5 flex flex-col justify-between overflow-hidden border-2 border-white/20 mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:12px_12px]" />
          
          <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-2">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              OFFICIAL PHOTO PASS · 2026
            </div>
            <div className="font-mono text-[10px] text-rose-400 font-bold">
              ID: YJ-AIML-882
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 my-auto py-2">
            <div className="w-24 h-24 rounded-lg border-2 border-rose-500 p-0.5 bg-black shrink-0">
              <img
                src="/assets/aistudio/favicon_507da8ac.png"
                alt="Avatar"
                className="w-full h-full object-cover rounded-md"
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
                B.Tech in Artificial Intelligence &amp; Data Science / ML
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2 font-mono text-[9px]">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs text-emerald-300 font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Open to Opportunities
            </div>
            <div className="text-white/70 font-mono font-bold">
              iam-mjyogananth.pages.dev
            </div>
          </div>
        </div>

        {/* 2. Print Front Face */}
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
                alt="Avatar"
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
                B.Tech in Artificial Intelligence &amp; Data Science / ML
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2 font-mono text-[9px]">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs text-emerald-300 font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Open to Opportunities
            </div>
            <div className="text-white/70 font-mono font-bold">
              iam-mjyogananth.pages.dev
            </div>
          </div>
        </div>

        {/* 3. Print Back Face */}
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

          <div className="relative z-10 grid grid-cols-12 gap-3.5 flex-1 items-center py-2">
            <div className="col-span-7 flex flex-col justify-between gap-1.5 font-mono text-[9.5px]">
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-white">
                <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">mjyogananth@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-white">
                <Linkedin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">linkedin.com/in/yogananth-j</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-white">
                <Github className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate">github.com/YogananthJ</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-0.5 text-white/60 text-[8.5px]">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="truncate">Gobichettipalayam, Erode, TN, IN</span>
              </div>
            </div>

            <div className="col-span-5 flex flex-col items-center justify-center text-center border-l border-white/15 pl-3">
              <div className="p-1 bg-white rounded-xs">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code" className="w-18 h-18" />
                ) : (
                  <div className="w-18 h-18 bg-white" />
                )}
              </div>
              <div className="font-mono text-[8px] uppercase tracking-wider text-white/80 font-bold mt-1">
                SCAN FOR PORTFOLIO
              </div>
              <div className="font-mono text-[7px] text-rose-400 mt-0.5">
                RFC 6350 VCARD
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2 font-mono text-[9px] text-white/60">
            <span>Yogananth J · AI Engineer</span>
            <span className="text-white/40">iam-mjyogananth.pages.dev</span>
          </div>
        </div>

        {/* 4. Combined Presentation Sheet (Both Sides for 300 DPI Export) */}
        <div
          ref={printCombinedRef}
          style={{ width: '960px', padding: '32px' }}
          className="bg-[#05070C] flex flex-col gap-6 border-2 border-white/20 mt-4"
        >
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <h2 className="font-display text-xl font-black text-white uppercase tracking-wider">
                YOGANANTH J — OFFICIAL DIGITAL IDENTITY PASS
              </h2>
            </div>
            <span className="font-mono text-xs text-rose-400 font-bold">
              300 DPI PRINT &amp; DIGITAL SPECIFICATION
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Front Preview Clone */}
            <div className="bg-[#0B0E17] p-5 rounded-sm border-2 border-rose-500/80 flex flex-col justify-between h-[276px]">
              <div className="flex items-center justify-between border-b border-white/15 pb-2 font-mono text-[10px] text-white font-bold">
                <span className="text-rose-400">SIDE A — VCARD FRONT</span>
                <span>ID: YJ-AIML-882</span>
              </div>
              <div className="flex items-center gap-4 my-auto py-2">
                <div className="w-20 h-20 rounded-md border-2 border-rose-500 p-0.5 bg-black shrink-0">
                  <img
                    src="/assets/aistudio/favicon_507da8ac.png"
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-xs"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-2xl font-black text-white tracking-tight">
                    Yogananth J
                  </h3>
                  <div className="font-mono text-xs font-bold text-rose-400 uppercase mt-0.5">
                    AI Engineer · Full-Stack Developer
                  </div>
                  <div className="font-mono text-[10px] text-white/80 mt-1 border-l-2 border-rose-500 pl-2">
                    B.Tech in Artificial Intelligence &amp; Data Science / ML
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/15 pt-2 font-mono text-[9px] text-white/70">
                <span className="text-emerald-400">● Open to Opportunities</span>
                <span>iam-mjyogananth.pages.dev</span>
              </div>
            </div>

            {/* Back Preview Clone */}
            <div className="bg-[#0A0D15] p-5 rounded-sm border-2 border-rose-500/80 flex flex-col justify-between h-[276px]">
              <div className="flex items-center justify-between border-b border-white/15 pb-2 font-mono text-[10px] text-white font-bold">
                <span className="text-rose-400">SIDE B — VCARD BACK</span>
                <span>CHANNELS &amp; SCAN</span>
              </div>
              <div className="grid grid-cols-12 gap-3 flex-1 items-center py-2">
                <div className="col-span-7 flex flex-col gap-1.5 font-mono text-[9px]">
                  <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-white">
                    mjyogananth@gmail.com
                  </div>
                  <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-white">
                    linkedin.com/in/yogananth-j
                  </div>
                  <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-white">
                    github.com/YogananthJ
                  </div>
                </div>
                <div className="col-span-5 flex flex-col items-center justify-center text-center border-l border-white/15 pl-2">
                  <div className="p-1 bg-white rounded-xs">
                    {qrCodeUrl && <img src={qrCodeUrl} alt="QR" className="w-16 h-16" />}
                  </div>
                  <span className="font-mono text-[7.5px] uppercase text-white/80 font-bold mt-1">
                    SCAN FOR PORTFOLIO
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/15 pt-2 font-mono text-[9px] text-white/60">
                <span>RFC 6350 VCARD</span>
                <span>Gobichettipalayam, Erode, TN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
