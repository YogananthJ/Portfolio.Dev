import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
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

  // 3D Tilt & Moving White Glow Hover State
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [normalizedPos, setNormalizedPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Respect user's reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = cardContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Normalized position (-1 to 1) from the center of the card
    const pointerX = (e.clientX - rect.left) / rect.width;
    const pointerY = (e.clientY - rect.top) / rect.height;

    const normX = Math.max(-1, Math.min(1, (pointerX - 0.5) * 2));
    const normY = Math.max(-1, Math.min(1, (pointerY - 0.5) * 2));

    // Dynamic, clearly visible 3D Tilt: rotateY max ±4.0deg, rotateX max ±3.2deg
    const tiltY = Number((normX * 4.0).toFixed(2));
    const tiltX = Number((-normY * 3.2).toFixed(2));

    setTilt({ x: tiltX, y: tiltY });
    setNormalizedPos({ x: normX, y: normY });
    if (!isHovered) setIsHovered(true);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setNormalizedPos({ x: 0, y: 0 });
  };

  // Moving white glow pixel translations (opposite direction of mouse pointer, GPU accelerated)
  const glowShiftXFront = -normalizedPos.x * 70;
  const glowShiftYFront = -normalizedPos.y * 70;

  // On back face rotated 180deg around Y, local X is mirrored, so local X moves with + to be opposite in screen space
  const glowShiftXBack = normalizedPos.x * 110;
  const glowShiftYBack = -normalizedPos.y * 75;

  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  // Shared Flip Toggle Handler: Toggles state in both directions
  const handleToggleFlip = () => {
    setIsFlipped((prev) => !prev);
    setDownloadMenuOpen(false);
    try {
      soundFX?.playClick?.(650, 0.04);
    } catch {
      // ignore
    }
  };

  // Keyboard shortcut: Press 'f' or 'F' to toggle card flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') return;
        handleToggleFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close download dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
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

  // Copy Email to Clipboard (stops card flip propagation)
  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('mjyogananth@gmail.com');
    setCopiedEmail(true);
    showToast('Email copied: mjyogananth@gmail.com');
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  // Copy Portfolio Link to Clipboard (stops card flip propagation)
  const handleCopyPortfolioLink = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText('https://iam-mjyogananth.pages.dev');
    setCopiedLink(true);
    showToast('Portfolio link copied: https://iam-mjyogananth.pages.dev');
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Share Link via Web Share API with clipboard fallback (stops card flip propagation)
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

  // Export as RFC 6350 / vCard 3.0 (.vcf) (stops card flip propagation)
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
        'EMAIL;TYPE=INTERNET,WORK,PREF:mjyogananth@gmail.com',
        'URL;TYPE=PORTFOLIO:https://iam-mjyogananth.pages.dev',
        'URL;TYPE=LINKEDIN:https://www.linkedin.com/in/yogananth-j-653400307/',
        'URL;TYPE=GITHUB:https://github.com/YogananthJ',
        'ADR;TYPE=WORK:;;Gobichettipalayam;Erode;Tamil Nadu;;India',
        'NOTE:B.Tech in Artificial Intelligence & Data Science / ML | Specializing in Multi-Agent Orchestration, Hybrid Vector RAG, and Modern Full-Stack Platforms.',
        'REV:2026-11-04T05:40:00Z',
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'YogananthJ.vcf');
      document.body.appendChild(link);
      link.click();

      // Revoke asynchronously so browser download stream initiates cleanly
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
        URL.revokeObjectURL(url);
      }, 2500);

      showToast('Saved vCard (YogananthJ.vcf)');
      try {
        soundFX?.playChime?.();
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('vCard export failed:', err);
      showToast('Failed to export contact file');
    } finally {
      setExportingType(null);
    }
  };

  // Dynamically generate card canvas on-demand (zero persistent fixed elements in DOM)
  const generateCardCanvas = async (): Promise<HTMLCanvasElement> => {
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    let qr = qrCodeUrl;
    if (!qr) {
      try {
        qr = await QRCode.toDataURL('https://iam-mjyogananth.pages.dev', {
          width: 240,
          margin: 1,
          color: { dark: '#FFFFFF', light: '#0D111A' },
          errorCorrectionLevel: 'M'
        });
        setQrCodeUrl(qr);
      } catch {
        qr = '';
      }
    }

    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.style.width = '560px';
    wrapper.style.height = '320px';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.zIndex = '-99999';

    wrapper.innerHTML = `
      <div style="width: 560px; height: 320px; box-sizing: border-box; padding: 20px; background-color: #0B0E17; color: #ffffff; display: flex; flex-direction: column; justify-content: space-between; border: 2px solid #F43F5E; border-radius: 8px; position: relative; overflow: hidden; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">
        <div style="position: absolute; inset: 0; background-image: radial-gradient(#ffffff18 1px, transparent 1px); background-size: 12px 12px; pointer-events: none;"></div>
        <div style="position: absolute; top: -48px; right: -48px; width: 144px; height: 144px; background: rgba(225, 29, 72, 0.2); border-radius: 9999px; filter: blur(32px); pointer-events: none;"></div>
        <div style="position: absolute; bottom: -48px; left: -48px; width: 144px; height: 144px; background: rgba(236, 72, 153, 0.15); border-radius: 9999px; filter: blur(32px); pointer-events: none;"></div>

        <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: white;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: #F43F5E;"></span>
            DIGITAL VISITING CARD · 2026
          </div>
          <div style="font-size: 10px; color: #FB7185; font-weight: bold;">
            ID: YJ-AIML-882
          </div>
        </div>

        <div style="position: relative; z-index: 10; display: flex; gap: 14px; flex: 1; align-items: center; padding: 8px 0;">
          <div style="flex: 7; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 80px; height: 80px; border-radius: 6px; border: 2px solid #F43F5E; background: white; padding: 2px; flex-shrink: 0; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                <img src="/assets/aistudio/favicon_507da8ac.png" crossOrigin="anonymous" alt="Avatar" style="width: 100%; height: 100%; object-fit: contain; object-position: bottom;" />
              </div>
              <div style="min-width: 0; flex: 1;">
                <div style="font-size: 20px; font-weight: 900; color: white; letter-spacing: -0.02em; line-height: 1.2; font-family: system-ui, sans-serif;">
                  Yogananth J
                </div>
                <div style="font-size: 10px; font-weight: bold; color: #FB7185; text-transform: uppercase; margin-top: 2px;">
                  AI Engineer · Full-Stack Developer
                </div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.85); margin-top: 4px; border-left: 2px solid #F43F5E; padding-left: 8px;">
                  B.Tech in Artificial Intelligence &amp; Data Science / ML
                </div>
              </div>
            </div>
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 2px 8px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 2px; font-size: 8px; font-weight: bold; color: #6EE7B7; text-transform: uppercase; width: fit-content;">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 9999px; background-color: #34D399;"></span>
              Open to Opportunities
            </div>
          </div>

          <div style="flex: 5; display: flex; flex-direction: column; justify-content: space-between; gap: 6px; border-left: 1px solid rgba(255,255,255,0.15); padding-left: 12px; font-size: 9px;">
            <div style="color: rgba(255,255,255,0.95); display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <span style="color: #F43F5E;">✉</span>
              <span>mjyogananth@gmail.com</span>
            </div>
            <div style="color: rgba(255,255,255,0.95); display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <span style="color: #38BDF8;">in</span>
              <span>linkedin.com/in/yogananth-j</span>
            </div>
            <div style="color: rgba(255,255,255,0.95); display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <span style="color: #FFFFFF;">⌨</span>
              <span>github.com/YogananthJ</span>
            </div>
            <div style="color: rgba(255,255,255,0.65); display: flex; align-items: center; gap: 6px; font-size: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <span style="color: #F43F5E;">📍</span>
              <span>Gobichettipalayam, Erode, TN</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <div style="padding: 2px; background: white; border-radius: 2px;">
                ${qr ? `<img src="${qr}" crossOrigin="anonymous" alt="QR" style="width: 32px; height: 32px; display: block;" />` : ''}
              </div>
              <span style="font-size: 7px; color: rgba(255,255,255,0.7);">SCAN PORTFOLIO</span>
            </div>
          </div>
        </div>

        <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 8px; font-size: 8px; color: rgba(255,255,255,0.6);">
          <span>RFC 6350 COMPLIANT · AI &amp; AUTOMATION</span>
          <span style="color: #FB7185;">iam-mjyogananth.pages.dev</span>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);

    try {
      const canvas = await html2canvas(wrapper.firstElementChild as HTMLElement, {
        scale: 3, // 300+ DPI razor-sharp output
        backgroundColor: '#0B0E17',
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 560,
        height: 320,
      });
      return canvas;
    } finally {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }
  };

  // Export as Standard Business Card PDF (3.5" × 2" format with embedded clickable links)
  const handleDownloadPDF = async () => {
    try {
      setExportingType('pdf');
      setDownloadMenuOpen(false);

      const cardCanvas = await generateCardCanvas();

      const PDFConstructor = typeof jsPDF === 'function' ? jsPDF : (jsPDF as any).jsPDF;
      const pdf = new PDFConstructor({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2.0]
      });

      const imgData = cardCanvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 3.5, 2.0, undefined, 'FAST');

      // Embedded PDF Hyperlinks (clickable in Acrobat, Chrome, macOS Preview, etc.)
      pdf.link(0.18, 0.35, 1.85, 0.70, { url: 'https://iam-mjyogananth.pages.dev' });
      pdf.link(2.15, 0.38, 1.25, 0.20, { url: 'mailto:mjyogananth@gmail.com' });
      pdf.link(2.15, 0.58, 1.25, 0.20, { url: 'https://www.linkedin.com/in/yogananth-j-653400307/' });
      pdf.link(2.15, 0.78, 1.25, 0.20, { url: 'https://github.com/YogananthJ' });
      pdf.link(2.15, 1.20, 1.25, 0.45, { url: 'https://iam-mjyogananth.pages.dev' });
      pdf.link(2.20, 1.76, 1.20, 0.20, { url: 'https://iam-mjyogananth.pages.dev' });

      pdf.save('YogananthJ_Digital_VCard.pdf');
      showToast('Downloaded PDF (YogananthJ_Digital_VCard.pdf)');
      try {
        soundFX?.playChime?.();
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('Failed to export PDF');
    } finally {
      setExportingType(null);
    }
  };

  // Export as High-Resolution 300 DPI PNG
  const handleDownloadPNG = async () => {
    try {
      setExportingType('png');
      setDownloadMenuOpen(false);

      const canvas = await generateCardCanvas();

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'YogananthJ_Digital_VCard.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
      }, 2000);

      showToast('Downloaded PNG (YogananthJ_Digital_VCard.png)');
      try {
        soundFX?.playChime?.();
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('PNG export failed:', err);
      showToast('Failed to export PNG');
    } finally {
      setExportingType(null);
    }
  };

  return (
    <div className={`flex flex-col items-center select-none w-full max-w-full sm:max-w-[540px] mx-auto lg:mr-0 ${className}`}>
      {/* ========================================================================= */}
      {/* UNIFIED PERSPECTIVE FLIP CARD CONTAINER WITH SUBTLE 3D TILT               */}
      {/* Smooth mouse-driven 3D tilt (max ±2.5° Y, ±2.0° X) with ease-out return   */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 1. PERSPECTIVE VIEWPORT (Establishes 3D perspective context for tilt)     */}
      {/* Captures all mouse movement across the full card envelope                  */}
      {/* ========================================================================= */}
      <div 
        ref={cardContainerRef}
        onMouseMove={handlePointerMove}
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
        className="relative w-full max-w-full sm:max-w-[540px] h-[310px] sm:h-[325px] md:h-[335px]"
        style={{ 
          perspective: '1000px',
        }}
      >
        {/* ========================================================================= */}
        {/* 2. 3D TILT STAGE (Tilts smoothly in 3D perspective based on mouse cursor) */}
        {/* Uses transformStyle: preserve-3d so both front & back faces tilt in 3D    */}
        {/* ========================================================================= */}
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: isHovered && !prefersReducedMotion
              ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.018, 1.018, 1.018)`
              : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: isHovered
              ? 'transform 80ms ease-out'
              : 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform',
          }}
        >
          {/* ========================================================================= */}
          {/* 3. FLIP STAGE (Flips 180° between Photo Cover and Rectangular V-Card)     */}
          {/* ========================================================================= */}
          <div
            className="w-full h-full relative transition-transform duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
          {/* ===================================================================== */}
          {/* FRONT FACE: SQUARE PHOTO COVER (1:1 Clean White Photo Card)           */}
          {/* Entire surface is clickable -> Flips smoothly to the rectangular card */}
          {/* ===================================================================== */}
          <div
            onClick={handleToggleFlip}
            className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer group/front"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
            title="Click photo to flip and reveal the digital visiting card"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleFlip();
              }
            }}
          >
            {/* Square 1:1 Photo Cover Card Frame */}
            <div className="relative w-[285px] h-[285px] sm:w-[305px] sm:h-[305px] md:w-[320px] md:h-[320px] aspect-square">
              {/* Overlapping Top-Right Badge: "AI & WEB DEV" (pops outside top/right border) */}
              <div className="absolute -top-3.5 -right-2.5 z-30 pointer-events-none">
                <span className="inline-block bg-[#E11D48] text-white font-mono font-black text-[10px] sm:text-[11px] px-3 py-1 border-2 border-black tracking-widest uppercase shadow-[2.5px_2.5px_0px_#000000]">
                  AI &amp; WEB DEV
                </span>
              </div>

              {/* The Main Collectible Card Box */}
              <div 
                className="w-full h-full rounded-[4px] border-[3.5px] border-black relative flex flex-col justify-between overflow-hidden"
                style={{
                  backgroundColor: '#F3EFE6',
                  backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.06) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  transformStyle: 'preserve-3d',
                  boxShadow: isHovered && !prefersReducedMotion
                    ? `${8 - normalizedPos.x * 4}px ${8 - normalizedPos.y * 4}px 0px #000000, 0 20px 38px -8px rgba(0, 0, 0, 0.5)`
                    : '8px 8px 0px #000000, 0 10px 20px -5px rgba(0, 0, 0, 0.3)',
                  transition: isHovered
                    ? 'box-shadow 80ms ease-out'
                    : 'box-shadow 450ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* TOP LEFT: "CLICK TO FLIP" Badge */}
                <div className="absolute top-3 left-3 z-20 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 bg-[#2B2B2B] text-white font-mono font-bold text-[9px] sm:text-[10px] px-2.5 py-1 border border-black/40 tracking-wider uppercase rounded-xs shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>CLICK TO FLIP</span>
                  </span>
                </div>

                {/* CENTER: Exact Character Illustration (/assets/aistudio/favicon_507da8ac.png) */}
                <div className="relative z-10 w-full flex-1 flex items-end justify-center px-4 pt-8 pb-5 overflow-hidden pointer-events-none">
                  <img
                    src="/assets/aistudio/favicon_507da8ac.png"
                    alt="Yogananth J Character Illustration"
                    className="w-full h-full object-contain object-bottom select-none group-hover/front:scale-104 transition-transform duration-300"
                    loading="eager"
                  />
                </div>

                {/* BOTTOM: "OPEN TO OPPORTUNITIES" White Banner */}
                <div className="absolute bottom-3 left-3.5 right-3.5 sm:left-5 sm:right-5 z-20 pointer-events-none">
                  <div className="w-full bg-white text-black font-mono font-black text-[10px] sm:text-[11.5px] py-1.5 px-3 border-2 border-black tracking-widest text-center uppercase shadow-[2.5px_2.5px_0px_#000000]">
                    OPEN TO OPPORTUNITIES
                  </div>
                </div>

                {/* ================================================================= */}
                {/* SOFT BLURRED WHITE GLOW OVERLAY ABOVE CARD CONTENT (FRONT COVER)  */}
                {/* Moves opposite to cursor, strictly clipped within card boundaries */}
                {/* ================================================================= */}
                <div 
                  className="absolute inset-0 rounded-[4px] overflow-hidden pointer-events-none z-30"
                  aria-hidden="true"
                >
                  <div
                    className="absolute top-1/2 left-1/2 w-[280px] h-[280px] -mt-[140px] -ml-[140px] rounded-full blur-[40px] pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.10) 40%, rgba(255, 255, 255, 0.02) 65%, transparent 75%)',
                      mixBlendMode: 'screen',
                      transform: `translate3d(${glowShiftXFront}px, ${glowShiftYFront}px, 0)`,
                      opacity: isHovered && !prefersReducedMotion ? 1 : 0,
                      transition: isHovered
                        ? 'transform 80ms ease-out, opacity 250ms ease-out'
                        : 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease-out',
                      willChange: 'transform, opacity',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* BACK FACE: HORIZONTAL RECTANGULAR V-CARD (Landscape ~1.65:1 ratio)    */}
          {/* Entire V-card is clickable -> Flips smoothly back to the photo cover  */}
          {/* All interactive controls use e.stopPropagation() to remain clickable  */}
          {/* ===================================================================== */}
          <div
            onClick={handleToggleFlip}
            className="absolute inset-0 w-full h-full rounded-xl border-2 border-rose-500/85 bg-[#0B0E17] text-white p-3.5 sm:p-4 md:p-4.5 flex flex-col justify-between cursor-pointer group/back"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              transformStyle: 'preserve-3d',
              boxShadow: isHovered && !prefersReducedMotion
                ? `${8 - normalizedPos.x * 4}px ${8 - normalizedPos.y * 4}px 0px 0px var(--border-color), 0 20px 38px -8px rgba(0, 0, 0, 0.75)`
                : '8px 8px 0px 0px var(--border-color), 0 10px 20px -5px rgba(0, 0, 0, 0.45)',
              transition: isHovered
                ? 'box-shadow 80ms ease-out'
                : 'box-shadow 450ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            title="Click anywhere on card to flip back to photo cover [Shortcut: F]"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggleFlip();
              }
            }}
          >
            {/* Ambient Background & Grid Texture (clipped inside inner container) */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-600/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-pink-600/15 rounded-full blur-2xl" />
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* 1. COMPACT HEADER: Status Ping + ID + IN-CARD CONTROLS              */}
            {/* Elevated z-50 stacking context ensures dropdown overlays body       */}
            {/* ------------------------------------------------------------------- */}
            <div className="relative z-50 flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                  <span>DIGITAL VISITING CARD</span>
                </span>
                <span className="hidden sm:inline px-1.5 py-0.2 rounded-xs bg-white/5 border border-white/10 font-mono text-[8px] text-white/60">
                  ID: YJ-AIML-882
                </span>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1.5">
                {/* Visual Flip Indicator (also triggers flip on click) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFlip();
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 rounded-xs font-mono text-[8.5px] sm:text-[9.5px] font-bold uppercase transition-colors cursor-pointer"
                  title="Click to flip back to photo cover [Shortcut: F]"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>SHOW PHOTO</span>
                </button>

                {/* Download Button + 100% OPAQUE SOLID FLOATING MENU (#111318) */}
                <div 
                  className="relative z-50" 
                  ref={dropdownRef}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDownloadMenuOpen((prev) => !prev);
                    }}
                    disabled={exportingType !== null}
                    className="flex items-center gap-1 px-2 py-1 bg-[#181B24] hover:bg-rose-500/25 text-white/90 hover:text-white border border-white/20 hover:border-rose-500/60 rounded-xs font-mono text-[8.5px] sm:text-[9.5px] font-bold uppercase transition-all cursor-pointer"
                    title="Download Visiting Card (PDF, PNG, vCard)"
                    aria-label="Download options"
                  >
                    {exportingType ? (
                      <Loader2 className="w-3 h-3 animate-spin text-rose-400" />
                    ) : (
                      <Download className="w-3 h-3 text-rose-400" />
                    )}
                    <ChevronDown className={`w-2.5 h-2.5 text-white/70 transition-transform duration-200 ${downloadMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Fully Opaque Solid Floating Menu (#111318) with Pink Border & Maximum Layering */}
                  <AnimatePresence>
                    {downloadMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        style={{ 
                          backgroundColor: '#111318', 
                          background: '#111318',
                          opacity: 1,
                          boxShadow: '0 22px 60px rgba(0, 0, 0, 0.98), 0 0 0 1px rgba(225, 29, 72, 0.35)',
                        }}
                        className="absolute right-0 top-full mt-2 w-76 sm:w-80 bg-[#111318] border-2 border-rose-500 text-white rounded-lg p-2.5 z-[100] flex flex-col gap-2 font-mono text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header bar */}
                        <div 
                          style={{ backgroundColor: '#15171F' }}
                          className="px-2.5 py-1.5 text-[9px] uppercase font-bold tracking-wider text-gray-200 border-b border-white/15 flex items-center justify-between bg-[#15171F] rounded-t-xs"
                        >
                          <span className="flex items-center gap-1.5 text-white font-mono">
                            <Download className="w-3.5 h-3.5 text-rose-400" />
                            <span>CHOOSE EXPORT FORMAT</span>
                          </span>
                          <span className="text-[7.5px] px-1.5 py-0.5 rounded-xs bg-rose-500/25 text-rose-300 font-bold border border-rose-500/40">READY</span>
                        </div>

                        {/* 1. PDF Export (Uniform 56px height, high-contrast text, solid opaque row) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPDF();
                          }}
                          style={{ backgroundColor: '#181B24' }}
                          className="h-[56px] min-h-[56px] w-full flex items-center gap-3 px-3 py-2 bg-[#181B24] hover:bg-[#1F2433] border border-white/15 hover:border-rose-500 rounded-md text-left transition-all cursor-pointer group"
                        >
                          <div className="p-2 rounded-md bg-rose-500/20 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-bold text-white group-hover:text-rose-300 flex items-center justify-between">
                              <span>Download PDF</span>
                              <span className="text-[8.5px] px-1.5 py-0.5 bg-rose-500/25 text-rose-300 border border-rose-500/40 rounded-xs font-mono font-bold">3.5" × 2"</span>
                            </div>
                            <div className="text-[10px] text-gray-200 group-hover:text-white leading-tight mt-0.5">
                              Print-ready card with clickable links
                            </div>
                          </div>
                        </button>

                        {/* 2. PNG Export (Uniform 56px height, high-contrast text, solid opaque row) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPNG();
                          }}
                          style={{ backgroundColor: '#181B24' }}
                          className="h-[56px] min-h-[56px] w-full flex items-center gap-3 px-3 py-2 bg-[#181B24] hover:bg-[#1F2433] border border-white/15 hover:border-sky-500 rounded-md text-left transition-all cursor-pointer group"
                        >
                          <div className="p-2 rounded-md bg-sky-500/20 text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors shrink-0">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-bold text-white group-hover:text-sky-300 flex items-center justify-between">
                              <span>Download PNG</span>
                              <span className="text-[8.5px] px-1.5 py-0.5 bg-sky-500/25 text-sky-300 border border-sky-500/40 rounded-xs font-mono font-bold">300 DPI</span>
                            </div>
                            <div className="text-[10px] text-gray-200 group-hover:text-white leading-tight mt-0.5">
                              Ultra clear high-resolution image
                            </div>
                          </div>
                        </button>

                        {/* 3. vCard Export (Uniform 56px height, high-contrast text, solid opaque row) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadVCard(e);
                          }}
                          style={{ backgroundColor: '#181B24' }}
                          className="h-[56px] min-h-[56px] w-full flex items-center gap-3 px-3 py-2 bg-[#181B24] hover:bg-[#1F2433] border border-white/15 hover:border-emerald-500 rounded-md text-left transition-all cursor-pointer group"
                        >
                          <div className="p-2 rounded-md bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                            <Contact className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-bold text-white group-hover:text-emerald-300 flex items-center justify-between">
                              <span>Save vCard (.vcf)</span>
                              <span className="text-[8.5px] px-1.5 py-0.5 bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 rounded-xs font-mono font-bold">RFC 6350</span>
                            </div>
                            <div className="text-[10px] text-gray-200 group-hover:text-white leading-tight mt-0.5">
                              Import directly to phone contacts
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareLink(e);
                  }}
                  className="flex items-center gap-1 p-1.5 bg-[#181B24] hover:bg-white/20 text-white/90 hover:text-white border border-white/20 rounded-xs transition-colors cursor-pointer"
                  title="Share portfolio link via native share or clipboard"
                  aria-label="Share card"
                >
                  {copiedLink ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Share2 className="w-3 h-3 text-rose-400" />
                  )}
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* 2. MAIN HORIZONTAL LANDSCAPE BODY: TWO-COLUMN BALANCED LAYOUT        */}
            {/* ------------------------------------------------------------------- */}
            <div className="relative z-10 flex-1 grid grid-cols-12 gap-3 sm:gap-4 items-center py-0.5">
              {/* Left Column (Col 7): Identity, Avatar Thumbnail, Degree & Status */}
              <div className="col-span-7 flex flex-col justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {/* Clean Avatar Thumbnail */}
                  <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-md border-2 border-rose-500 bg-white p-0.5 shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                    <img
                      src="/assets/aistudio/favicon_507da8ac.png"
                      alt="Yogananth J Avatar"
                      className="w-full h-full object-contain object-bottom pointer-events-none"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display text-base sm:text-lg md:text-xl font-black text-white tracking-tight leading-tight truncate">
                        Yogananth J
                      </h3>
                      <span title="Verified AI Engineer">
                        <CheckCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[8.5px] sm:text-[9.5px] font-bold text-rose-400 uppercase tracking-tight mt-0.5">
                      <Cpu className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">AI Engineer · Full-Stack Developer</span>
                    </div>
                  </div>
                </div>

                {/* Degree / Qualification */}
                <div className="font-mono text-[8px] sm:text-[9px] text-white/80 leading-snug border-l-2 border-rose-500/70 pl-2 py-0.5 bg-white/[0.02]">
                  <span className="text-white/45 block text-[6.5px] sm:text-[7px] uppercase font-bold tracking-wider">Qualification</span>
                  B.Tech in Artificial Intelligence &amp; Data Science / ML
                </div>

                {/* Open to Opportunities Status */}
                <div className="flex items-center">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs text-[7.5px] sm:text-[8.5px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="uppercase tracking-wider text-emerald-300 font-semibold">
                      Open to Opportunities
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column (Col 5): Direct Channels + QR Code */}
              <div className="col-span-5 flex flex-col justify-between gap-1.5 border-l border-white/10 pl-3">
                {/* Contact Links (each stops flip propagation) */}
                <div className="flex flex-col gap-1 font-mono text-[8px] sm:text-[8.5px]">
                  {/* Email with 1-click copy */}
                  <div 
                    onClick={handleCopyEmail}
                    className="flex items-center justify-between px-2 py-1 bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 rounded-xs transition-colors cursor-pointer group/link"
                    title="Click to copy email address"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Mail className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                      <span className="truncate text-white/90 group-hover/link:text-white">mjyogananth@gmail.com</span>
                    </div>
                    {copiedEmail ? (
                      <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0 ml-1" />
                    ) : (
                      <Copy className="w-2 h-2 text-white/40 group-hover/link:text-rose-400 shrink-0 ml-1" />
                    )}
                  </div>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/yogananth-j-653400307/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-between px-2 py-0.5 bg-white/5 hover:bg-sky-500/15 border border-white/10 hover:border-sky-500/40 rounded-xs transition-colors cursor-pointer group/link"
                    title="Visit LinkedIn Profile"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Linkedin className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                      <span className="truncate text-white/90 group-hover/link:text-white">linkedin.com/in/yogananth-j</span>
                    </div>
                    <ExternalLink className="w-2 h-2 text-white/40 group-hover/link:text-sky-400 shrink-0 ml-1" />
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/YogananthJ"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-between px-2 py-0.5 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-xs transition-colors cursor-pointer group/link"
                    title="Visit GitHub Repositories"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Github className="w-2.5 h-2.5 text-white shrink-0" />
                      <span className="truncate text-white/90 group-hover/link:text-white">github.com/YogananthJ</span>
                    </div>
                    <ExternalLink className="w-2 h-2 text-white/40 group-hover/link:text-white shrink-0 ml-1" />
                  </a>

                  {/* Location */}
                  <div className="flex items-center gap-1 px-2 py-0.5 text-white/60 text-[7.5px] sm:text-[8px]">
                    <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                    <span className="truncate">Gobichettipalayam, Erode, TN, IN</span>
                  </div>
                </div>

                {/* Portfolio QR Code + Quick vCard Download */}
                <div className="flex items-center justify-between gap-1.5 bg-black/40 border border-white/10 rounded-xs p-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="p-0.5 bg-white rounded-xs shrink-0 shadow-xs">
                      {qrCodeUrl ? (
                        <img 
                          src={qrCodeUrl} 
                          alt="Portfolio QR Code" 
                          className="w-8 h-8 sm:w-9 sm:h-9"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-100 text-black">
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

                  {/* Quick Save vCard button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadVCard(e);
                    }}
                    className="flex items-center gap-0.5 px-1.5 py-1 bg-rose-500/20 hover:bg-rose-500 border border-rose-500/40 text-rose-300 hover:text-white font-mono text-[6.5px] sm:text-[7px] uppercase font-bold rounded-xs transition-colors cursor-pointer shrink-0"
                    title="Save RFC 6350 contact file (.vcf)"
                  >
                    <Contact className="w-2.5 h-2.5" />
                    <span>SAVE VCARD</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* 3. FOOTER BAR INSIDE BACK CARD                                      */}
            {/* ------------------------------------------------------------------- */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-1.5 font-mono text-[7px] sm:text-[7.5px] text-white/50">
              <span className="truncate">RFC 6350 COMPLIANT · CLICK ANYWHERE TO FLIP</span>
              <a
                href="https://iam-mjyogananth.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-rose-400 hover:text-rose-300 font-bold tracking-wider uppercase transition-colors"
              >
                iam-mjyogananth.pages.dev
              </a>
            </div>

            {/* ================================================================= */}
            {/* SOFT BLURRED WHITE GLOW OVERLAY ABOVE CARD CONTENT (V-CARD)       */}
            {/* Moves opposite to cursor, strictly clipped within card boundaries */}
            {/* ================================================================= */}
            <div 
              className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-30"
              aria-hidden="true"
            >
              <div
                className="absolute top-1/2 left-1/2 w-[340px] h-[340px] -mt-[170px] -ml-[170px] rounded-full blur-[45px] pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 35%, rgba(255, 255, 255, 0.02) 60%, transparent 75%)',
                  mixBlendMode: 'screen',
                  transform: `translate3d(${glowShiftXBack}px, ${glowShiftYBack}px, 0)`,
                  opacity: isHovered && !prefersReducedMotion ? 1 : 0,
                  transition: isHovered
                    ? 'transform 80ms ease-out, opacity 250ms ease-out'
                    : 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease-out',
                  willChange: 'transform, opacity',
                }}
              />
            </div>
          </div>
        </div>
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
    </div>
  );
};
