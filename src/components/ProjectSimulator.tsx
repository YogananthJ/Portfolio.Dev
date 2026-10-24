import React, { useState } from 'react';
import { ProjectItem } from '../types/portfolio';
import { CheckCircle2, AlertTriangle, XCircle, Sliders, RefreshCw, Send, Zap } from 'lucide-react';

interface ProjectSimulatorProps {
  project: ProjectItem;
}

export const ProjectSimulator: React.FC<ProjectSimulatorProps> = ({ project }) => {
  // 1. Loan Underwriting Simulator State
  const [creditScore, setCreditScore] = useState<number>(720);
  const [annualIncome, setAnnualIncome] = useState<number>(85000);
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [dtiRatio, setDtiRatio] = useState<number>(24);

  // 2. Food Classifier Simulator State
  const [selectedMeal, setSelectedMeal] = useState<'avocado' | 'salmon' | 'quinoa' | 'pancakes'>('salmon');
  const [portionSize, setPortionSize] = useState<number>(1.0);

  // 3. Event Pass Simulator State
  const [attendeeName, setAttendeeName] = useState<string>('Alex Johnson');
  const [ticketTier, setTicketTier] = useState<'Standard' | 'VIP' | 'Speaker'>('VIP');

  // 4. Wildfire Satellite Simulator State
  const [spectralBand, setSpectralBand] = useState<'rgb' | 'swir' | 'thermal'>('thermal');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(85);

  // 5. Supply Chain Simulator State
  const [selectedCorridor, setSelectedCorridor] = useState<'pacific' | 'atlantic' | 'rail'>('pacific');
  const [disruptionLevel, setDisruptionLevel] = useState<'low' | 'moderate' | 'severe'>('moderate');

  // 6. RAG Simulator State
  const [ragQuery, setRagQuery] = useState<string>('What is the service liability threshold?');
  const [isSearchingRag, setIsSearchingRag] = useState<boolean>(false);

  // 7. Cognitive AI Simulator State
  const [cognitiveInput, setCognitiveInput] = useState<string>('I am having a lot of difficulty getting this model to converge and feel lost.');
  const [simulatedHesitation, setSimulatedHesitation] = useState<number>(740);

  // --- Computations ---
  // Loan risk algorithm
  const computeLoanApproval = () => {
    // Weighted scoring logic
    let score = 0;
    score += (creditScore - 300) / (850 - 300) * 45;
    score += Math.min(annualIncome / 150000, 1) * 30;
    score -= Math.min(loanAmount / annualIncome, 1.5) * 25;
    score -= (dtiRatio / 60) * 20;

    const probability = Math.min(Math.max(Math.round(score + 15), 5), 98);
    const approved = probability >= 65;
    const review = probability >= 45 && probability < 65;

    return {
      probability,
      status: approved ? 'APPROVED' : review ? 'MANUAL REVIEW' : 'DENIED',
      color: approved ? 'text-emerald-600' : review ? 'text-amber-600' : 'text-rose-600',
      bgColor: approved ? 'bg-emerald-50 border-emerald-300' : review ? 'bg-amber-50 border-amber-300' : 'bg-rose-50 border-rose-300',
    };
  };

  const loanResult = computeLoanApproval();

  // Meals data
  const mealsData = {
    salmon: {
      name: 'Wild Salmon Bowl & Roasted Greens',
      baseCal: 540,
      protein: 42,
      carbs: 35,
      fats: 22,
      confidence: 0.94,
      box: { top: '15%', left: '20%', width: '60%', height: '65%' },
    },
    avocado: {
      name: 'Sourdough Avocado & Poached Eggs',
      baseCal: 420,
      protein: 18,
      carbs: 40,
      fats: 21,
      confidence: 0.96,
      box: { top: '20%', left: '15%', width: '70%', height: '60%' },
    },
    quinoa: {
      name: 'Mediterranean Quinoa & Chickpeas',
      baseCal: 480,
      protein: 16,
      carbs: 68,
      fats: 14,
      confidence: 0.91,
      box: { top: '10%', left: '18%', width: '65%', height: '70%' },
    },
    pancakes: {
      name: 'Oatmeal Protein Pancakes with Berries',
      baseCal: 390,
      protein: 28,
      carbs: 52,
      fats: 8,
      confidence: 0.89,
      box: { top: '25%', left: '22%', width: '55%', height: '55%' },
    },
  };

  const activeMeal = mealsData[selectedMeal];

  return (
    <div className="bg-[#F5F2EB] border-2 border-[#121212] p-5 sm:p-7 shadow-[4px_4px_0px_0px_#121212]">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#121212]/15">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#E11D48] rounded-full animate-pulse"></div>
          <h4 className="font-display text-lg sm:text-xl font-black text-[#121212] uppercase tracking-tight">
            {project.simulatorConfig.title}
          </h4>
        </div>
        <span className="text-xs font-mono uppercase tracking-wider text-[#121212]/60 font-semibold">
          Live Interactive Sandbox
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[#121212]/75 mb-6 font-medium">
        {project.simulatorConfig.description}
      </p>

      {/* --- SIMULATOR 1: LOAN APPROVAL --- */}
      {project.simulatorConfig.type === 'loan' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Sliders */}
            <div className="space-y-4 bg-white/70 p-4 border border-[#121212]/20">
              <div>
                <div className="flex justify-between text-xs font-mono font-semibold mb-1">
                  <span>Credit Score (FICO)</span>
                  <span className="font-bold text-[#E11D48] tabular-nums">{creditScore}</span>
                </div>
                <input
                  type="range"
                  min="350"
                  max="850"
                  value={creditScore}
                  onChange={(e) => setCreditScore(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#121212]/50 font-mono">
                  <span>Poor (350)</span>
                  <span>Fair (650)</span>
                  <span>Excellent (850)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono font-semibold mb-1">
                  <span>Annual Income</span>
                  <span className="font-bold text-[#121212] tabular-nums">${annualIncome.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="200000"
                  step="5000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full accent-[#121212] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono font-semibold mb-1">
                  <span>Requested Loan Amount</span>
                  <span className="font-bold text-[#121212] tabular-nums">${loanAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#121212] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono font-semibold mb-1">
                  <span>Debt-to-Income Ratio (DTI)</span>
                  <span className="font-bold text-[#121212] tabular-nums">{dtiRatio}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="55"
                  value={dtiRatio}
                  onChange={(e) => setDtiRatio(Number(e.target.value))}
                  className="w-full accent-[#121212] cursor-pointer"
                />
              </div>
            </div>

            {/* Real-time Model Underwriting Output */}
            <div className={`p-5 border-2 flex flex-col justify-between ${loanResult.bgColor}`}>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#121212]/60 font-bold mb-2">
                  XGBoost Underwriting Prediction
                </div>
                <div className={`font-display text-3xl sm:text-4xl font-black ${loanResult.color} mb-1`}>
                  {loanResult.status}
                </div>
                <div className="text-xs font-mono text-[#121212]/80 mb-4">
                  Approval Confidence: <strong className="tabular-nums">{loanResult.probability}%</strong>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-[#121212]/10 rounded-xs overflow-hidden mb-5">
                  <div
                    className={`h-full transition-all duration-300 ${
                      loanResult.probability >= 65
                        ? 'bg-emerald-600'
                        : loanResult.probability >= 45
                        ? 'bg-amber-500'
                        : 'bg-rose-600'
                    }`}
                    style={{ width: `${loanResult.probability}%` }}
                  ></div>
                </div>

                {/* SHAP Feature Impact Waterfall */}
                <div className="text-xs font-mono space-y-1.5 pt-2 border-t border-[#121212]/15">
                  <div className="text-[10px] uppercase font-bold text-[#121212]/60 mb-1">
                    Real-time SHAP Factor Contributions:
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Credit Score ({creditScore})</span>
                    <span className={creditScore > 680 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                      {creditScore > 680 ? '+0.42 SHAP' : '-0.38 SHAP'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>DTI Ratio ({dtiRatio}%)</span>
                    <span className={dtiRatio < 30 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                      {dtiRatio < 30 ? '+0.21 SHAP' : '-0.29 SHAP'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Income to Loan Ratio</span>
                    <span className={annualIncome > loanAmount * 2.5 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {annualIncome > loanAmount * 2.5 ? '+0.18 SHAP' : '-0.12 SHAP'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#121212]/60 pt-3 border-t border-[#121212]/10 flex items-center justify-between">
                <span>Model: XGBoost v2.1</span>
                <span>Latency: ~18ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SIMULATOR 2: FOOD CALORIE CLASSIFIER --- */}
      {project.simulatorConfig.type === 'food' && (
        <div className="space-y-6">
          {/* Dish Picker */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'salmon', label: 'Salmon Greens Bowl' },
              { id: 'avocado', label: 'Avocado & Poached Eggs' },
              { id: 'quinoa', label: 'Mediterranean Quinoa' },
              { id: 'pancakes', label: 'Protein Berry Pancakes' },
            ].map((dish) => (
              <button
                key={dish.id}
                onClick={() => setSelectedMeal(dish.id as any)}
                type="button"
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors border ${
                  selectedMeal === dish.id
                    ? 'bg-[#121212] text-white border-[#121212]'
                    : 'bg-white/80 text-[#121212] border-[#121212]/20 hover:bg-[#121212]/10'
                }`}
              >
                {dish.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Synthetic Computer Vision Display */}
            <div className="relative aspect-video bg-[#15231B] border-2 border-[#121212] p-4 flex flex-col justify-between text-white font-mono overflow-hidden">
              <div className="flex items-center justify-between text-[11px] text-emerald-400 border-b border-emerald-500/20 pb-1 z-10">
                <span>OPENCV_CAM_01 // 1080p</span>
                <span>CONF: {(activeMeal.confidence * 100).toFixed(1)}%</span>
              </div>

              {/* Bounding box simulation */}
              <div
                className="absolute border-2 border-dashed border-emerald-400 bg-emerald-500/10 transition-all duration-300 flex flex-col justify-between p-2"
                style={{
                  top: activeMeal.box.top,
                  left: activeMeal.box.left,
                  width: activeMeal.box.width,
                  height: activeMeal.box.height,
                }}
              >
                <span className="bg-emerald-500 text-black px-1.5 py-0.5 text-[10px] font-bold w-max">
                  {activeMeal.name}
                </span>
                <span className="text-[10px] text-emerald-300 text-right">
                  BBOX: [x1, y1, x2, y2]
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/50 pt-1 border-t border-emerald-500/20 z-10">
                <span>Preprocessing: CLAHE 2.0</span>
                <span>MobileNetV3 Backbone</span>
              </div>
            </div>

            {/* Nutritional & Portion Estimation */}
            <div className="bg-white/70 p-5 border border-[#121212]/20 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono font-bold mb-1">
                  <span>Portion Scale Multiplier</span>
                  <span className="text-[#E11D48] tabular-nums">{portionSize}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.25"
                  value={portionSize}
                  onChange={(e) => setPortionSize(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-[#121212]/15">
                <div className="text-xs font-mono uppercase text-[#121212]/60 font-semibold mb-1">Estimated Energy</div>
                <div className="font-display text-4xl font-black text-[#121212] tabular-nums">
                  {Math.round(activeMeal.baseCal * portionSize)} <span className="text-base font-normal font-mono text-[#121212]/60">kcal</span>
                </div>
              </div>

              {/* Macronutrient breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2 font-mono">
                <div className="p-2 bg-[#EBE6DC] border border-[#121212]/15">
                  <div className="text-[10px] uppercase text-[#121212]/60">Protein</div>
                  <div className="text-base font-bold text-emerald-800 tabular-nums">
                    {Math.round(activeMeal.protein * portionSize)}g
                  </div>
                </div>
                <div className="p-2 bg-[#EBE6DC] border border-[#121212]/15">
                  <div className="text-[10px] uppercase text-[#121212]/60">Carbs</div>
                  <div className="text-base font-bold text-amber-800 tabular-nums">
                    {Math.round(activeMeal.carbs * portionSize)}g
                  </div>
                </div>
                <div className="p-2 bg-[#EBE6DC] border border-[#121212]/15">
                  <div className="text-[10px] uppercase text-[#121212]/60">Fats</div>
                  <div className="text-base font-bold text-rose-800 tabular-nums">
                    {Math.round(activeMeal.fats * portionSize)}g
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SIMULATOR 3: EVENT MANAGEMENT & TICKET GENERATOR --- */}
      {project.simulatorConfig.type === 'event' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="space-y-4 bg-white/70 p-4 border border-[#121212]/20">
              <div>
                <label className="block text-xs font-mono font-bold uppercase mb-1">Attendee Name</label>
                <input
                  type="text"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#121212] font-mono focus:outline-[#E11D48]"
                  placeholder="Enter attendee name..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase mb-1">Access Tier</label>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  {(['Standard', 'VIP', 'Speaker'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setTicketTier(tier)}
                      type="button"
                      className={`py-2 px-1 text-center font-bold border transition-colors ${
                        ticketTier === tier
                          ? 'bg-[#121212] text-white border-[#121212]'
                          : 'bg-white text-[#121212] border-[#121212]/30 hover:bg-[#121212]/10'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs font-mono text-[#121212]/70 p-3 bg-[#EBE6DC] border border-[#121212]/15">
                <span>Stripe Payment Status: </span>
                <strong className="text-emerald-700">MOCK_SUCCESS_CHARGED ($99.00)</strong>
              </div>
            </div>

            {/* Generated Ticket Pass Card */}
            <div className="bg-[#121212] text-white p-5 border-2 border-[#121212] shadow-[4px_4px_0px_0px_#E11D48] flex flex-col justify-between font-mono">
              <div className="border-b border-white/20 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-[#E11D48] uppercase tracking-widest font-bold">EVENT ACCESS PASS 2026</span>
                  <div className="font-display text-xl font-bold tracking-tight text-white mt-1">
                    AI &amp; DEV CONF INDIA
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold uppercase bg-[#E11D48] text-white">
                  {ticketTier}
                </span>
              </div>

              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] text-white/50 uppercase">Attendee</div>
                  <div className="text-sm font-bold text-white uppercase">{attendeeName || 'Guest User'}</div>
                  <div className="text-[10px] text-white/50 uppercase mt-2">Ticket ID</div>
                  <div className="text-xs text-emerald-400 font-bold">#EVT-2026-{Math.abs(attendeeName.length * 179 + 421)}</div>
                </div>

                {/* QR visual */}
                <div className="w-16 h-16 bg-white p-1 rounded-xs flex items-center justify-center shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 24 24" fill="#121212">
                    <path d="M2 2h8v8H2zM4 4v4h4V4zm10-2h8v8h-8zM16 4v4h4V4zM2 14h8v8H2zm2 2v4h4v-4zm10 0h2v2h-2zm4 0h2v4h-2zm-4 4h4v2h-4zm6-2h2v4h-2zm-2-4h2v2h-2z" />
                  </svg>
                </div>
              </div>

              <div className="border-t border-dashed border-white/20 pt-2 flex justify-between text-[10px] text-white/50">
                <span>Verified by Clerk Auth</span>
                <span>Seat Zone: Front A-14</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SIMULATOR 4: WILDFIRE DETECTION --- */}
      {project.simulatorConfig.type === 'wildfire' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#121212]/70 font-bold">Spectral Band:</span>
              {(['rgb', 'swir', 'thermal'] as const).map((band) => (
                <button
                  key={band}
                  onClick={() => setSpectralBand(band)}
                  type="button"
                  className={`px-3 py-1 font-bold uppercase transition-colors border ${
                    spectralBand === band
                      ? 'bg-[#E11D48] text-white border-[#E11D48]'
                      : 'bg-white text-[#121212] border-[#121212]/30 hover:bg-[#121212]/10'
                  }`}
                >
                  {band === 'rgb' ? 'Optical RGB' : band === 'swir' ? 'Shortwave IR' : 'Thermal Infrared'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#121212]/70 font-bold">Threshold:</span>
              <span className="font-bold text-[#E11D48] tabular-nums">{confidenceThreshold}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Satellite Raster Viewport */}
            <div className="relative aspect-video bg-[#1B1115] border-2 border-[#121212] p-4 flex flex-col justify-between text-white font-mono overflow-hidden">
              <div className="flex justify-between text-[11px] text-rose-400 border-b border-rose-500/20 pb-1 z-10">
                <span>LANDSAT-9 // MULTI-BAND TENSOR</span>
                <span>STATUS: ANOMALY FLAGGED</span>
              </div>

              {/* Spectral background simulation */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  spectralBand === 'rgb'
                    ? 'bg-gradient-to-br from-emerald-950 via-amber-950 to-stone-900 opacity-80'
                    : spectralBand === 'swir'
                    ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-stone-900 opacity-90'
                    : 'bg-gradient-to-br from-rose-950 via-red-950 to-black opacity-95'
                }`}
              ></div>

              {/* Thermal Hotspot Marker */}
              <div className="relative flex items-center justify-center my-auto z-10">
                <span className="absolute w-20 h-20 rounded-full border border-rose-500/60 animate-ping"></span>
                <span className="absolute w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500"></span>
                <span className="w-4 h-4 rounded-full bg-[#F20D26] shadow-[0_0_12px_#F20D26]"></span>
              </div>

              <div className="flex justify-between text-[10px] text-white/50 pt-1 border-t border-rose-500/20 z-10">
                <span>Grid Ref: 14N_4821E</span>
                <span className="text-rose-400 font-bold">DenseNet Classification: Active Wildfire (96.4%)</span>
              </div>
            </div>

            {/* Threshold Slider and Coordinate Metadata */}
            <div className="bg-white/70 p-5 border border-[#121212]/20 space-y-4 font-mono">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">
                  Confidence Filter Sensitivity
                </label>
                <input
                  type="range"
                  min="50"
                  max="98"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-[#121212]/15">
                <div className="flex justify-between">
                  <span className="text-[#121212]/60">Detected Coordinates:</span>
                  <span className="font-bold text-[#121212]">34.205° N, 118.172° W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#121212]/60">Estimated Perimeter:</span>
                  <span className="font-bold text-[#121212]">2.4 sq km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#121212]/60">False Positive Guard:</span>
                  <span className="font-bold text-emerald-700">Cloud Reflectance Masked</span>
                </div>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <strong>Emergency GIS Feed:</strong> GeoJSON telemetry stream ready for dispatch.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SIMULATOR 5: SUPPLY CHAIN ANALYTICS --- */}
      {project.simulatorConfig.type === 'supply-chain' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-white/70 p-4 border border-[#121212]/20 font-mono text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Selected Corridor</label>
                <select
                  value={selectedCorridor}
                  onChange={(e) => setSelectedCorridor(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#121212] font-mono focus:outline-[#E11D48]"
                >
                  <option value="pacific">Asia-Pacific Maritime (Shanghai &rarr; LA)</option>
                  <option value="atlantic">Trans-Atlantic Air Cargo (Frankfurt &rarr; JFK)</option>
                  <option value="rail">Eurasian High-Speed Rail Corridor</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Port Congestion &amp; Weather Shock</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'moderate', 'severe'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setDisruptionLevel(lvl)}
                      type="button"
                      className={`py-2 px-1 text-center font-bold uppercase border transition-colors ${
                        disruptionLevel === lvl
                          ? 'bg-[#121212] text-white border-[#121212]'
                          : 'bg-white text-[#121212] border-[#121212]/30 hover:bg-[#121212]/10'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="bg-[#0F1E24] text-white p-5 border-2 border-[#121212] font-mono flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider mb-2">
                  Predictive Logistics Risk Assessment
                </div>
                <div className="font-display text-3xl font-black text-white mb-2">
                  {disruptionLevel === 'low' ? '+0.8 Days' : disruptionLevel === 'moderate' ? '+3.4 Days' : '+8.2 Days'}
                </div>
                <div className="text-xs text-white/70 mb-4">
                  Estimated Arrival Variance: <strong className="text-amber-400">{disruptionLevel === 'severe' ? 'HIGH RISK' : 'MANAGED'}</strong>
                </div>

                <div className="space-y-2 text-xs pt-3 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/60">Recommended Safety Buffer:</span>
                    <span className="text-cyan-300 font-bold">
                      {disruptionLevel === 'low' ? '12% Extra Stock' : disruptionLevel === 'moderate' ? '28% Extra Stock' : '45% Extra Stock'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Stockout Probability:</span>
                    <span className={disruptionLevel === 'severe' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {disruptionLevel === 'low' ? '3.1%' : disruptionLevel === 'moderate' ? '14.8%' : '38.4%'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-white/40 pt-2 border-t border-white/10 flex justify-between">
                <span>Monte Carlo Simulations: 10,000 iterations</span>
                <span>Optimized by Pandas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SIMULATOR 6: PDF RAG ASSISTANT --- */}
      {project.simulatorConfig.type === 'rag' && (
        <div className="space-y-6">
          <div className="bg-white/70 p-4 border border-[#121212]/20 font-mono text-xs">
            <label className="block font-bold uppercase mb-2">Semantic Document Query Prompt</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-[#121212] focus:outline-[#E11D48]"
                placeholder="Ask technical question on ingested PDF..."
              />
              <button
                onClick={() => {
                  setIsSearchingRag(true);
                  setTimeout(() => setIsSearchingRag(false), 500);
                }}
                type="button"
                className="px-4 py-2 bg-[#121212] text-white font-bold hover:bg-[#E11D48] transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Search</span>
              </button>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[
                'What is the service liability threshold?',
                'Explain token rate limiting policy',
                'What are the encryption standards for at-rest storage?',
              ].map((query) => (
                <button
                  key={query}
                  onClick={() => setRagQuery(query)}
                  type="button"
                  className="text-[11px] px-2 py-1 bg-[#EBE6DC] hover:bg-[#121212] hover:text-white border border-[#121212]/20 transition-colors"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>

          {/* RAG Vector Retrieval Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* Retrieved Chunks */}
            <div className="bg-[#181324] text-white p-4 border border-purple-500/30 space-y-3">
              <div className="flex justify-between items-center text-purple-400 font-bold border-b border-purple-500/20 pb-2">
                <span>RETRIEVED VECTOR CHUNKS</span>
                <span className="text-emerald-400">FAISS / ChromaDB</span>
              </div>
              <div className="bg-black/50 p-2.5 border border-purple-500/30">
                <div className="flex justify-between text-[10px] text-purple-300 font-bold mb-1">
                  <span>[Page 14, Para 3]</span>
                  <span className="text-emerald-400">Cosine Similarity: 0.912</span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  "Section 8.2: Service availability obligations shall trigger liquidated credits if monthly uptime drops below 99.9% without prior maintenance disclosure..."
                </p>
              </div>
              <div className="bg-black/50 p-2.5 border border-purple-500/20">
                <div className="flex justify-between text-[10px] text-purple-300 font-bold mb-1">
                  <span>[Page 18, Para 1]</span>
                  <span className="text-emerald-400">Cosine Similarity: 0.864</span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  "Maximum aggregate payout under standard SLA claims is capped at 30% of total invoiced period charges."
                </p>
              </div>
            </div>

            {/* Generated Synthesized Answer */}
            <div className="bg-white p-4 border border-[#121212]/30 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[#121212]/60 font-bold border-b border-[#121212]/15 pb-2 mb-3">
                  <span className="text-[#E11D48]">LLAMA 3.1 GROUNDED ANSWER</span>
                  <span>Strict Grounding</span>
                </div>
                <p className="text-xs leading-relaxed text-[#121212] mb-3">
                  Based on <strong>Page 14 (Section 8.2)</strong> and <strong>Page 18</strong>, the service liability threshold is activated when monthly uptime falls below <strong>99.9%</strong>. Penalties are distributed as service credits, capped at a maximum of <strong>30%</strong> of the monthly invoice.
                </p>
                <div className="p-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px]">
                  <strong>Citation Confidence:</strong> 99.4% verifiable against source PDF. Zero hallucinated terms detected.
                </div>
              </div>
              <div className="text-[10px] text-[#121212]/50 pt-2 border-t border-[#121212]/10 flex justify-between">
                <span>Embedding Model: BGE-Large</span>
                <span>Latency: 178ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SIMULATOR 7: COGNITIVE AI --- */}
      {project.simulatorConfig.type === 'cognitive' && (
        <div className="space-y-6">
          <div className="bg-white/70 p-4 border border-[#121212]/20 font-mono text-xs">
            <label className="block font-bold uppercase mb-2">User Dialogue Input Sandbox</label>
            <textarea
              value={cognitiveInput}
              onChange={(e) => setCognitiveInput(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-white border border-[#121212] focus:outline-[#E11D48]"
              placeholder="Type message to evaluate cognitive cadence and sentiment..."
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "I've been trying to debug this PyTorch gradient issue for 3 hours and nothing works.",
                "Can you verify if this matrix multiplication shape is correct?",
                "Great! That solved the entire error, thank you so much!",
              ].map((sample, i) => (
                <button
                  key={i}
                  onClick={() => setCognitiveInput(sample)}
                  type="button"
                  className="text-[11px] px-2 py-1 bg-[#EBE6DC] hover:bg-[#121212] hover:text-white border border-[#121212]/20 transition-colors"
                >
                  Preset {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* Cognitive telemetry */}
            <div className="bg-[#201019] text-white p-4 border border-pink-500/30 space-y-3">
              <div className="flex justify-between items-center text-pink-400 font-bold border-b border-pink-500/20 pb-2">
                <span>COGNITIVE SIGNALS</span>
                <span className="text-pink-300">RoBERTa Classifier</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span>Sentiment Polarity:</span>
                  <span className={cognitiveInput.includes('works') || cognitiveInput.includes('Great') ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {cognitiveInput.includes('works') || cognitiveInput.includes('Great') ? 'Positive / Confident' : 'Frustrated / Uncertain'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Simulated Keystroke Pause:</span>
                  <span className="text-amber-400 font-bold">840ms (High Hesitation)</span>
                </div>
                <div className="flex justify-between">
                  <span>Cognitive Load Index:</span>
                  <span className="text-pink-400 font-bold">Medium-High</span>
                </div>
              </div>
            </div>

            {/* Dynamic Tuned Response */}
            <div className="bg-white p-4 border border-[#121212]/30 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[#121212]/60 font-bold border-b border-[#121212]/15 pb-2 mb-2">
                  <span className="text-[#E11D48]">ADAPTIVE RESPONSE MODULATION</span>
                  <span>Empathetic Mode</span>
                </div>
                <p className="text-xs leading-relaxed text-[#121212]">
                  {cognitiveInput.includes('Great') ? (
                    "Awesome to hear that! Would you like me to show you how to profile memory usage on that model next?"
                  ) : (
                    "I completely understand how exhausting gradient issues can be. Let's take it one step at a time: first, let's print `tensor.grad_fn` on your loss tensor to ensure your computation graph isn't being detached."
                  )}
                </p>
              </div>
              <div className="text-[10px] text-[#121212]/50 pt-2 border-t border-[#121212]/10 flex justify-between">
                <span>Tone: Supportive &amp; Deconstructed</span>
                <span>Response Speed: 85ms</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
